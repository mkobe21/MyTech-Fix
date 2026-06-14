'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASING } from '@/lib/animations';

// ── Data ──────────────────────────────────────────────────────────────────────

type ConversationDef = {
  userMessage: string;
  aiIntro: string;
  steps: string[];
  hasDiagChip?: boolean;
};

const CONVERSATIONS: ConversationDef[] = [
  {
    hasDiagChip: true,
    userMessage: 'My WiFi has been crawling all morning.',
    aiIntro:
      "I can see your latency is 340 ms and download is 12 Mbps — way below your 200 Mbps plan. You're on the 2.4 GHz band which is the problem. Here's the fix:",
    steps: [
      'Open your router admin at 192.168.1.1',
      'Switch your devices to the 5 GHz band',
      'Change WiFi channel from Auto to 6 or 11 — clears congestion',
    ],
  },
  {
    userMessage: 'My printer says offline but it\'s on.',
    aiIntro: 'Classic Windows print spooler issue — happens after sleep mode. Quick fix:',
    steps: [
      'Press Win + R, type services.msc and hit Enter',
      "Find 'Print Spooler' → right-click → Restart",
      'Right-click printer in Settings → Set as Default',
    ],
  },
  {
    userMessage: 'My Nest thermostat stopped showing up in Google Home.',
    aiIntro:
      'This is usually a broken account link after a Google update. Two-minute fix:',
    steps: [
      'Open Google Home → tap + → Set up device → Works with Google',
      'Search Nest → re-link your account',
      "Remove and re-add the thermostat if it doesn't appear",
    ],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatMsg = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  steps: string[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400 block"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.0, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

const msgVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: EASING } },
};

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatDemo() {
  const [convIdx, setConvIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [showDiagChip, setShowDiagChip] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping, scrollToBottom]);

  useEffect(() => {
    const conv = CONVERSATIONS[convIdx];
    let active = true;

    async function run() {
      // Clear
      setMessages([]);
      setTypedText('');
      setShowTyping(false);
      setShowDiagChip(false);

      await sleep(400);
      if (!active) return;

      // Type user message character by character
      for (let i = 1; i <= conv.userMessage.length; i++) {
        if (!active) return;
        setTypedText(conv.userMessage.slice(0, i));
        await sleep(42);
      }

      await sleep(120);
      if (!active) return;

      // Show user bubble, clear input
      setMessages([{ id: 'u', role: 'user', text: conv.userMessage, steps: [] }]);
      setTypedText('');

      await sleep(600);
      if (!active) return;

      // Show typing indicator
      setShowTyping(true);

      // For conv 0 — show diagnostics chip during thinking
      if (conv.hasDiagChip) {
        await sleep(500);
        if (!active) return;
        setShowDiagChip(true);
      }

      await sleep(conv.hasDiagChip ? 1200 : 1700);
      if (!active) return;

      // Remove typing indicator, show AI intro
      setShowTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: 'ai', role: 'ai', text: conv.aiIntro, steps: [] },
      ]);

      // Add steps one by one
      for (const step of conv.steps) {
        await sleep(700);
        if (!active) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === 'ai' ? { ...m, steps: [...m.steps, step] } : m
          )
        );
      }

      // Pause, then cycle
      await sleep(4200);
      if (!active) return;
      setConvIdx((i) => (i + 1) % CONVERSATIONS.length);
    }

    run();
    return () => {
      active = false;
    };
  }, [convIdx]);

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-gray-900 overflow-hidden shadow-2xl shadow-black/60 flex flex-col select-none">
      {/* Chrome / header */}
      <div className="bg-slate-800/60 px-4 py-3 flex items-center gap-3 border-b border-white/[0.07] flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="font-semibold text-slate-200 text-sm">MyTech-Fix AI</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            Online
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[280px] max-h-[340px]">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) =>
            msg.role === 'user' ? (
              <motion.div
                key={msg.id}
                variants={msgVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-end"
              >
                <div className="max-w-[80%] bg-blue-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 leading-relaxed">
                  {msg.text}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={msg.id}
                variants={msgVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-start"
              >
                <div className="max-w-[90%]">
                  {/* Diag chip — only when active */}
                  <AnimatePresence>
                    {showDiagChip && (
                      <motion.div
                        key="chip"
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.35 }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/25 rounded-full px-3 py-1 mb-2"
                      >
                        <span>📊</span> Diagnostics auto-loaded
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="bg-slate-800 text-slate-200 text-sm rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed">
                    <p>{msg.text}</p>
                    {msg.steps.length > 0 && (
                      <ol className="mt-3 space-y-2">
                        <AnimatePresence>
                          {msg.steps.map((step, i) => (
                            <motion.li
                              key={step}
                              variants={msgVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-start gap-2.5"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-slate-300">{step}</span>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ol>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          )}

          {showTyping && (
            <motion.div
              key="typing"
              variants={msgVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 4 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/[0.07] px-4 py-3 flex items-center gap-3 bg-slate-900/60 flex-shrink-0">
        <div className="flex-1 bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 min-h-[38px] flex items-center">
          {typedText || (
            <span className="text-slate-500">Describe your tech problem…</span>
          )}
          {typedText && (
            <motion.span
              className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 rounded-sm"
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
        </div>
        <button className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 cursor-default">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
