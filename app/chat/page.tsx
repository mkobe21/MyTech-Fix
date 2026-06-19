'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Upload, X, Users, Mic, Copy, Check, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import BusinessPromptPacks from '@/components/BusinessPromptPacks';
import { motion, AnimatePresence } from 'framer-motion';
import { messageIn } from '@/lib/animations';
import { toast } from 'sonner';
import { getLimit, getTierLabel, pickHighestTier } from '@/lib/tiers';
import { formatDiagnosticReportForChat } from '@/lib/diagnostics';
import { getProductivityTool } from '@/lib/productivity-prompts';
import ProductivityModeBadge from '@/components/ProductivityModeBadge';
import ProductivityExamples from '@/components/ProductivityExamples';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

const WELCOME_MESSAGE = "Hi! I'm MyTech-Fix. I can help with tech troubleshooting, device setup, productivity tasks, and general guidance on cybersecurity events. Describe your issue, paste a screenshot (Ctrl+V), tap the mic to speak, or use Quick Fixes. I can also generate helpful diagrams and visual aids.";

function ChatContent() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get('session');
  const diagnosticParam = searchParams.get('diagnostic');
  const deviceNameParam = searchParams.get('device_name');
  const deviceTypeParam = searchParams.get('device_type');
  const deviceLocationParam = searchParams.get('device_location');
  const toolParam = searchParams.get('tool');
  const productivityTool = getProductivityTool(toolParam);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  interface TeamRef { id: string; name?: string; role?: string; [k: string]: any }
  interface DeviceRef { id: string; name?: string; device_type?: string | null; assigned_to?: string | null; [k: string]: any }
  interface MemberRef { id: string; full_name?: string | null; email?: string; name?: string; [k: string]: any }

  const [userTeams, setUserTeams] = useState<TeamRef[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [userDevices, setUserDevices] = useState<DeviceRef[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<MemberRef[]>([]);
  const [userTier, setUserTier] = useState<string>('free_trial');

  // Injected device context (from inventory "Troubleshoot" button via ?device_name=...)
  const [injectedDeviceContext, setInjectedDeviceContext] = useState<{ name: string; type?: string; location?: string } | null>(null);

  // Injected diagnostic report context (from ?diagnostic=ID)
  const [injectedDiagnosticContext, setInjectedDiagnosticContext] = useState<any>(null);

  // Voice-to-text
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatChannelRef = useRef<any>(null);

  const router = useRouter();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  // ── New chat ────────────────────────────────────────────────────────────
  const startNewChat = () => {
    setMessages([{ id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() }]);
    setSessionId(null);
    setIsResolved(false);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setInjectedDiagnosticContext(null);
    setInjectedDeviceContext(null);
    router.push('/chat');
  };

  // ── Mark resolved ───────────────────────────────────────────────────────
  const handleToggleResolved = async () => {
    if (!sessionId) return;
    const next = !isResolved;
    setIsResolved(next);
    const { error } = await supabaseBrowser
      .from('chat_sessions')
      .update({ resolved: next })
      .eq('id', sessionId);
    if (error) {
      setIsResolved(!next);
      toast.error('Failed to update status');
      console.error('Resolved update error:', error);
    } else {
      toast.success(next ? 'Issue marked as resolved' : 'Marked as unresolved');
    }
  };

  // ── Copy message ────────────────────────────────────────────────────────
  const handleCopyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  // ── Drag-and-drop ───────────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return; }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Capabilities button ─────────────────────────────────────────────────
  const handleShowCapabilities = () => {
    sendMessage({ directMessage: "What can you help me fix?" });
  };

  // ── Voice-to-Text ───────────────────────────────────────────────────────
  const toggleVoiceInput = () => {
    if (!isSpeechSupported) { toast.error("Voice input is not supported in this browser. Try Chrome or Edge."); return; }
    isListening ? stopListening() : startListening();
  };

  const startListening = () => {
    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) { toast.error("Voice input not available."); return; }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const t = event.results[i][0].transcript;
          event.results[i].isFinal ? (final += t) : (interim += t);
        }
        const text = final || interim;
        if (text) setInput(text.trim());
      };

      recognition.onerror = (event: any) => {
        const err = event?.error || 'unknown';
        if (err === 'aborted') { setIsListening(false); return; }
        if (err === 'not-allowed' || err === 'permission-denied') toast.error("Microphone access denied.");
        else if (err === 'audio-capture') toast.error("Could not access your microphone.");
        else if (err !== 'no-speech') toast.error("Voice input ran into a problem.");
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        toast.error("Could not start voice input.");
        setIsListening(false);
        recognitionRef.current = null;
      }
    } catch {
      toast.error("Could not start voice input.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    };
  }, []);

  useEffect(() => {
    setIsSpeechSupported(typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window));
  }, []);

  // ── Load previous chat session ──────────────────────────────────────────
  useEffect(() => {
    const loadChatSession = async () => {
      if (!sessionParam) { setSessionId(null); setIsResolved(false); return; }
      try {
        const [{ data: msgs }, { data: session }] = await Promise.all([
          supabaseBrowser.from('chat_messages').select('*').eq('session_id', sessionParam).order('created_at', { ascending: true }),
          supabaseBrowser.from('chat_sessions').select('resolved').eq('id', sessionParam).maybeSingle(),
        ]);

        if (msgs && msgs.length > 0) {
          setMessages(msgs.map((m: any) => ({
            id: m.id, role: m.role as 'user' | 'assistant',
            content: m.content, imageUrl: m.image_url, timestamp: new Date(m.created_at)
          })));
        }
        setSessionId(sessionParam);
        setIsResolved(session?.resolved ?? false);
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    };
    loadChatSession();
  }, [sessionParam]);

  // ── Load business team context ──────────────────────────────────────────
  useEffect(() => {
    const loadBusinessContext = async () => {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) return;

        let tier = 'free_trial';
        try {
          const { data: prof } = await supabaseBrowser.from('profiles').select('tier').eq('id', user.id).maybeSingle();
          const { data: ut } = await supabaseBrowser.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle();
          tier = pickHighestTier(prof?.tier, ut?.tier);
        } catch {}
        setUserTier(tier);

        // Redirect free trial users who try to access a productivity tool
        if (tier === 'free_trial' && toolParam) {
          router.push('/productivity');
          return;
        }

        if (tier === 'business' || tier === 'business_plus') {
          const { data: memberships } = await supabaseBrowser
            .from('team_members')
            .select('team_id, role, teams:team_id (id, name)')
            .eq('user_id', user.id);

          if (memberships && memberships.length > 0) {
            const teams = memberships.map((m: any) => ({ id: m.team_id, name: m.teams?.name || 'Unnamed Team', role: m.role }));
            setUserTeams(teams);
            if (!selectedTeamId && teams.length > 0) setSelectedTeamId(teams[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load business context:', err);
      }
    };
    loadBusinessContext();
  }, []);

  // ── Load devices for selected team ─────────────────────────────────────
  useEffect(() => {
    if (!selectedTeamId) { setUserDevices([]); setSelectedDeviceId(null); return; }
    supabaseBrowser.from('devices').select('id, name, device_type, location, assigned_to')
      .eq('team_id', selectedTeamId).order('name', { ascending: true })
      .then(({ data }) => { if (data) setUserDevices(data); });
  }, [selectedTeamId]);

  // ── Load team members ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedTeamId) { setTeamMembers([]); return; }
    supabaseBrowser.from('team_members')
      .select('user_id, profiles!inner (id, full_name, email)')
      .eq('team_id', selectedTeamId)
      .then(({ data }) => {
        if (data) setTeamMembers(data.map((m: any) => ({
          id: m.user_id,
          name: m.profiles?.full_name || m.profiles?.email?.split('@')[0] || 'Team Member',
          email: m.profiles?.email,
        })));
      });
  }, [selectedTeamId]);

  // ── Inject diagnostic report from ?diagnostic=ID ────────────────────────
  useEffect(() => {
    const injectDiagnostic = async () => {
      if (!diagnosticParam) return;
      if (injectedDiagnosticContext?.id === diagnosticParam) return;

      try {
        const { data: diag } = await supabaseBrowser
          .from('user_diagnostics').select('*').eq('id', diagnosticParam).maybeSingle();

        if (!diag) {
          router.replace(window.location.pathname + (sessionParam ? `?session=${sessionParam}` : ''));
          return;
        }

        const formatted = formatDiagnosticReportForChat(diag.results, diag.ai_analysis, diag.run_type);
        const contextMessage: Message = {
          id: `diag-${diag.id}`,
          role: 'assistant',
          content: `📊 ${formatted}\n\n(Report injected from your diagnostics. Ask away — the AI has the full structured data.)`,
          timestamp: new Date(diag.created_at || Date.now()),
        };

        setMessages(prev => {
          if (prev.some(m => m.id === contextMessage.id)) return prev;
          const welcome = prev.find(m => m.id === 'welcome');
          const rest = prev.filter(m => m.id !== 'welcome');
          return welcome ? [welcome, contextMessage, ...rest] : [contextMessage, ...rest];
        });

        setInjectedDiagnosticContext({ id: diag.id, results: diag.results, analysis: diag.ai_analysis, run_type: diag.run_type });
        router.replace(window.location.pathname + (sessionParam ? `?session=${sessionParam}` : ''));
      } catch (err) {
        console.error('Failed to inject diagnostic:', err);
      }
    };
    injectDiagnostic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosticParam, sessionParam]);

  // ── Inject device context from inventory "Troubleshoot" button ──────────
  useEffect(() => {
    if (!deviceNameParam) return;
    if (injectedDeviceContext?.name === deviceNameParam) return;

    const ctx = {
      name: deviceNameParam,
      ...(deviceTypeParam ? { type: deviceTypeParam } : {}),
      ...(deviceLocationParam ? { location: deviceLocationParam } : {}),
    };

    const lines = [`🖥️ Device: **${ctx.name}**`];
    if (ctx.type) lines.push(`Type: ${ctx.type}`);
    if (ctx.location) lines.push(`Location: ${ctx.location}`);

    const contextMessage: Message = {
      id: `device-${deviceNameParam}`,
      role: 'assistant',
      content: `${lines.join('\n')}\n\nI have context about this device from your inventory. What issue are you experiencing with it?`,
      timestamp: new Date(),
    };

    setMessages(prev => {
      if (prev.some(m => m.id === contextMessage.id)) return prev;
      const welcome = prev.find(m => m.id === 'welcome');
      const rest = prev.filter(m => m.id !== 'welcome');
      return welcome ? [welcome, contextMessage, ...rest] : [contextMessage, ...rest];
    });

    setInjectedDeviceContext(ctx);
    router.replace(window.location.pathname + (sessionParam ? `?session=${sessionParam}` : ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceNameParam, deviceTypeParam, deviceLocationParam, sessionParam]);

  // ── Realtime updates for shared team sessions ───────────────────────────
  useEffect(() => {
    if (!sessionId) {
      if (chatChannelRef.current) { supabaseBrowser.removeChannel(chatChannelRef.current); chatChannelRef.current = null; }
      return;
    }

    const channel = supabaseBrowser
      .channel(`chat-session-${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as any;
          setMessages(prev => {
            if (prev.some(m => m.id === row.id)) return prev;
            return [...prev, { id: row.id, role: row.role as 'user' | 'assistant', content: row.content, imageUrl: row.image_url || undefined, timestamp: new Date(row.created_at) }];
          });
        })
      .subscribe();

    chatChannelRef.current = channel;
    return () => { if (chatChannelRef.current) { supabaseBrowser.removeChannel(chatChannelRef.current); chatChannelRef.current = null; } };
  }, [sessionId]);

  // ── Paste image ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return; }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            e.preventDefault();
            break;
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  // ── Image handling ──────────────────────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be under 10MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `chat-images/${Date.now()}.${fileExt}`;
      const { error } = await supabaseBrowser.storage.from('chat-uploads').upload(filePath, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabaseBrowser.storage.from('chat-uploads').getPublicUrl(filePath);
      return publicUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  // ── Send message ────────────────────────────────────────────────────────
  const sendMessage = async (options?: { forceVisualPrompt?: string; directMessage?: string }) => {
    // directMessage bypasses the input field entirely (used by quick fix chips, capabilities button, etc.)
    const effectiveInput = options?.directMessage !== undefined ? options.directMessage : input.trim();
    if ((!effectiveInput && !selectedImage && !options?.forceVisualPrompt) || isLoading) return;

    if (isListening) stopListening();

    // Client-side tier pre-check
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { toast.error("Please sign in to continue."); return; }

      let profTier: string | null = null, profUsed = 0, utTier: string | null = null, utUsed = 0;
      try {
        const { data: prof } = await supabaseBrowser.from('profiles').select('tier, sessions_used').eq('id', user.id).maybeSingle();
        if (prof) { profTier = prof.tier; profUsed = prof.sessions_used || 0; }
        const { data: ut } = await supabaseBrowser.from('user_tiers').select('tier, sessions_used').eq('user_id', user.id).maybeSingle();
        if (ut) { utTier = ut.tier; utUsed = ut.sessions_used || 0; }
      } catch {}

      const tier = pickHighestTier(profTier, utTier);
      const sessionsUsed = profUsed || utUsed;
      const limit = getLimit(tier);

      if (limit < 9999 && sessionsUsed >= limit) {
        const tierName = getTierLabel(tier);
        toast.error(
          tier === 'single_use'
            ? `You've reached the maximum of ${limit} chats for the Single Use plan. Upgrade to the Home Plan for more.`
            : `You've reached the maximum of ${limit} chats for the ${tierName} tier. Upgrade for unlimited chats.`,
          { duration: 8000 }
        );
        return;
      }
    } catch (err) {
      console.error("Tier enforcement error:", err);
    }

    let imageUrl: string | null = null;
    if (selectedImage) imageUrl = await uploadImage(selectedImage);

    const isForceVisual = !!options?.forceVisualPrompt;
    const currentInput = isForceVisual ? '' : effectiveInput;

    if (isForceVisual) setIsGeneratingVisual(true);

    const userOptimisticId = Date.now().toString();
    if (!isForceVisual) {
      setMessages(prev => [...prev, {
        id: userOptimisticId, role: 'user',
        content: currentInput || "[Pasted Screenshot]",
        imageUrl: imageUrl || undefined, timestamp: new Date()
      }]);
    }

    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      const { data: newSession } = await supabaseBrowser
        .from('chat_sessions')
        .insert({ user_id: user?.id, title: (currentInput || "Visual aid request").substring(0, 60) || "New Conversation", team_id: selectedTeamId, device_id: selectedDeviceId, productivity_tool: toolParam || null })
        .select('id').single();

      currentSessionId = newSession?.id || null;
      setSessionId(currentSessionId);

      // Persist injected diagnostic context bubble
      if (currentSessionId && injectedDiagnosticContext) {
        try {
          const reportText = formatDiagnosticReportForChat(injectedDiagnosticContext.results, injectedDiagnosticContext.analysis, injectedDiagnosticContext.run_type);
          await supabaseBrowser.from('chat_messages').insert({
            session_id: currentSessionId,
            user_id: (await supabaseBrowser.auth.getUser()).data.user?.id,
            role: 'assistant',
            content: `📊 ${reportText}\n\n(Report injected from diagnostics.)`,
          });
        } catch (e) {
          console.warn('Could not persist diagnostic context message (non-fatal):', e);
        }
      }

      // Persist injected device context bubble
      if (currentSessionId && injectedDeviceContext) {
        try {
          const lines = [`🖥️ Device: **${injectedDeviceContext.name}**`];
          if (injectedDeviceContext.type) lines.push(`Type: ${injectedDeviceContext.type}`);
          if (injectedDeviceContext.location) lines.push(`Location: ${injectedDeviceContext.location}`);
          await supabaseBrowser.from('chat_messages').insert({
            session_id: currentSessionId,
            user_id: (await supabaseBrowser.auth.getUser()).data.user?.id,
            role: 'assistant',
            content: `${lines.join('\n')}\n\nI have context about this device from your inventory. What issue are you experiencing with it?`,
          });
        } catch (e) {
          console.warn('Could not persist device context message (non-fatal):', e);
        }
      }
    }

    let insertedUserMessageId: string | null = null;
    if (currentSessionId && !isForceVisual) {
      const { data: insertedMsg } = await supabaseBrowser
        .from('chat_messages')
        .insert({ session_id: currentSessionId, user_id: (await supabaseBrowser.auth.getUser()).data.user?.id, role: 'user', content: currentInput || "[Pasted Screenshot]", image_url: imageUrl })
        .select('id').single();
      insertedUserMessageId = insertedMsg?.id || null;
      if (insertedUserMessageId) {
        setMessages(prev => prev.map(m => m.id === userOptimisticId ? { ...m, id: insertedUserMessageId! } : m));
      }
    }

    try {
      const payload: any = {
        message: currentInput || (options?.forceVisualPrompt ? "Generate a visual aid" : "Please analyze this screenshot"),
        imageUrl,
        history: messages,
      };

      if (options?.forceVisualPrompt) payload.generateVisualPrompt = options.forceVisualPrompt;
      if (injectedDiagnosticContext) payload.diagnosticContext = injectedDiagnosticContext;
      if (injectedDeviceContext) payload.deviceContext = injectedDeviceContext;
      if (toolParam) payload.productivityTool = toolParam;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 || data?.code === 'CHAT_LIMIT') {
          toast.error(data?.error || 'You have reached your chat limit. Please upgrade.', { duration: 8000 });
          setMessages(prev => prev.slice(0, -1));
          if (insertedUserMessageId) {
            try { await supabaseBrowser.from('chat_messages').delete().eq('id', insertedUserMessageId); } catch {}
          }
          setIsLoading(false);
          setIsGeneratingVisual(false);
          return;
        }
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), role: 'assistant',
          content: data?.error || data?.reply || "Sorry, there was a problem getting a response.",
          imageUrl: data?.imageUrl || undefined, timestamp: new Date()
        }]);
        setIsLoading(false);
        setIsGeneratingVisual(false);
        return;
      }

      const assistantOptimisticId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantOptimisticId, role: 'assistant',
        content: data.reply || "Sorry, I couldn't generate a response right now.",
        imageUrl: data.imageUrl || undefined, timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (currentSessionId) {
        const { data: insertedAssistant } = await supabaseBrowser.from('chat_messages').insert({
          session_id: currentSessionId,
          user_id: (await supabaseBrowser.auth.getUser()).data.user?.id,
          role: 'assistant', content: assistantMessage.content, image_url: data.imageUrl || null
        }).select('id').single();
        if (insertedAssistant?.id) {
          setMessages(prev => prev.map(m => m.id === assistantOptimisticId ? { ...m, id: insertedAssistant.id } : m));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsGeneratingVisual(false);
    }
  };

  // ── Quick fixes ─────────────────────────────────────────────────────────
  const quickFixes = [
    { label: "WiFi Dropping",       prompt: "My WiFi keeps dropping on all my devices. What should I try first?" },
    { label: "Smart Home Offline",  prompt: "My smart lights and cameras are showing 'No Response'." },
    { label: "Windows Slow",        prompt: "Windows 11 is running slow and some apps are crashing." },
    { label: "Printer Not Working", prompt: "My printer won't print or connect." },
    { label: "Phone WiFi Issue",    prompt: "My phone won't stay connected to WiFi." },
    { label: "Suspicious Email",    prompt: "I received a suspicious email that might be phishing. What general steps should I take?" },
    { label: "Possible Malware",    prompt: "My computer is behaving strangely after clicking a link. General first steps for suspected malware?" },
  ];

  const sendQuickFix = (prompt: string) => sendMessage({ directMessage: prompt });

  // ── Manual visual generation ────────────────────────────────────────────
  const handleGenerateVisual = async (previousAssistantText: string) => {
    if (isLoading || isGeneratingVisual) return;
    setIsGeneratingVisual(true);
    try {
      const visualPrompt = `Clear, educational, labeled technical diagram or schematic to help troubleshoot these steps. Clean professional instruction-manual style with arrows, numbers, and text labels. EVERY label, port name, button, cable, and annotation must be spelled 100% correctly and perfectly legible. No misspellings or garbled text. High contrast, precise details. Accurate to mentioned devices. Context: ${previousAssistantText.slice(0, 900)}`;
      const res = await fetch('/api/generate-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: visualPrompt, context: previousAssistantText }),
      });
      const data = await res.json();
      if (!res.ok || !data.imageUrl) { toast.error(data.error || 'Image limit reached or generation failed. Check your usage on the dashboard.'); return; }

      const visualMsg = { id: 'gen-' + Date.now(), role: 'assistant' as const, content: data.reply || "Here's an AI-generated visual to help with the previous steps:", imageUrl: data.imageUrl, timestamp: new Date() };
      setMessages(prev => [...prev, visualMsg]);

      if (sessionId) {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (user) await supabaseBrowser.from('chat_messages').insert({ session_id: sessionId, user_id: user.id, role: 'assistant', content: visualMsg.content, image_url: data.imageUrl });
      }
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 120);
    } catch (err) {
      console.error('Visual generation error:', err);
      toast.error('Unable to generate image right now. Please try again.');
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  // IDs that are system-injected context bubbles — exclude from "Generate visual aid"
  const isContextBubble = (id: string) => id === 'welcome' || id.startsWith('diag-') || id.startsWith('device-');

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full bg-background flex-col">
      {/* Session controls bar */}
      <div className="border-b border-white/[0.07] bg-[#0A0F1E]/80 backdrop-blur-xl px-4 py-2 flex items-center justify-end gap-3 flex-shrink-0">
        {productivityTool && <ProductivityModeBadge tool={productivityTool} />}
        {sessionId && (
          <>
            <Button
              variant="outline" size="sm" onClick={handleToggleResolved}
              className={`gap-1.5 text-xs hidden sm:flex transition-all ${isResolved ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-white/10 hover:bg-white/5'}`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isResolved ? 'Resolved' : 'Mark Resolved'}
            </Button>
            <Button
              variant="outline" size="sm" onClick={startNewChat}
              className="gap-1.5 border-white/10 hover:bg-white/5 text-xs hidden sm:flex"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" /> New Chat
            </Button>
          </>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/[0.07]">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-400 font-medium text-xs tracking-wide">LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — Quick Fixes + Team Context + Prompt Packs */}
        <div className="w-72 border-r border-white/10 bg-card/60 hidden lg:flex flex-col overflow-hidden">
          <div className="px-6 pt-6 pb-2 flex-shrink-0">
            <div className="text-sm text-muted-foreground tracking-wide">
              {productivityTool ? productivityTool.label : 'Quick Fixes'}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="space-y-2">
              {productivityTool ? (
                <ProductivityExamples tool={productivityTool} onSelect={sendQuickFix} disabled={isLoading} />
              ) : (
                quickFixes.map((fix, i) => (
                  <Button key={i} variant="ghost"
                    className="w-full justify-start h-auto py-3 px-4 text-left hover:bg-white/5 border border-transparent hover:border-white/10"
                    onClick={() => sendQuickFix(fix.prompt)}
                  >
                    {fix.label}
                  </Button>
                ))
              )}
            </div>

            {userTeams.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Users className="h-4 w-4" /> Team Context
                </div>
                <select
                  value={selectedTeamId || ''}
                  onChange={(e) => setSelectedTeamId(e.target.value || null)}
                  className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm bg-background"
                >
                  <option value="">Personal (no team)</option>
                  {userTeams.map(team => <option key={team.id} value={team.id}>{team.name} ({team.role})</option>)}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1">Sessions will be shared with your team.</p>

                {userDevices.length > 0 && (
                  <div className="mt-3">
                    <label className="text-xs text-muted-foreground">Device (optional)</label>
                    <select
                      value={selectedDeviceId || ''}
                      onChange={(e) => setSelectedDeviceId(e.target.value || null)}
                      className="w-full border border-white/10 rounded-lg px-3 py-1.5 text-sm bg-background mt-1"
                    >
                      <option value="">No specific device</option>
                      {userDevices.map(device => (
                        <option key={device.id} value={device.id}>
                          {device.name} {device.device_type ? `(${device.device_type})` : ''}
                        </option>
                      ))}
                    </select>

                    {selectedDeviceId && teamMembers.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <label className="text-xs text-muted-foreground whitespace-nowrap">Assign to:</label>
                        <select
                          value={userDevices.find(d => d.id === selectedDeviceId)?.assigned_to || ''}
                          onChange={async (e) => {
                            const newAssigneeId = e.target.value || null;
                            if (!selectedDeviceId) return;
                            try {
                              const { error } = await supabaseBrowser.from('devices').update({ assigned_to: newAssigneeId }).eq('id', selectedDeviceId);
                              if (error) throw error;
                              setUserDevices(prev => prev.map(d => d.id === selectedDeviceId ? { ...d, assigned_to: newAssigneeId } : d));
                              toast.success('Device assignment updated');
                            } catch { toast.error('Failed to update device assignment'); }
                          }}
                          className="flex-1 border border-white/10 rounded-lg px-3 py-1 text-sm bg-background"
                        >
                          <option value="">Unassigned</option>
                          {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {(userTier === 'business' || userTier === 'business_plus') && (
              <div className="pt-4 border-t border-white/10">
                <BusinessPromptPacks onSelectPrompt={(prompt) => sendMessage({ directMessage: prompt })} />
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex-1 flex flex-col relative transition-colors ${isDragging ? 'bg-primary/[0.03]' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none border-2 border-dashed border-primary/40 rounded-lg m-2">
              <div className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-primary/20 text-primary text-sm font-medium">
                Drop image here
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageIn} initial="hidden" animate="visible" exit="exit"
                >
                  <div className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'card-premium border border-white/10 text-foreground'
                  }`}>
                    {msg.imageUrl && (
                      <div className="mb-3">
                        <img src={msg.imageUrl} alt={msg.role === 'assistant' ? "AI-generated visual aid" : "uploaded image"} className="max-w-full rounded-xl ring-1 ring-white/10" />
                        {msg.role === 'assistant' && (
                          <div className="text-[10px] text-muted-foreground mt-1.5 px-1 flex items-center gap-1">
                            🎨 AI-generated visual to help illustrate the steps
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message content — markdown for assistant, plain text for user */}
                    {msg.role === 'assistant' ? (
                      <div className="text-[15px] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-black/20 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:space-y-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_ol]:space-y-0.5 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1 [&_h3]:font-semibold [&_h3]:text-sm [&_h3]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_hr]:border-white/10 [&_hr]:my-2">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</div>
                    )}

                    {/* Action row — copy + visual aid (only on real AI responses, not context bubbles) */}
                    {msg.role === 'assistant' && !isLoading && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="text-xs px-2.5 py-1 rounded-full border border-white/[0.1] hover:bg-white/5 text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
                          title="Copy to clipboard"
                        >
                          {copiedMsgId === msg.id
                            ? <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                            : <><Copy className="h-3 w-3" /> Copy</>
                          }
                        </button>

                        {!msg.imageUrl && !isContextBubble(msg.id) && (
                          <button
                            onClick={() => handleGenerateVisual(msg.content)}
                            className="text-xs px-3 py-1 rounded-full border border-white/[0.1] hover:bg-white/5 text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
                            title="Generate a diagram or visual aid for these steps"
                          >
                            🎨 Generate visual aid
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                  <div className="card-premium border border-white/10 rounded-3xl px-6 py-4 text-muted-foreground">
                    {isGeneratingVisual ? 'Generating visual aid...' : 'MyTech-Fix is thinking...'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sentinel div — scrollToBottom targets this to scroll to the latest message */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 bg-card/60">
            {imagePreview && (
              <div className="mb-4 flex items-center gap-3 bg-white/5 p-3 rounded-2xl max-w-md border border-white/10">
                <img src={imagePreview} alt="preview" className="h-24 rounded-lg object-cover ring-1 ring-white/10" />
                <Button variant="ghost" size="icon" onClick={removeImage}><X className="w-4 h-4" /></Button>
              </div>
            )}

            {isListening && (
              <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 text-sm text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                Listening… tap mic to stop
              </div>
            )}

            {/* Mobile Quick Fix chips — productivity examples when in tool mode */}
            <div className="lg:hidden overflow-x-auto flex gap-2 mb-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {productivityTool ? (
                productivityTool.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuickFix(ex)}
                    disabled={isLoading}
                    className="flex-shrink-0 px-3 py-1.5 text-xs border border-white/10 rounded-full bg-card/60 hover:bg-white/5 whitespace-nowrap text-muted-foreground hover:text-foreground transition disabled:opacity-40"
                  >
                    {ex.length > 35 ? ex.substring(0, 35) + '…' : ex}
                  </button>
                ))
              ) : (
                quickFixes.map((fix, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuickFix(fix.prompt)}
                    disabled={isLoading}
                    className="flex-shrink-0 px-3 py-1.5 text-xs border border-white/10 rounded-full bg-card/60 hover:bg-white/5 whitespace-nowrap text-muted-foreground hover:text-foreground transition disabled:opacity-40"
                  >
                    {fix.label}
                  </button>
                ))
              )}
            </div>

            {/* Capabilities hint + credits hint */}
            <div className="max-w-3xl mx-auto mb-2 flex items-center justify-between gap-2">
              <Button variant="ghost" size="sm" onClick={handleShowCapabilities} disabled={isLoading}
                className="text-xs text-primary hover:text-primary/80 hover:bg-primary/5 px-3 py-1 h-auto">
                What can you help me fix? → See full list of issues
              </Button>
              <div className="text-[10px] text-muted-foreground hidden md:block">
                Ask me "how many credits do I have left?"
              </div>
            </div>

            <div className="max-w-3xl mx-auto flex gap-3">
              <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}
                className="border-white/10 hover:bg-white/5" title="Upload image">
                <Upload className="w-5 h-5" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />

              <Button
                variant="outline" size="icon"
                onClick={toggleVoiceInput}
                disabled={!isSpeechSupported}
                className={`border-white/10 hover:bg-white/5 transition-all ${isListening ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                title={isSpeechSupported ? (isListening ? "Stop listening" : "Speak your message") : "Voice input not supported in this browser"}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                placeholder={isLoading ? "Waiting for response…" : productivityTool ? productivityTool.placeholder : "Describe issue, paste screenshot (Ctrl+V), or tap mic…"}
                disabled={isLoading}
                className="flex-1 bg-background border-white/10 disabled:opacity-60"
              />

              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                size="icon"
                className="btn-premium bg-primary hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl ring-1 ring-white/20">🔧</div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
