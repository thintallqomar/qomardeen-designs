/**
 * Atlas memory for visitors, kept only in their own browser (nothing is sent to the site's database):
 * - chats: past conversations, like ChatGPT's sidebar
 * - memory: short facts the visitor shared about themselves, which Atlas uses to tailor answers
 * Every read/write is guarded: private windows or blocked storage just mean nothing is saved.
 */
export type AtlasRole = 'user' | 'assistant';
export type AtlasChatMessage = { role: AtlasRole; content: string; remembered?: string[] };
export type AtlasChat = { id: string; title: string; updatedAt: number; messages: AtlasChatMessage[] };
export type AtlasMemoryItem = { id: string; text: string; at: number };

const CHATS = 'atlas:v2:chats';
const ACTIVE = 'atlas:v2:active';
const MEMORY = 'atlas:v2:memory';
const MEMORY_ON = 'atlas:v2:memory-on';
const MAX_CHATS = 30;
const MAX_MESSAGES = 60;
const MAX_MEMORY = 20;

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
};

export const newId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const loadChats = (): AtlasChat[] =>
  read<AtlasChat[]>(CHATS, []).filter(c => c && Array.isArray(c.messages)).sort((a, b) => b.updatedAt - a.updatedAt);

export const saveChat = (chat: AtlasChat) => {
  const others = loadChats().filter(c => c.id !== chat.id);
  const trimmed = { ...chat, messages: chat.messages.slice(-MAX_MESSAGES) };
  write(CHATS, [trimmed, ...others].slice(0, MAX_CHATS));
};
export const deleteChat = (id: string) => write(CHATS, loadChats().filter(c => c.id !== id));
export const deleteAllChats = () => { write(CHATS, []); try { localStorage.removeItem(ACTIVE); } catch { /* */ } };

export const activeChatId = () => read<string | null>(ACTIVE, null);
export const setActiveChatId = (id: string | null) => {
  try { if (id) localStorage.setItem(ACTIVE, JSON.stringify(id)); else localStorage.removeItem(ACTIVE); } catch { /* */ }
};

export const chatTitle = (firstMessage: string) => {
  const clean = firstMessage.replace(/\s+/g, ' ').trim();
  return clean.length > 48 ? `${clean.slice(0, 47)}…` : clean || 'New chat';
};

export const loadMemory = (): AtlasMemoryItem[] => read<AtlasMemoryItem[]>(MEMORY, []);
export const memoryEnabled = () => read<boolean>(MEMORY_ON, true);
export const setMemoryEnabled = (on: boolean) => write(MEMORY_ON, on);

/** Adds facts (skipping near-duplicates). Returns the ones actually added. */
export const remember = (facts: string[]): string[] => {
  const current = loadMemory();
  const seen = new Set(current.map(m => m.text.toLowerCase()));
  const added: string[] = [];
  for (const raw of facts) {
    const text = raw.replace(/\s+/g, ' ').trim().slice(0, 160);
    if (!text || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    current.unshift({ id: newId(), text, at: Date.now() });
    added.push(text);
  }
  write(MEMORY, current.slice(0, MAX_MEMORY));
  return added;
};
export const forget = (text: string) => write(MEMORY, loadMemory().filter(m => m.text !== text));
export const forgetAll = () => write(MEMORY, []);

/** Relative time for the chat list: "Just now", "2h ago", "Yesterday", "12 Nov". */
export const when = (at: number) => {
  const mins = Math.round((Date.now() - at) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  if (hrs < 48) return 'Yesterday';
  return new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
};

/* ── Introductions and the greeting ────────────────────────────────── */
const INTRODUCED = 'atlas:v2:introduced';
const GREET_DISMISSED = 'atlas:v2:greet-dismissed';
const GREETED_THIS_VISIT = 'atlas:v2:greeted';
const WEEK = 7 * 24 * 60 * 60 * 1000;

export const hasIntroduced = () => read<boolean>(INTRODUCED, false);
export const markIntroduced = () => write(INTRODUCED, true);
export const dismissGreeting = () => write(GREET_DISMISSED, Date.now());

/** Greet once per visit, never after an introduction, and not again for a week after "Just browsing". */
export const shouldGreet = () => {
  if (hasIntroduced()) return false;
  if (Date.now() - read<number>(GREET_DISMISSED, 0) < WEEK) return false;
  try { if (sessionStorage.getItem(GREETED_THIS_VISIT)) return false; } catch { /* */ }
  return true;
};
export const markGreeted = () => { try { sessionStorage.setItem(GREETED_THIS_VISIT, '1'); } catch { /* */ } };
