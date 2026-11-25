import { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  X, Volume2, VolumeX, Mic, MicOff, Loader2, ArrowUp, Square, FileText, Check, XCircle,
  MessagesSquare, Plus, Trash2, ArrowLeft, Brain, Copy, ExternalLink, Hand,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAtlasHistory } from '@/hooks/useAtlasHistory';
import IconTooltip from '@/components/IconTooltip';
import AtlasOrb, { type OrbState } from '@/components/atlas/AtlasOrb';
import AtlasIntroCard, { type IntroDetails } from '@/components/atlas/AtlasIntroCard';
import * as store from '@/lib/atlasStore';
import type { AtlasChatMessage } from '@/lib/atlasStore';
import { invokeFunction } from '@/lib/invokeFunction';
import { useAtlasConfig } from '@/hooks/useSiteSettings';

/** Other parts of the app (e.g. /admin/atlas) can open Atlas on a saved conversation. */
export const ATLAS_OPEN_EVENT = 'atlas:open-thread';
export const openAtlasThread = (threadId: string | null) =>
  window.dispatchEvent(new CustomEvent(ATLAS_OPEN_EVENT, { detail: { threadId } }));

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Message = AtlasChatMessage;
type View = 'chat' | 'chats' | 'memory';
type BlogDraft = { title: string; excerpt: string; content: string; category: string; tags: string[]; readTime: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const VISITOR_PROMPTS = [
  'What kind of designer is Qomardeen?',
  'Walk me through the WalPay case study',
  'Is he available, and for what roles?',
  'How was this website built?',
];
const ADMIN_PROMPTS = [
  'What do visitors usually need to know first?',
  'Summarise my case studies in one line each',
  'Write a blog post',
];

/* ── commands Atlas can put in a reply ─────────────────────────────── */
const NAV_RE = /\[\[NAVIGATE:(\/[^\]]*)\]\]/g;
const REMEMBER_RE = /\[\[REMEMBER:([^\]]*)\]\]/g;
const SAFE_PATH = /^\/(?:[A-Za-z0-9][A-Za-z0-9_\-/]*)?(?:[?#][A-Za-z0-9_\-=&%./]*)?$/;

/** Text to show: no commands, and no half-typed "[[..." while streaming. */
const visibleText = (content: string) =>
  content
    .replace(NAV_RE, '')
    .replace(REMEMBER_RE, '')
    .replace(/\[\[BLOG_POST\]\][\s\S]*?\[\[\/BLOG_POST\]\]/g, '')
    .replace(/\[\[PUBLISH_BLOG\]\]/g, '')
    .replace(/\[\[[^\]]*$/, '')
    .trim();

const navLinks = (content: string) =>
  [...new Set([...content.matchAll(NAV_RE)].map(m => m[1]))].filter(p => SAFE_PATH.test(p)).slice(0, 2);
const rememberedFacts = (content: string) =>
  [...content.matchAll(REMEMBER_RE)].map(m => m[1].trim()).filter(Boolean).slice(0, 1);

/** Human names for the pages Atlas links to. */
const pageName = (path: string) => {
  const known: Record<string, string> = {
    '/': 'Home', '/projects': 'All projects', '/projects/uptime': 'UpTime case study',
    '/projects/walpay': 'WalPay case study', '/projects/portfolio': 'Portfolio case study', '/projects/fragrance': 'Leafie case study',
    '/hire': 'Hire page', '/hire#contact': 'Contact Qomardeen', '/about': 'About Qomardeen',
    '/explore': 'Explore', '/explore/articles': 'Articles', '/explore/thinking': 'Thinking',
    '/explore/architecture': 'Architecture',
  };
  if (known[path]) return known[path];
  const last = path.split(/[/#?]/).filter(Boolean).pop() ?? '';
  return last.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) || 'Open page';
};

function parseBlogPost(content: string): BlogDraft | null {
  const m = content.match(/\[\[BLOG_POST\]\]([\s\S]*?)\[\[\/BLOG_POST\]\]/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return null; }
}

async function streamChat({ messages, memory, onDelta, onDone, signal }: {
  messages: { role: 'user' | 'assistant'; content: string }[];
  memory: string[];
  onDelta: (text: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
}) {
  // Admin capabilities are decided server-side from the session token.
  const { data: { session } } = await supabase.auth.getSession();
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, memory }),
    signal,
  });
  if (!resp.ok || !resp.body) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to connect');
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const handle = (line: string): boolean => {
    if (line.endsWith('\r')) line = line.slice(0, -1);
    if (!line.startsWith('data: ')) return false;
    const json = line.slice(6).trim();
    if (json === '[DONE]') return true;
    try {
      const c = JSON.parse(json).choices?.[0]?.delta?.content as string | undefined;
      if (c) onDelta(c);
    } catch { /* partial line, ignore */ }
    return false;
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let i: number;
    let finished = false;
    while ((i = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, i);
      buffer = buffer.slice(i + 1);
      if (handle(line)) { finished = true; break; }
    }
    if (finished) break;
  }
  if (buffer.trim()) buffer.split('\n').forEach(handle);
  onDone();
}

/* ── one message ───────────────────────────────────────────────────── */
const MessageRow = memo(({
  msg, streaming, onOpen, onForget,
}: { msg: Message; streaming: boolean; onOpen: (path: string) => void; onForget: (fact: string) => void }) => {
  const [copied, setCopied] = useState(false);
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-[20px] rounded-br-md bg-foreground px-4 py-2.5 text-[15px] leading-relaxed text-background">
          {msg.content}
        </p>
      </div>
    );
  }
  const text = visibleText(msg.content);
  const links = streaming ? [] : navLinks(msg.content);
  return (
    <div className="group">
      {streaming ? (
        <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/90">{text}</div>
      ) : (
        <div className="prose prose-sm max-w-none break-words text-[15px] leading-relaxed text-foreground/90 dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-[15px] [&_strong]:text-foreground [&_a]:text-primary">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => onOpen(p)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Open {pageName(p)}
            </button>
          ))}
        </div>
      )}
      {msg.remembered && msg.remembered.length > 0 && (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            Remembered: {msg.remembered.join('; ')}.{' '}
            <button type="button" onClick={() => msg.remembered!.forEach(onForget)} className="underline underline-offset-2 hover:text-foreground">
              Forget
            </button>
          </span>
        </p>
      )}
      {!streaming && text && (
        <div className="mt-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          <IconTooltip label={copied ? 'Copied' : 'Copy'} side="bottom">
            <button
              type="button"
              aria-label="Copy answer"
              onClick={() => { void navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </IconTooltip>
        </div>
      )}
    </div>
  );
});
MessageRow.displayName = 'MessageRow';

const HeaderButton = ({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: React.ReactNode }) => (
  <IconTooltip label={label} side="bottom">
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`grid h-10 w-10 place-items-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active ? 'bg-foreground/[0.07] text-foreground' : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground'
      }`}
    >
      {children}
    </button>
  </IconTooltip>
);

/* ── the assistant ─────────────────────────────────────────────────── */
const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingBlogDraft, setPendingBlogDraft] = useState<BlogDraft | null>(null);
  const [blogPublishing, setBlogPublishing] = useState(false);
  const [chats, setChats] = useState(store.loadChats);
  const [memory, setMemory] = useState(store.loadMemory);
  const [memoryOn, setMemoryOn] = useState(store.memoryEnabled);
  const [chatId, setChatId] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [introBusy, setIntroBusy] = useState(false);
  const [introError, setIntroError] = useState('');
  const [introduced, setIntroduced] = useState(store.hasIntroduced);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const sendRef = useRef<((text: string) => void) | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { isAdmin } = useAdminAuth();
  const atlasConfig = useAtlasConfig();
  // Switched off in Admin › Site: hidden from visitors, still available inside the admin.
  const hiddenForVisitors = !atlasConfig.enabled && !location.pathname.startsWith('/admin');
  const prompts = isAdmin ? ADMIN_PROMPTS : VISITOR_PROMPTS;
  const orbState: OrbState = isLoading ? 'thinking' : isSpeaking ? 'speaking' : 'idle';

  // Admins keep their conversations in the cloud (across devices); visitors keep theirs on this device.
  const history = useAtlasHistory(isAdmin);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const restoredRef = useRef(false);

  const stopRequest = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    sendingRef.current = false;
    setIsLoading(false);
  };

  const openThread = useCallback(async (threadId: string | null) => {
    stopRequest();
    setPendingBlogDraft(null);
    setView('chat');
    setActiveThreadId(threadId);
    history.rememberThread(threadId);
    if (!threadId) { setMessages([]); return; }
    setHistoryLoading(true);
    setMessages(await history.loadMessages(threadId));
    setHistoryLoading(false);
  }, [history]);

  const openLocalChat = useCallback((id: string | null) => {
    stopRequest();
    setView('chat');
    setChatId(id);
    store.setActiveChatId(id);
    setMessages(id ? store.loadChats().find(c => c.id === id)?.messages ?? [] : []);
  }, []);

  const newChat = () => (isAdmin ? void openThread(null) : openLocalChat(null));

  // When Atlas first opens, continue the last conversation.
  useEffect(() => {
    if (!isOpen || restoredRef.current) return;
    restoredRef.current = true;
    if (messages.length) return;
    if (isAdmin) {
      const last = history.lastThreadId();
      if (last) void openThread(last);
    } else {
      const last = store.activeChatId();
      if (last && store.loadChats().some(c => c.id === last)) openLocalChat(last);
    }
  }, [isOpen, isAdmin, history, openThread, openLocalChat, messages.length]);

  useEffect(() => {
    if (!isAdmin) { setActiveThreadId(null); restoredRef.current = false; }
  }, [isAdmin]);

  // Visitors: save the conversation on this device whenever it settles.
  useEffect(() => {
    if (isAdmin || isLoading || messages.length === 0) return;
    const saved = chatId ? store.loadChats().find(c => c.id === chatId) : undefined;
    // Just reopening a chat shouldn't bump it to the top of the list.
    if (saved && saved.messages.length === messages.length && saved.messages.at(-1)?.content === messages.at(-1)?.content
      && JSON.stringify(saved.messages.at(-1)?.remembered ?? []) === JSON.stringify(messages.at(-1)?.remembered ?? [])) return;
    const id = chatId ?? store.newId();
    if (!chatId) { setChatId(id); store.setActiveChatId(id); }
    const firstUser = messages.find(m => m.role === 'user')?.content ?? 'New chat';
    store.saveChat({ id, title: store.chatTitle(firstUser), updatedAt: Date.now(), messages });
    setChats(store.loadChats());
  }, [messages, isLoading, isAdmin, chatId]);

  // The admin history page can open a specific conversation here.
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<{ threadId: string | null }>).detail?.threadId ?? null;
      setIsOpen(true);
      restoredRef.current = true;
      void openThread(id);
    };
    window.addEventListener(ATLAS_OPEN_EVENT, handler);
    return () => window.removeEventListener(ATLAS_OPEN_EVENT, handler);
  }, [openThread]);

  // The hero's "Ask Atlas" chips open Atlas with a question (in a fresh chat).
  useEffect(() => {
    (window as unknown as { __atlasReady?: boolean }).__atlasReady = true;
    const ask = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (!prompt) return;
      restoredRef.current = true;
      setIsOpen(true);
      setView('chat');
      setTimeout(() => sendRef.current?.(prompt), 60);
    };
    window.addEventListener('atlas:ask', ask);
    return () => {
      window.removeEventListener('atlas:ask', ask);
      (window as unknown as { __atlasReady?: boolean }).__atlasReady = false;
    };
  }, []);

  // The greeting: ~10s into a visit, once per visit, never after an introduction or in the admin.
  useEffect(() => {
    if (hiddenForVisitors || isAdmin || location.pathname.startsWith('/admin') || !store.shouldGreet()) return;
    const id = setTimeout(() => {
      if (!store.shouldGreet()) return;
      store.markGreeted();
      setNudge(true);
    }, 10000);
    return () => clearTimeout(id);
  }, [hiddenForVisitors, isAdmin, location.pathname]);
  useEffect(() => { if (isOpen) setNudge(false); }, [isOpen]);

  const startIntro = () => {
    setNudge(false);
    setIsOpen(true);
    restoredRef.current = true;
    if (!isAdmin && messages.length) openLocalChat(null);
    setView('chat');
    setIntroError('');
    setIntroOpen(true);
  };
  const dismissNudge = () => { setNudge(false); store.dismissGreeting(); };

  const sendIntro = async (d: IntroDetails) => {
    setIntroBusy(true);
    setIntroError('');
    const name = d.name.trim();
    try {
      await invokeFunction('submit-inquiry', {
        kind: 'atlas-intro', name, company: d.role.trim(), projectType: d.reason, email: d.email.trim(), message: d.note.trim(),
      });
      store.markIntroduced();
      setIntroduced(true);
      setIntroOpen(false);
      const first = name.split(/\s+/)[0];
      const next: Record<string, string> = {
        Hiring: "If you're hiring, his WalPay case study and the Hire page are the best places to start.\n\n[[NAVIGATE:/projects/walpay]]\n[[NAVIGATE:/hire]]",
        'A project': 'The Hire page shows how he works on projects and how to book a call.\n\n[[NAVIGATE:/hire]]',
        'Just looking': 'If you want the quick tour, the case study about this very site is a good start.\n\n[[NAVIGATE:/projects/portfolio]]',
      };
      const facts = memoryOn
        ? store.remember([`Name is ${name}`, ...(d.role.trim() ? [`Works as: ${d.role.trim()}`] : []), ...(d.reason ? [`Visiting for: ${d.reason}`] : [])])
        : [];
      if (facts.length) setMemory(store.loadMemory());
      const why: Record<string, string> = {
        Hiring: "I'm hiring.", 'A project': 'I have a project in mind.', 'Just looking': 'Just having a look around.', 'Something else': '',
      };
      const said = `Hi, I'm ${name}${d.role.trim() ? `, ${d.role.trim().replace(/[.\s]+$/, '')}` : ''}. ${why[d.reason] ?? ''}`.trim();
      setMessages(prev => [
        ...prev,
        { role: 'user', content: said },
        {
          role: 'assistant',
          content: `Lovely to meet you, ${first}. I've let Qomardeen know you stopped by${d.email.trim() ? ", and he'll reply by email" : ''}. He'll appreciate it.\n\n${next[d.reason] ?? 'What would you like to know first?'}`,
          ...(facts.length ? { remembered: facts } : {}),
        },
      ]);
    } catch (e) {
      setIntroError(e instanceof Error ? e.message : "That didn't go through. Try again.");
    } finally {
      setIntroBusy(false);
    }
  };

  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsSpeaking(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    stopSpeaking();
    setTimeout(() => launcherRef.current?.focus(), 0);
  }, [stopSpeaking]);

  // Close on outside click (desktop) and on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [isOpen, close]);

  /* ── Close after inactivity ────────────────────────────────────────────────────────────
   * Counts from the visitor's last tap, scroll, key or pointer move inside Atlas. Paused while
   * Atlas is answering, speaking or listening, while something is typed, during the intro or a
   * blog draft, and while the tab is in the background. A fresh answer adds reading time
   * (about 4 words a second). The last 5 seconds show a countdown with a "Keep open" button.
   */
  const [closingIn, setClosingIn] = useState<number | null>(null);
  const lastActivityRef = useRef(Date.now());
  const busyRef = useRef(false);
  const limitRef = useRef(0);
  busyRef.current = isLoading || isSpeaking || isListening || introBusy || blogPublishing || !!pendingBlogDraft || input.trim().length > 0;
  {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    const words = last ? last.content.split(/\s+/).filter(Boolean).length : 0;
    limitRef.current = atlasConfig.idleSeconds * 1000 + Math.min(60_000, (words / 4) * 1000);
  }
  const keepOpen = useCallback(() => { lastActivityRef.current = Date.now(); setClosingIn(null); }, []);
  // A new message counts as activity, so the reading time starts when the answer lands.
  useEffect(() => { keepOpen(); }, [messages.length, isLoading, keepOpen]);
  useEffect(() => {
    if (!isOpen || !atlasConfig.idleSeconds) { setClosingIn(null); return; }
    keepOpen();
    const panel = panelRef.current;
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'focusin', 'input'] as const;
    events.forEach(e => panel?.addEventListener(e, keepOpen, { passive: true }));
    panel?.addEventListener('scroll', keepOpen, { capture: true, passive: true });
    const id = window.setInterval(() => {
      if (busyRef.current || document.hidden) { keepOpen(); return; }
      const left = limitRef.current - (Date.now() - lastActivityRef.current);
      if (left <= 0) { setClosingIn(null); close(); return; }
      setClosingIn(left <= 5000 ? Math.ceil(left / 1000) : null);
    }, 250);
    return () => {
      window.clearInterval(id);
      events.forEach(e => panel?.removeEventListener(e, keepOpen));
      panel?.removeEventListener('scroll', keepOpen, { capture: true });
    };
  }, [isOpen, atlasConfig.idleSeconds, close, keepOpen]);

  // Phones: Atlas fills the screen, so the page behind shouldn't scroll.
  useEffect(() => {
    if (!isOpen || !window.matchMedia('(max-width: 639px)').matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Focus the message box on open (not on touch screens, where it would pop the keyboard over the suggestions).
  useEffect(() => {
    if (isOpen && view === 'chat' && window.matchMedia('(pointer: fine)').matches) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, view]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, view]);

  useEffect(() => () => {
    requestRef.current?.abort();
    recognitionRef.current?.stop();
    audioRef.current?.pause();
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const openPage = (path: string) => {
    const lang = location.pathname.match(/^\/(en|ar|de|es|fr|ha|ig|pcm|pt|ru|yo)(?:\/|$)/)?.[1] ?? 'en';
    navigate(path === '/' ? `/${lang}` : `/${lang}${path}`);
    if (window.matchMedia('(max-width: 639px)').matches) close();
  };

  const forgetFact = (fact: string) => {
    store.forget(fact);
    setMemory(store.loadMemory());
    setMessages(prev => prev.map(m => (m.remembered?.includes(fact) ? { ...m, remembered: m.remembered.filter(f => f !== fact) } : m)));
  };

  const playTTS = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    try {
      setIsSpeaking(true);
      const clean = visibleText(text).replace(/[#*_`~[\]()>]/g, '').slice(0, 1000);
      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ text: clean }),
      });
      if (!response.ok) throw new Error('TTS failed');
      const data = await response.json();
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (e) {
      console.error('TTS error:', e);
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const toggleListening = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = document.documentElement.lang || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => { setInput(event.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const send = async (text: string) => {
    if (!text.trim() || sendingRef.current) return;
    sendingRef.current = true;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const before = messages;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setView('chat');
    stopSpeaking();

    let soFar = '';
    let flushTimer: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();
    requestRef.current?.abort();
    requestRef.current = controller;

    const flush = (extra?: Partial<Message>) => {
      flushTimer = null;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: soFar, ...extra } : m));
        return [...prev, { role: 'assistant', content: soFar, ...extra }];
      });
    };
    // At most ~20 screen updates a second while the answer streams in.
    const onDelta = (chunk: string) => {
      soFar += chunk;
      if (!flushTimer) flushTimer = setTimeout(() => flush(), 50);
    };

    let threadId = activeThreadId;
    if (isAdmin) {
      if (!threadId) {
        threadId = await history.createThread(userMsg.content.slice(0, 60));
        if (threadId) { setActiveThreadId(threadId); history.rememberThread(threadId); }
      }
      if (threadId) void history.appendMessage(threadId, userMsg);
    }

    // Send the recent conversation (without memory commands) plus what the visitor let Atlas remember.
    const outgoing = [...before, userMsg].slice(-20).map(m => ({ role: m.role, content: m.content.replace(REMEMBER_RE, '').slice(0, 4000) }));
    const memoryForRequest = memoryOn ? store.loadMemory().map(m => m.text) : [];

    try {
      await streamChat({
        messages: outgoing,
        memory: memoryForRequest,
        onDelta,
        signal: controller.signal,
        onDone: () => {
          if (flushTimer) clearTimeout(flushTimer);
          const facts = memoryOn ? store.remember(rememberedFacts(soFar)) : [];
          if (facts.length) setMemory(store.loadMemory());
          flush(facts.length ? { remembered: facts } : undefined);
          sendingRef.current = false;
          requestRef.current = null;
          setIsLoading(false);
          if (isAdmin && threadId && soFar) void history.appendMessage(threadId, { role: 'assistant', content: soFar });
          const draft = parseBlogPost(soFar);
          if (draft) setPendingBlogDraft(draft);
          if (soFar.includes('[[PUBLISH_BLOG]]')) void handlePublishBlog();
          if (voiceEnabled && soFar) void playTTS(soFar);
        },
      });
    } catch (e) {
      if (flushTimer) clearTimeout(flushTimer);
      sendingRef.current = false;
      requestRef.current = null;
      if (controller.signal.aborted) { if (soFar) flush(); return; }
      console.error(e);
      setIsLoading(false);
      const msg = e instanceof Error && /quickly|rate/i.test(e.message)
        ? e.message
        : "I couldn't reach my answers just now. Check your connection and send that again.";
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    }
  };
  sendRef.current = send;

  const handlePublishBlog = async () => {
    if (!pendingBlogDraft) return;
    setBlogPublishing(true);
    try {
      const slug = pendingBlogDraft.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80);
      const { data, error } = await supabase
        .from('ai_blog_posts')
        .insert({
          slug, title: pendingBlogDraft.title, excerpt: pendingBlogDraft.excerpt, content: pendingBlogDraft.content,
          category: pendingBlogDraft.category, tags: pendingBlogDraft.tags, read_time: pendingBlogDraft.readTime, status: 'draft',
        })
        .select()
        .single();
      if (error) throw error;
      const { error: pubError } = await supabase
        .from('ai_blog_posts')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', data.id);
      if (pubError) throw pubError;
      setMessages(prev => [...prev, { role: 'assistant', content: `Published **"${pendingBlogDraft.title}"**. You'll find it on the blog page.` }]);
      setPendingBlogDraft(null);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `The post wasn't published: ${e instanceof Error ? e.message : 'unknown error'}. Try again.` }]);
    } finally {
      setBlogPublishing(false);
    }
  };

  const toggleMemory = () => {
    const next = !memoryOn;
    setMemoryOn(next);
    store.setMemoryEnabled(next);
  };

  const showSuggestions = view === 'chat' && messages.length === 0 && !historyLoading && !introOpen;
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } };

  if (hiddenForVisitors) return null;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className={`fixed right-5 z-50 flex h-12 items-center gap-2 rounded-full bg-foreground pl-1.5 pr-4 text-background shadow-lg bottom-5 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            aria-label="Ask Atlas, the AI guide to Qomardeen's work"
            aria-haspopup="dialog"
          >
            {nudge && !reduceMotion && (
              <span aria-hidden="true" className="pointer-events-none absolute -inset-1 rounded-full ring-2 ring-primary/60 animate-ping" />
            )}
            <span className={`grid h-9 w-9 place-items-center rounded-full bg-background ${nudge ? 'shadow-[0_0_18px_4px_hsl(var(--primary)/0.55)]' : ''}`}>
              <AtlasOrb size={26} state={nudge ? 'speaking' : 'idle'} />
            </span>
            <span className="text-[15px] font-medium tracking-tight">Ask Atlas</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Greeting: invites visitors to say hello */}
      <AnimatePresence>
        {nudge && !isOpen && (
          <motion.div
            role="dialog"
            aria-label="Atlas says hello"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="atlas-glass fixed bottom-[5.25rem] right-5 z-50 w-[min(340px,calc(100vw-2.5rem))] rounded-3xl p-4"
          >
            <div className="flex items-start gap-3">
              <AtlasOrb size={36} state="speaking" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold tracking-tight">Hi, I'm Atlas</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Qomardeen's AI guide. Ask me anything about his work and I'll take you straight to it.
                  Mind telling me who you are? I'll let him know you stopped by. He'll be glad you did.
                </p>
              </div>
              <button type="button" onClick={dismissNudge} aria-label="Close" className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2 min-[380px]:flex-row">
              <button type="button" onClick={startIntro} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-3 text-sm font-semibold text-background min-[380px]:flex-1">
                <Hand className="h-4 w-4" aria-hidden="true" /> Introduce myself
              </button>
              <button type="button" onClick={dismissNudge} className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-border px-3.5 text-sm font-medium hover:border-foreground/40">
                Just browsing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel: docked to the right on larger screens, full screen on phones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Atlas, AI guide"
            aria-modal="false"
            {...panelMotion}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="atlas-glass fixed inset-0 z-[70] isolate flex flex-col overflow-hidden sm:inset-auto sm:bottom-4 sm:right-4 sm:top-[4.5rem] sm:w-[420px] sm:rounded-[28px]"
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Soft light inside the glass */}
            <div aria-hidden="true" className="atlas-sheen pointer-events-none absolute inset-0 -z-10" />

            {/* Closes soon: thin bar along the top, and a way to keep it open */}
            {closingIn !== null && (
              <>
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
                  <div className="atlas-countdown h-full bg-primary" />
                </div>
                <div role="status" className="absolute left-1/2 top-16 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/60 bg-background/80 py-1 pl-3.5 pr-1 text-xs shadow-lg backdrop-blur-md">
                  <span className="text-muted-foreground">Closing in <span className="tabular-nums font-medium text-foreground">{closingIn}s</span></span>
                  <button type="button" onClick={keepOpen} className="rounded-full bg-foreground px-3 py-1 font-medium text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Keep open
                  </button>
                </div>
              </>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
              {view === 'chat' ? (
                <AtlasOrb size={36} state={orbState} />
              ) : (
                <HeaderButton label="Back to chat" onClick={() => setView('chat')}><ArrowLeft className="h-4 w-4" /></HeaderButton>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold tracking-tight">
                  {view === 'chats' ? 'Chats' : view === 'memory' ? 'Memory' : 'Atlas'}
                </p>
                <p className="truncate text-xs text-muted-foreground" aria-live="polite">
                  {view === 'chats'
                    ? isAdmin ? 'In your account' : 'On this device'
                    : view === 'memory'
                      ? 'About you'
                      : isLoading ? <span className="atlas-shimmer">Thinking…</span> : isSpeaking ? 'Speaking' : 'AI guide'}
                </p>
              </div>
              <div className="flex items-center">
                <HeaderButton label="New chat" onClick={newChat}><Plus className="h-4 w-4" /></HeaderButton>
                <HeaderButton
                  label="Chats"
                  active={view === 'chats'}
                  onClick={() => { setView(v => (v === 'chats' ? 'chat' : 'chats')); if (isAdmin) void history.refreshThreads(); else setChats(store.loadChats()); }}
                >
                  <MessagesSquare className="h-4 w-4" />
                </HeaderButton>
                <HeaderButton label="Memory" active={view === 'memory'} onClick={() => setView(v => (v === 'memory' ? 'chat' : 'memory'))}>
                  <Brain className="h-4 w-4" />
                </HeaderButton>
                <HeaderButton label={voiceEnabled ? 'Turn off spoken answers' : 'Read answers aloud'} active={voiceEnabled} onClick={() => { setVoiceEnabled(v => !v); stopSpeaking(); }}>
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </HeaderButton>
                <HeaderButton label="Close Atlas" onClick={close}><X className="h-4 w-4" /></HeaderButton>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Chats */}
            {view === 'chats' && (
              <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
                {(isAdmin ? history.threads.length === 0 : chats.length === 0) && (
                  <p className="px-4 py-10 text-sm text-muted-foreground">
                    {isAdmin && history.loadingThreads ? 'Loading your chats…' : 'No chats yet. Ask Atlas something and the conversation will appear here.'}
                  </p>
                )}
                <ul>
                  {(isAdmin
                    ? history.threads.map(t => ({ id: t.id, title: t.title, at: new Date(t.updated_at).getTime() }))
                    : chats.map(c => ({ id: c.id, title: c.title, at: c.updatedAt }))
                  ).map(c => {
                    const current = isAdmin ? c.id === activeThreadId : c.id === chatId;
                    return (
                      <li key={c.id} className="group flex items-center rounded-xl hover:bg-foreground/[0.05]">
                        <button
                          type="button"
                          onClick={() => (isAdmin ? void openThread(c.id) : openLocalChat(c.id))}
                          aria-current={current ? 'true' : undefined}
                          className="min-w-0 flex-1 px-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                        >
                          <span className={`block truncate text-sm ${current ? 'font-semibold text-primary' : 'text-foreground'}`}>{c.title}</span>
                          <span className="block text-xs text-muted-foreground">{store.when(c.at)}</span>
                        </button>
                        <IconTooltip label="Delete chat" side="left">
                          <button
                            type="button"
                            aria-label={`Delete chat: ${c.title}`}
                            onClick={() => {
                              if (isAdmin) { void history.deleteThread(c.id); if (current) void openThread(null); }
                              else { store.deleteChat(c.id); setChats(store.loadChats()); if (current) openLocalChat(null); }
                            }}
                            className="mr-1 grid h-10 w-10 place-items-center rounded-lg text-muted-foreground opacity-100 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </IconTooltip>
                      </li>
                    );
                  })}
                </ul>
                {!isAdmin && chats.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { if (confirm('Delete all chats on this device?')) { store.deleteAllChats(); setChats([]); openLocalChat(null); } }}
                    className="mx-3 mt-4 mb-2 text-sm text-muted-foreground underline underline-offset-2 hover:text-destructive"
                  >
                    Delete all chats
                  </button>
                )}
              </div>
            )}

            {/* Memory */}
            {view === 'memory' && (
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  When you mention who you are or what you're looking for, Atlas can remember it so later answers fit you better.
                  It's kept only in this browser. Remove anything, anytime.
                </p>
                <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3">
                  <span>
                    <span className="block text-sm font-medium">Let Atlas remember</span>
                    <span className="block text-xs text-muted-foreground">{memoryOn ? 'On. New details you share can be saved.' : 'Off. Nothing new is saved or used.'}</span>
                  </span>
                  <input type="checkbox" checked={memoryOn} onChange={toggleMemory} className="peer sr-only" />
                  <span aria-hidden="true" className={`relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${memoryOn ? 'bg-primary' : 'bg-input'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${memoryOn ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                  </span>
                </label>
                <ul className="mt-5">
                  {memory.length === 0 && <li className="py-6 text-sm text-muted-foreground">Nothing remembered yet.</li>}
                  {memory.map(m => (
                    <li key={m.id} className="flex items-center gap-3 border-t border-border py-3">
                      <span className="min-w-0 flex-1 text-sm">{m.text}</span>
                      <IconTooltip label="Forget this" side="left">
                        <button type="button" aria-label={`Forget: ${m.text}`} onClick={() => forgetFact(m.text)} className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </IconTooltip>
                    </li>
                  ))}
                </ul>
                {memory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { store.forgetAll(); setMemory([]); setMessages(prev => prev.map(m => ({ ...m, remembered: undefined }))); }}
                    className="mt-3 inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium hover:border-destructive/50 hover:text-destructive"
                  >
                    Forget everything
                  </button>
                )}
              </div>
            )}

            {/* Chat */}
            {view === 'chat' && (
              <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5" aria-live="polite" aria-busy={isLoading}>
                {historyLoading && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}

                {showSuggestions && (
                  <div className="flex min-h-full flex-col justify-end">
                    <h2 className="text-[1.75rem] font-bold leading-[1.1] tracking-tight">
                      Ask me anything about Qomardeen.
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      His work, how he designs and builds, and this site from its first version to now.
                      {memory.length > 0 && memoryOn && ' I remember what you told me last time.'}
                    </p>
                    <ul className="mt-6">
                      {!isAdmin && !introduced && (
                        <li className="border-t border-border">
                          <button
                            type="button"
                            onClick={startIntro}
                            className="flex w-full items-center gap-2.5 rounded-xl px-1 py-3.5 text-left text-[15px] font-medium text-primary transition-colors hover:bg-foreground/[0.04] hover:px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Hand className="h-4 w-4" aria-hidden="true" /> Introduce yourself to Qomardeen
                          </button>
                        </li>
                      )}
                      {prompts.map(p => (
                        <li key={p} className="border-t border-border last:border-b">
                          <button
                            type="button"
                            onClick={() => send(p)}
                            className="w-full rounded-xl px-1 py-3.5 text-left text-[15px] text-foreground/90 transition-colors hover:bg-foreground/[0.04] hover:px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {p}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <MessageRow
                      key={i}
                      msg={msg}
                      streaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
                      onOpen={openPage}
                      onForget={forgetFact}
                    />
                  ))}

                  {introOpen && (
                    <AtlasIntroCard
                      busy={introBusy}
                      error={introError}
                      onSend={d => void sendIntro(d)}
                      onSkip={() => { setIntroOpen(false); store.dismissGreeting(); }}
                    />
                  )}

                  {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <p className="atlas-shimmer text-[15px]">Thinking…</p>
                  )}

                  {isAdmin && pendingBlogDraft && !blogPublishing && (
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Blog draft ready</p>
                      <p className="mt-2 text-sm font-medium">{pendingBlogDraft.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{pendingBlogDraft.excerpt}</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => void handlePublishBlog()} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-medium text-primary-foreground">
                          <Check className="h-4 w-4" /> Publish
                        </button>
                        <button
                          onClick={() => { setPendingBlogDraft(null); setMessages(prev => [...prev, { role: 'assistant', content: 'Draft discarded. Tell me what to change and I\'ll try again.' }]); }}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-medium"
                        >
                          <XCircle className="h-4 w-4" /> Discard
                        </button>
                      </div>
                    </div>
                  )}
                  {blogPublishing && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Publishing…</p>
                  )}
                </div>
              </div>
            )}

            {/* Composer */}
            {view === 'chat' && (
              <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
                <div className="atlas-composer flex items-end gap-1.5 rounded-[22px] p-1.5 transition-shadow focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.18)]">
                  {speechSupported && (
                    <IconTooltip label={isListening ? 'Stop listening' : 'Speak your question'} side="top">
                      <button
                        type="button"
                        onClick={toggleListening}
                        aria-label={isListening ? 'Stop listening' : 'Speak your question'}
                        aria-pressed={isListening}
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${isListening ? 'bg-destructive/15 text-destructive' : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground'}`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                    </IconTooltip>
                  )}
                  <label htmlFor="atlas-input" className="sr-only">Message Atlas</label>
                  <textarea
                    id="atlas-input"
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(input); } }}
                    placeholder={isListening ? 'Listening…' : 'Ask Atlas anything'}
                    rows={1}
                    className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-snug outline-none placeholder:text-muted-foreground/70"
                  />
                  {isLoading ? (
                    <IconTooltip label="Stop" side="top">
                      <button type="button" onClick={stopRequest} aria-label="Stop the answer" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-background">
                        <Square className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </IconTooltip>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void send(input)}
                      disabled={!input.trim()}
                      aria-label="Send"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-25"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2 px-2 text-center text-[11px] leading-snug text-muted-foreground">
                  {isAdmin ? 'Your chats are saved to your account.' : 'Chats stay on this device.'} Atlas can get things wrong, so check key facts with Qomardeen.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantWidget;
