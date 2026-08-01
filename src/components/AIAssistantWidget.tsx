import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Volume2, VolumeX, Mic, MicOff, Loader2, ArrowUp, FileText, Check, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Message = { role: 'user' | 'assistant'; content: string };
type BlogDraft = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

const VISITOR_PROMPTS = [
  "Show me projects",
  "Fintech experience",
  "How to hire",
  "Tell me about Qomardeen",
];

const ADMIN_PROMPTS = [
  "Show me projects",
  "Fintech experience",
  "How to hire",
  "Write a blog post",
];

function parseBlogPost(content: string): { displayContent: string; blogDraft: BlogDraft | null } {
  const blogMatch = content.match(/\[\[BLOG_POST\]\]([\s\S]*?)\[\[\/BLOG_POST\]\]/);
  if (!blogMatch) return { displayContent: content, blogDraft: null };
  
  try {
    const blogData = JSON.parse(blogMatch[1].trim());
    const displayContent = content.replace(/\[\[BLOG_POST\]\][\s\S]*?\[\[\/BLOG_POST\]\]/g, '').trim();
    return { displayContent, blogDraft: blogData };
  } catch {
    return { displayContent: content, blogDraft: null };
  }
}

function hasPublishCommand(content: string): boolean {
  return content.includes('[[PUBLISH_BLOG]]');
}

function parseNavigation(content: string): { displayContent: string; navPath: string | null } {
  const navMatch = content.match(/\[\[NAVIGATE:(\/[^\]]*)\]\]/);
  const navPath = navMatch ? navMatch[1] : null;
  const displayContent = content.replace(/\[\[NAVIGATE:\/[^\]]*\]\]/g, '').trim();
  return { displayContent, navPath };
}

async function streamChat({
  messages,
  isAdmin: _isAdmin,
  onDelta,
  onDone,
}: {
  messages: Message[];
  isAdmin?: boolean;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  // Admin capabilities are decided server-side from the session token.
  const { data: { session } } = await supabase.auth.getSession();
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Failed to connect");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }
  onDone();
}

const AtlasLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-1 py-1">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingBlogDraft, setPendingBlogDraft] = useState<BlogDraft | null>(null);
  const [blogPublishing, setBlogPublishing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();
  const suggestedPrompts = isAdmin ? ADMIN_PROMPTS : VISITOR_PROMPTS;

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        stopSpeaking();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, stopSpeaking]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant' && !isLoading) {
      const { navPath } = parseNavigation(lastMsg.content);
      if (navPath) {
        const timer = setTimeout(() => navigate(navPath), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [messages, isLoading, navigate]);

  const playTTS = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    try {
      setIsSpeaking(true);
      const { displayContent } = parseNavigation(text);
      const cleanText = displayContent.replace(/[#*_`~\[\]()>]/g, '').slice(0, 1000);
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: cleanText }),
      });
      if (!response.ok) throw new Error("TTS failed");
      const data = await response.json();
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (e) {
      console.error("TTS error:", e);
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    stopSpeaking();

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        isAdmin,
        onDelta: upsertAssistant,
        onDone: () => {
          setIsLoading(false);
          // Check for blog post draft in the response
          const { blogDraft } = parseBlogPost(assistantSoFar);
          if (blogDraft) {
            setPendingBlogDraft(blogDraft);
          }
          // Check for publish command
          if (hasPublishCommand(assistantSoFar)) {
            handlePublishBlog();
          }
          if (voiceEnabled && assistantSoFar) playTTS(assistantSoFar);
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
    }
  };

  const handlePublishBlog = async () => {
    if (!pendingBlogDraft) return;
    setBlogPublishing(true);
    try {
      const slug = pendingBlogDraft.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 80);

      const { data, error } = await supabase
        .from('ai_blog_posts')
        .insert({
          slug,
          title: pendingBlogDraft.title,
          excerpt: pendingBlogDraft.excerpt,
          content: pendingBlogDraft.content,
          category: pendingBlogDraft.category,
          tags: pendingBlogDraft.tags,
          read_time: pendingBlogDraft.readTime,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // Now publish it
      const { error: pubError } = await supabase
        .from('ai_blog_posts')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', data.id);

      if (pubError) throw pubError;

      setPendingBlogDraft(null);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ **"${pendingBlogDraft.title}"** has been published to your blog! You can find it on the blog page.`
      }]);
    } catch (e) {
      console.error('Publish error:', e);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed to publish the blog post. Error: ${e instanceof Error ? e.message : 'Unknown error'}. Please try again.`
      }]);
    } finally {
      setBlogPublishing(false);
    }
  };

  const handleConfirmBlog = () => {
    // User confirmed — tell AI to publish, which triggers the publish flow
    handlePublishBlog();
  };

  const handleRejectBlog = () => {
    setPendingBlogDraft(null);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "No problem! The draft has been discarded. Let me know if you'd like me to try a different approach."
    }]);
  };

  const renderContent = (content: string) => {
    const { displayContent } = parseNavigation(content);
    // Remove blog post JSON blocks from display
    const cleaned = displayContent
      .replace(/\[\[BLOG_POST\]\][\s\S]*?\[\[\/BLOG_POST\]\]/g, '')
      .replace(/\[\[PUBLISH_BLOG\]\]/g, '')
      .trim();
    return cleaned;
  };

  return (
    <>
      {/* Floating Trigger — minimal orb */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              boxShadow: [
                '0 0 0 0 hsl(var(--primary) / 0)',
                '0 0 20px 4px hsl(var(--primary) / 0.25)',
                '0 0 0 0 hsl(var(--primary) / 0)',
              ],
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 28px 6px hsl(var(--primary) / 0.35)' }}
            whileTap={{ scale: 0.95 }}
            transition={{
              boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              scale: { type: 'spring', stiffness: 300, damping: 20 },
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-1 rounded-[44px] bg-foreground text-background flex items-center gap-2 w-fit cursor-pointer"
            aria-label="Open Atlas AI"
          >
            <motion.div
              className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center flex-shrink-0"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <AtlasLogo size={18} />
            </motion.div>
            <span className="text-base font-medium tracking-tight pr-3">Ask Atlas</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px]"
            onClick={() => { setIsOpen(false); stopSpeaking(); }}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel — modern glass design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-border/50"
            style={{
              background: 'hsl(var(--background) / 0.95)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header — clean, minimal */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-foreground/10 flex items-center justify-center text-foreground">
                  <AtlasLogo size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground tracking-tight">Atlas</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => { setVoiceEnabled(!voiceEnabled); stopSpeaking(); }}
                  className="p-2 rounded-xl hover:bg-foreground/5 transition-colors"
                  title={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {voiceEnabled
                    ? <Volume2 className="w-4 h-4 text-primary" />
                    : <VolumeX className="w-4 h-4 text-muted-foreground/60" />
                  }
                </button>
                <button
                  onClick={() => { setIsOpen(false); stopSpeaking(); }}
                  className="p-2 rounded-xl hover:bg-foreground/5 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground/60" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-border/50" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground/70">
                      <AtlasLogo size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-semibold text-foreground tracking-tight">Atlas</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                        AI portfolio guide — ask anything about Qomardeen's work
                      </p>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <motion.button
                        key={i}
                        onClick={() => send(prompt)}
                        className="w-full text-left px-4 py-3 text-[13px] rounded-2xl border border-border/50 hover:border-border hover:bg-foreground/[0.03] transition-all text-foreground/80"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-foreground/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-foreground/60">
                      <AtlasLogo size={14} />
                    </div>
                  )}
                  <div className={`max-w-[80%] text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-foreground text-background px-4 py-2.5 rounded-2xl rounded-br-lg'
                      : 'text-foreground/90'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none [&>p]:m-0 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-1 [&>ol]:my-1 [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline [&_strong]:text-foreground [&_code]:text-xs [&_code]:bg-foreground/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md text-foreground/90">
                        <ReactMarkdown>{renderContent(msg.content)}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}

              {/* Blog draft confirmation card */}
              {isAdmin && pendingBlogDraft && !blogPublishing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-1 p-3 rounded-2xl border border-primary/30 bg-primary/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Blog Draft Ready</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground mb-1 font-medium">{pendingBlogDraft.title}</p>
                  <p className="text-[11px] text-muted-foreground/70 mb-3">{pendingBlogDraft.excerpt}</p>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleConfirmBlog}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Publish
                    </motion.button>
                    <motion.button
                      onClick={handleRejectBlog}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-foreground/70 text-xs font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Discard
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {blogPublishing && (
                <div className="flex items-center gap-2 mx-1 p-3 rounded-2xl border border-primary/30 bg-primary/5">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-xs text-foreground/70">Publishing blog post...</span>
                </div>
              )}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-lg bg-foreground/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-foreground/60">
                    <AtlasLogo size={14} />
                  </div>
                  <TypingIndicator />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input — modern textarea style */}
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-end gap-2 rounded-2xl border border-border/50 bg-foreground/[0.03] px-3 py-2 focus-within:border-border focus-within:bg-foreground/[0.05] transition-all">
                <button
                  onClick={toggleListening}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 mb-0.5 ${
                    isListening
                      ? 'bg-destructive/15 text-destructive'
                      : 'hover:bg-foreground/5 text-muted-foreground/50'
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={isListening ? "Listening..." : "Ask Atlas..."}
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/40 outline-none resize-none min-h-[20px] max-h-[120px] py-1 leading-relaxed"
                  rows={1}
                  disabled={isLoading}
                />
                <motion.button
                  onClick={() => send(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 rounded-lg bg-foreground text-background disabled:opacity-20 transition-all flex-shrink-0 mb-0.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-[10px] text-muted-foreground/30 text-center mt-2">Atlas by Qomardeen · AI Portfolio Guide</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantWidget;
