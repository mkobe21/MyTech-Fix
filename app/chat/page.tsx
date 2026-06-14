'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Upload, X, Users, Mic } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabaseBrowser } from '@/lib/supabase';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import BusinessPromptPacks from '@/components/BusinessPromptPacks';
import { motion, AnimatePresence } from 'framer-motion';
import { messageIn } from '@/lib/animations';
import { toast } from 'sonner';
import { getLimit, getTierLabel, pickHighestTier } from '@/lib/tiers';
import { formatDiagnosticReportForChat } from '@/lib/diagnostics';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get('session');
  const diagnosticParam = searchParams.get('diagnostic'); // for auto-inject of a user_diagnostics report

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm MyTech-Fix. I can help with tech troubleshooting, device setup, productivity tasks, and general guidance on cybersecurity events. Describe your issue, paste a screenshot (Ctrl+V), tap the mic to speak, or use Quick Fixes. I can also generate helpful diagrams and visual aids.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Lightweight refs for UI (full shapes come from Supabase joins with extra fields like role/device_type/assigned_to)
  interface TeamRef { id: string; name?: string; role?: string; [k: string]: any }
  interface DeviceRef { id: string; name?: string; device_type?: string | null; assigned_to?: string | null; [k: string]: any }
  interface MemberRef { id: string; full_name?: string | null; email?: string; name?: string; [k: string]: any }

  const [userTeams, setUserTeams] = useState<TeamRef[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [userDevices, setUserDevices] = useState<DeviceRef[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<MemberRef[]>([]);
  const [userTier, setUserTier] = useState<string>('free_trial');

  // Injected diagnostic report context (from ?diagnostic=ID or future picker).
  // We keep the raw row for the structured payload to the backend (so the model sees accurate metrics).
  // A formatted version is shown as a visible message bubble.
  const [injectedDiagnosticContext, setInjectedDiagnosticContext] = useState<any>(null);

  // Voice-to-text (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  // Start as false so server render and initial client render match (avoids hydration mismatch).
  // We detect actual browser support in a useEffect after mount.
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatChannelRef = useRef<any>(null);

  const router = useRouter();

  // Handle "What can you help me fix?" button
  const handleShowCapabilities = () => {
    const capabilityMessage = "What can you help me fix?";
    setInput(capabilityMessage);
    // Trigger send after a short delay so state updates
    setTimeout(() => {
      sendMessage();
    }, 50);
  };

  // ========== Voice-to-Text (SpeechRecognition) ==========
  const toggleVoiceInput = () => {
    if (!isSpeechSupported) {
      toast.error("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        toast.error("Voice input not available.");
        return;
      }

      // Always create a fresh SpeechRecognition instance when the user
      // explicitly starts listening. Reusing a previous instance after
      // errors (especially during Fast Refresh or after 'no-speech') is
      // a common source of repeated "SpeechRecognitionErrorEvent".
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const newText = finalTranscript || interimTranscript;
        if (newText) {
          setInput(newText.trim());
        }
      };

      recognition.onerror = (event: any) => {
        const errorType = event?.error || 'unknown';
        const errorMsg = event?.message || '';

        if (errorType === 'aborted') {
          setIsListening(false);
          return;
        }

        console.warn('Speech recognition error:', errorType, errorMsg);

        if (errorType === 'not-allowed' || errorType === 'permission-denied') {
          toast.error("Microphone access denied. Please allow mic permission in your browser.");
        } else if (errorType === 'no-speech') {
          // Silent for continuous mode — the indicator already shows we're listening.
        } else if (errorType === 'audio-capture') {
          toast.error("Could not access your microphone. Check your device settings.");
        } else {
          toast.error("Voice input ran into a problem.");
        }

        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        // Clear the ref so the next tap creates a clean instance.
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
        setIsListening(true);
      } catch (startErr) {
        console.error('Failed to start SpeechRecognition:', startErr);
        toast.error("Could not start voice input.");
        setIsListening(false);
        recognitionRef.current = null;
      }
    } catch (err) {
      console.warn('Failed to start voice input:', err);
      toast.error("Could not start voice input.");
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };
  // ========== End Voice-to-Text ==========

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup voice recognition on unmount (important for Fast Refresh / HMR)
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
      setIsListening(false);
    };
  }, []);

  // Detect speech support only on the client after mount.
  // This prevents hydration mismatch because the server always sees the initial `false` state.
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setIsSpeechSupported(supported);
  }, []);

  // Load previous chat
  useEffect(() => {
    const loadChatSession = async () => {
      if (!sessionParam) {
        setSessionId(null);
        return;
      }

      try {
        const { data: msgs } = await supabaseBrowser
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionParam)
          .order('created_at', { ascending: true });

        if (msgs && msgs.length > 0) {
          setMessages(msgs.map((m: any) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            imageUrl: m.image_url,
            timestamp: new Date(m.created_at)
          })));
          setSessionId(sessionParam);
        } else {
          setSessionId(sessionParam);
        }
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    };

    loadChatSession();
  }, [sessionParam]);

  // Load business team context
  useEffect(() => {
    const loadBusinessContext = async () => {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) return;

        // Get user's tier: fetch both and pick highest for resilience (e.g. after upgrade webhooks
        // that may only touch one table). This ensures business_plus users get full features.
        let tier = 'free_trial';
        try {
          const { data: prof } = await supabaseBrowser
            .from('profiles')
            .select('tier')
            .eq('id', user.id)
            .maybeSingle();
          const { data: ut } = await supabaseBrowser
            .from('user_tiers')
            .select('tier')
            .eq('user_id', user.id)
            .maybeSingle();
          tier = pickHighestTier(prof?.tier, ut?.tier);
        } catch {}
        setUserTier(tier);

        const isBusinessUser = tier === 'business' || tier === 'business_plus';

        if (isBusinessUser) {
          const { data: memberships } = await supabaseBrowser
            .from('team_members')
            .select(`
              team_id,
              role,
              teams:team_id (id, name)
            `)
            .eq('user_id', user.id);

          if (memberships && memberships.length > 0) {
            const teams = memberships.map((m: any) => ({
              id: m.team_id,
              name: m.teams?.name || 'Unnamed Team',
              role: m.role,
            }));
            setUserTeams(teams);

            // Auto-select first team if none selected
            if (!selectedTeamId && teams.length > 0) {
              setSelectedTeamId(teams[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load business context:', err);
      }
    };

    loadBusinessContext();
  }, []);

  // Load devices when a team is selected (for business users)
  useEffect(() => {
    const loadDevices = async () => {
      if (!selectedTeamId) {
        setUserDevices([]);
        setSelectedDeviceId(null);
        return;
      }

      try {
        const { data: devices } = await supabaseBrowser
          .from('devices')
          .select('id, name, device_type, location, assigned_to')
          .eq('team_id', selectedTeamId)
          .order('name', { ascending: true });

        if (devices) {
          setUserDevices(devices);
        }
      } catch (err) {
        console.error('Failed to load devices:', err);
      }
    };

    loadDevices();
  }, [selectedTeamId]);

  // Load team members when team selected (for device assignment from chat)
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!selectedTeamId) {
        setTeamMembers([]);
        return;
      }
      try {
        const { data: members } = await supabaseBrowser
          .from('team_members')
          .select(`
            user_id,
            profiles!inner (
              id,
              full_name,
              email
            )
          `)
          .eq('team_id', selectedTeamId);
        if (members) {
          const formatted = members.map((m: any) => ({
            id: m.user_id,
            name: m.profiles?.full_name || m.profiles?.email?.split('@')[0] || 'Team Member',
            email: m.profiles?.email,
          }));
          setTeamMembers(formatted);
        }
      } catch (err) {
        console.error('Failed to load team members:', err);
      }
    };
    loadTeamMembers();
  }, [selectedTeamId]);

  // Auto-inject diagnostic report when ?diagnostic=ID is present (one-time per navigation).
  // Fetches the authoritative row (RLS ensures only owner), adds a visible context bubble,
  // and stores the raw data so the next send can pass structured context to the model.
  useEffect(() => {
    const injectDiagnostic = async () => {
      if (!diagnosticParam) return;

      // Avoid re-injecting if we already processed this id (or if a previous session load already has it)
      if (injectedDiagnosticContext?.id === diagnosticParam) return;

      try {
        const { data: diag } = await supabaseBrowser
          .from('user_diagnostics')
          .select('*')
          .eq('id', diagnosticParam)
          .maybeSingle();

        if (!diag) {
          console.warn('Diagnostic not found or not accessible for injection:', diagnosticParam);
          // Clean the param so we don't keep trying
          router.replace(window.location.pathname + (sessionParam ? `?session=${sessionParam}` : ''));
          return;
        }

        // Build a nice visible report bubble using the shared formatter (exact same logic used on the server for the model).
        const formatted = formatDiagnosticReportForChat(diag.results, diag.ai_analysis, diag.run_type);

        const contextMessage: Message = {
          id: `diag-${diag.id}`,
          role: 'assistant',
          content: `📊 ${formatted}\n\n(Report injected from your diagnostics. Ask away — the AI has the full structured data.)`,
          timestamp: new Date(diag.created_at || Date.now()),
        };

        // Prepend the context (after welcome if present) so it's early in the conversation
        setMessages((prev) => {
          const hasContextAlready = prev.some((m) => m.id === contextMessage.id);
          if (hasContextAlready) return prev;
          // Keep the welcome first if it's there, then our report, then the rest
          const welcome = prev.find((m) => m.id === 'welcome');
          const rest = prev.filter((m) => m.id !== 'welcome');
          return welcome ? [welcome, contextMessage, ...rest] : [contextMessage, ...rest];
        });

        // Keep the raw for the payload (so /api/chat can give the model accurate numbers, not just the text we showed the user)
        setInjectedDiagnosticContext({
          id: diag.id,
          results: diag.results,
          analysis: diag.ai_analysis,
          run_type: diag.run_type,
        });

        // Clean the URL param (preserve session if we also navigated with one)
        const base = window.location.pathname;
        const qs = sessionParam ? `?session=${sessionParam}` : '';
        router.replace(base + qs);
      } catch (err) {
        console.error('Failed to load/inject diagnostic into chat:', err);
      }
    };

    injectDiagnostic();
    // Only react to the param changing (and session for qs cleanup). We intentionally omit messages to avoid loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosticParam, sessionParam]);

  // Realtime updates for the current chat session using Supabase
  // This allows live messages from other team members (or other tabs) to appear without refresh.
  useEffect(() => {
    if (!sessionId) {
      // Clean up previous channel if session was cleared
      if (chatChannelRef.current) {
        supabaseBrowser.removeChannel(chatChannelRef.current);
        chatChannelRef.current = null;
      }
      return;
    }

    const channel = supabaseBrowser
      .channel(`chat-session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as any;

          setMessages((prev) => {
            // Deduplicate: the sender already optimistically added their own message,
            // and realtime will echo it back. Also safe for cross-client.
            if (prev.some((m) => m.id === row.id)) return prev;

            return [
              ...prev,
              {
                id: row.id,
                role: row.role as 'user' | 'assistant',
                content: row.content,
                imageUrl: row.image_url || undefined,
                timestamp: new Date(row.created_at),
              },
            ];
          });
        }
      )
      .subscribe();

    chatChannelRef.current = channel;

    return () => {
      if (chatChannelRef.current) {
        supabaseBrowser.removeChannel(chatChannelRef.current);
        chatChannelRef.current = null;
      }
    };
  }, [sessionId]);

  // Paste image support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;

      const { error } = await supabaseBrowser.storage
        .from('chat-uploads')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabaseBrowser.storage
        .from('chat-uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const sendMessage = async (options?: { forceVisualPrompt?: string }) => {
    if ((!input.trim() && !selectedImage && !options?.forceVisualPrompt) || isLoading) return;

    // Stop any active voice recognition when sending
    if (isListening) {
      stopListening();
    }

    // === STRONG TIER ENFORCEMENT (fast client pre-check; server is authoritative for count + increment) ===
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        toast.error("Please sign in to continue.");
        return;
      }

      // Resilient: fetch both profiles and user_tiers, use highest tier, prefer profile usage when present
      let profTier: string | null = null;
      let profUsed = 0;
      let utTier: string | null = null;
      let utUsed = 0;
      try {
        const { data: prof } = await supabaseBrowser
          .from('profiles')
          .select('tier, sessions_used')
          .eq('id', user.id)
          .maybeSingle();
        if (prof) {
          profTier = prof.tier || null;
          profUsed = prof.sessions_used || 0;
        }
        const { data: ut } = await supabaseBrowser
          .from('user_tiers')
          .select('tier, sessions_used')
          .eq('user_id', user.id)
          .maybeSingle();
        if (ut) {
          utTier = ut.tier || null;
          utUsed = ut.sessions_used || 0;
        }
      } catch (e) {
        console.warn('Tier/usage lookup warning in chat:', e);
      }

      const tier = pickHighestTier(profTier, utTier);
      const sessionsUsed = profUsed || utUsed;
      const limit = getLimit(tier);

      if (limit < 9999 && sessionsUsed >= limit) {
        const tierName = getTierLabel(tier);
        const msg = tier === 'single_use'
          ? `You've reached the maximum of ${limit} chats for the Single Use plan. Upgrade to the Home Plan for 30 chats per month and much more value.`
          : `You've reached the maximum of ${limit} chats for the ${tierName} tier. Upgrade for unlimited chats and advanced features.`;
        toast.error(msg, { duration: 8000 });
        return;
      }

      // Note: no client-side increment here anymore. Server /api/chat performs the authoritative
      // limit check + increment (and syncs profiles + user_tiers) before calling the model.
      // This avoids double-counting and races. On server rejection the UI row will be rolled back below.

    } catch (err) {
      console.error("Tier enforcement error:", err);
    }
    // =========================

    let imageUrl: string | null = null;
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
    }

    const isForceVisual = !!options?.forceVisualPrompt;
    const currentInput = isForceVisual ? '' : (input.trim() || '');

    if (isForceVisual) {
      setIsGeneratingVisual(true);
    }

    // Only add a visible user message bubble for normal chat (skip for "Generate visual aid" button)
    if (!isForceVisual) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: currentInput || "[Pasted Screenshot]",
        imageUrl: imageUrl || undefined,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
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
        .insert({
          user_id: user?.id,
          title: (currentInput || "Visual aid request").substring(0, 60) || "New Conversation",
          team_id: selectedTeamId,
          device_id: selectedDeviceId,
        })
        .select('id')
        .single();

      currentSessionId = newSession?.id || null;
      setSessionId(currentSessionId);

      // Persist the injected diagnostic report bubble as its own message row so future ?session reloads restore it.
      // We do this only on session creation (first turn after injection).
      if (currentSessionId && injectedDiagnosticContext) {
        try {
          const reportText = formatDiagnosticReportForChat(
            injectedDiagnosticContext.results,
            injectedDiagnosticContext.analysis,
            injectedDiagnosticContext.run_type
          );
          await supabaseBrowser.from('chat_messages').insert({
            session_id: currentSessionId,
            user_id: (await supabaseBrowser.auth.getUser()).data.user?.id,
            role: 'assistant',
            content: `📊 ${reportText}\n\n(Report injected from diagnostics.)`,
          });
        } catch (e) {
          // Non-fatal: the local bubble is still visible for this session, and the structured context went with the turn.
          console.warn('Could not persist injected diagnostic context message (non-fatal):', e);
        }
      }
    }

    // Only persist a user message row for normal interactions
    let insertedUserMessageId: string | null = null;
    if (currentSessionId && !isForceVisual) {
      const { data: insertedMsg } = await supabaseBrowser
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          user_id: (await supabaseBrowser.auth.getUser()).data.user?.id,
          role: 'user',
          content: currentInput || "[Pasted Screenshot]",
          image_url: imageUrl
        })
        .select('id')
        .single();
      insertedUserMessageId = insertedMsg?.id || null;
    }

    try {
      const payload: any = {
        message: currentInput || (options?.forceVisualPrompt ? "Generate a visual aid" : "Please analyze this screenshot"),
        imageUrl,
        history: messages
      };

      if (options?.forceVisualPrompt) {
        payload.generateVisualPrompt = options.forceVisualPrompt;
      }

      // If we have an injected diagnostic report, pass the structured data (id + raw results + prior analysis).
      // The backend will turn this into high-signal context for the model (more reliable than text history alone).
      if (injectedDiagnosticContext) {
        payload.diagnosticContext = injectedDiagnosticContext;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 || data?.code === 'CHAT_LIMIT') {
          toast.error(data?.error || 'You have reached your chat limit. Please upgrade.', { duration: 8000 });
          // Roll back the optimistic user message we added to UI
          setMessages(prev => prev.slice(0, -1));
          // Best-effort cleanup of the user message row we inserted (so it doesn't count against history)
          if (insertedUserMessageId) {
            try {
              await supabaseBrowser.from('chat_messages').delete().eq('id', insertedUserMessageId);
            } catch {}
          }
          setIsLoading(false);
          setIsGeneratingVisual(false);
          return;
        }
        // Other API errors: surface as assistant note but don't count as successful turn
        console.error('Chat API non-ok response:', data);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data?.error || data?.reply || "Sorry, there was a problem getting a response.",
          imageUrl: data?.imageUrl || undefined,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        setIsGeneratingVisual(false);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't generate a response right now.",
        imageUrl: data.imageUrl || undefined,   // support AI-generated visuals
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (currentSessionId) {
        await supabaseBrowser
          .from('chat_messages')
          .insert({
            session_id: currentSessionId,
            user_id: (await supabaseBrowser.auth.getUser()).data.user?.id,
            role: 'assistant',
            content: assistantMessage.content,
            image_url: data.imageUrl || null   // persist generated image
          });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsGeneratingVisual(false);
    }
  };

  const quickFixes = [
    { label: "WiFi Dropping", prompt: "My WiFi keeps dropping on all my devices. What should I try first?" },
    { label: "Smart Home Offline", prompt: "My smart lights and cameras are showing 'No Response'." },
    { label: "Windows Slow", prompt: "Windows 11 is running slow and some apps are crashing." },
    { label: "Printer Not Working", prompt: "My printer won't print or connect." },
    { label: "Phone WiFi Issue", prompt: "My phone won't stay connected to WiFi." },
    { label: "Suspicious Email", prompt: "I received a suspicious email that might be phishing. What general steps should I take?" },
    { label: "Possible Malware", prompt: "My computer is behaving strangely after clicking a link. General first steps for suspected malware?" },
  ];

  const sendQuickFix = (prompt: string) => {
    setInput(prompt);
    setTimeout(sendMessage, 100);
  };

  // Manual generation button - calls dedicated /api/generate-image (full server-side limit enforcement + usage tracking)
  const handleGenerateVisual = async (previousAssistantText: string) => {
    if (isLoading || isGeneratingVisual) return;

    setIsGeneratingVisual(true);

    try {
      const visualPrompt = `Clear, educational, labeled technical diagram or schematic to help troubleshoot these steps. Clean professional instruction-manual style with arrows, numbers, and text labels. EVERY label, port name, button, cable, and annotation must be spelled 100% correctly and perfectly legible. No misspellings or garbled text. High contrast, precise details. Accurate to mentioned devices. Context: ${previousAssistantText.slice(0, 900)}`;

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: visualPrompt, context: previousAssistantText }),
      });

      const data = await res.json();

      if (!res.ok || !data.imageUrl) {
        const errMsg = data.error || 'Image limit reached or generation failed. Check your usage on the dashboard.';
        toast.error(errMsg);
        return;
      }

      // Append generated visual as assistant message (persisted below)
      const visualMsg = {
        id: 'gen-' + Date.now(),
        role: 'assistant' as const,
        content: data.reply || "Here's an AI-generated visual to help with the previous steps:",
        imageUrl: data.imageUrl,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, visualMsg]);

      // Persist to current session
      if (sessionId) {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (user) {
          await supabaseBrowser.from('chat_messages').insert({
            session_id: sessionId,
            user_id: user.id,
            role: 'assistant',
            content: visualMsg.content,
            image_url: data.imageUrl,
          });
        }
      }

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 120);

    } catch (err) {
      console.error('Manual visual generation error:', err);
      toast.error('Unable to generate image right now. Please try again.');
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col">
      {/* Top Navigation - Premium Glass */}
      <nav className="border-b border-white/10 bg-background/70 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        {/* Left side - Brand + Navigation */}
        <div className="flex items-center gap-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl ring-1 ring-white/20">
              🔧
            </div>
            <span className="font-semibold text-2xl tracking-tight">MyTech-Fix</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 pl-4 border-l border-white/10">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Right side - Status */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">MyTech-Fix</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-medium text-xs tracking-wide">LIVE</span>
          </div>

          <ThemeToggle />
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Quick Fixes + Team Context + Prompt Packs - Scrollable on left */}
        <div className="w-72 border-r border-white/10 bg-card/60 hidden lg:flex flex-col overflow-hidden">
          {/* Fixed Quick Fixes header */}
          <div className="px-6 pt-6 pb-2 flex-shrink-0">
            <div className="text-sm text-muted-foreground tracking-wide">Quick Fixes</div>
          </div>

          {/* Scrollable container for all left-side options */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6"> 
            {/* The actual scrollable options content */}
            <div className="space-y-2">
              {quickFixes.map((fix, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4 text-left hover:bg-white/5 border border-transparent hover:border-white/10"
                  onClick={() => sendQuickFix(fix.prompt)}
                >
                  {fix.label}
                </Button>
              ))}
            </div>

          {/* Team Context for Business Users */}
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
                {userTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.role})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">
                Sessions will be shared with your team.
              </p>

              {/* Device selection */}
              {userDevices.length > 0 && (
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground">Device (optional)</label>
                  <select
                    value={selectedDeviceId || ''}
                    onChange={(e) => setSelectedDeviceId(e.target.value || null)}
                    className="w-full border border-white/10 rounded-lg px-3 py-1.5 text-sm bg-background mt-1"
                  >
                    <option value="">No specific device</option>
                    {userDevices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name} {device.device_type ? `(${device.device_type})` : ''}
                      </option>
                    ))}
                  </select>

                  {/* Assign device from chat context */}
                  {selectedDeviceId && teamMembers.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-muted-foreground whitespace-nowrap">Assign to:</label>
                      <select
                        value={userDevices.find(d => d.id === selectedDeviceId)?.assigned_to || ''}
                        onChange={async (e) => {
                          const newAssigneeId = e.target.value || null;
                          const deviceId = selectedDeviceId;
                          if (!deviceId) return;
                          try {
                            const { error } = await supabaseBrowser
                              .from('devices')
                              .update({ assigned_to: newAssigneeId })
                              .eq('id', deviceId);
                            if (error) throw error;
                            // Update local
                            setUserDevices(prev => prev.map(d =>
                              d.id === deviceId ? { ...d, assigned_to: newAssigneeId } : d
                            ));
                            toast.success('Device assignment updated');
                          } catch (err) {
                            console.error(err);
                            toast.error('Failed to update device assignment');
                          }
                        }}
                        className="flex-1 border border-white/10 rounded-lg px-3 py-1 text-sm bg-background"
                      >
                        <option value="">Unassigned</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Business Prompt Packs for Business Users */}
          {(userTier === 'business' || userTier === 'business_plus') && (
            <div className="pt-4 border-t border-white/10">
              <BusinessPromptPacks onSelectPrompt={(prompt) => {
                setInput(prompt);
                setTimeout(sendMessage, 50);
              }} />
            </div>
          )}
          </div> {/* end scrollable options */}
        </div> {/* end left sidebar */}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background" ref={messagesEndRef}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'card-premium border border-white/10 text-foreground'
                  }`}>
                    {msg.imageUrl && (
                      <div className="mb-3">
                        <img 
                          src={msg.imageUrl} 
                          alt={msg.role === 'assistant' ? "AI-generated visual aid" : "user uploaded image"} 
                          className="max-w-full rounded-xl ring-1 ring-white/10" 
                        />
                        {msg.role === 'assistant' && (
                          <div className="text-[10px] text-muted-foreground mt-1.5 px-1 flex items-center gap-1">
                            🎨 AI-generated visual to help illustrate the steps
                          </div>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Generate visual button for assistant messages (only when no image yet) */}
                    {msg.role === 'assistant' && !msg.imageUrl && !isLoading && (
                      <button
                        onClick={() => handleGenerateVisual(msg.content)}
                        className="mt-3 text-xs px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/5 text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
                        title="Generate a diagram or visual aid for these steps"
                      >
                        🎨 Generate visual aid
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="card-premium border border-white/10 rounded-3xl px-6 py-4 text-muted-foreground">
                    {isGeneratingVisual ? 'Generating visual aid...' : 'MyTech-Fix is thinking...'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area - Premium Dark */}
          <div className="border-t border-white/10 p-4 bg-card/60">
            {imagePreview && (
              <div className="mb-4 flex items-center gap-3 bg-white/5 p-3 rounded-2xl max-w-md border border-white/10">
                <img src={imagePreview} alt="preview" className="h-24 rounded-lg object-cover ring-1 ring-white/10" />
                <Button variant="ghost" size="icon" onClick={removeImage}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Voice listening indicator */}
            {isListening && (
              <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 text-sm text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening... (tap mic to stop)
              </div>
            )}

            {/* Capabilities Button + Quick Usage */}
            <div className="max-w-3xl mx-auto mb-2 flex items-center justify-between gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShowCapabilities}
                className="text-xs text-primary hover:text-primary/80 hover:bg-primary/5 px-3 py-1 h-auto"
              >
                What can you help me fix? → See full list of issues
              </Button>

              {/* Optional compact remaining hint - user can always ask the AI "how many credits left?" for exact numbers */}
              <div className="text-[10px] text-muted-foreground hidden md:block">
                Ask me “how many credits do I have left?”
              </div>
            </div>

            <div className="max-w-3xl mx-auto flex gap-3">
              <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} className="border-white/10 hover:bg-white/5">
                <Upload className="w-5 h-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Voice-to-text button (client-only support detection to avoid hydration mismatch) */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                disabled={!isSpeechSupported}
                className={`border-white/10 hover:bg-white/5 ${isListening ? 'bg-red-500/10 text-red-500 border-red-500/30' : ''}`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                title={isSpeechSupported 
                  ? (isListening ? "Stop listening" : "Speak your message (voice to text)") 
                  : "Voice input not supported in this browser"}
                // suppressHydrationWarning is not needed here because we initialize the state to false (matching SSR)
                // and only update it in a useEffect after mount.
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Describe issue, paste screenshot (Ctrl+V), or tap mic to speak..."
                className="flex-1 bg-background border-white/10"
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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl ring-1 ring-white/20">🔧</div>
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
