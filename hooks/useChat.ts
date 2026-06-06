'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface UseChatOptions {
  initialSessionId?: string | null;
}

interface UseChatReturn {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  selectedImage: File | null;
  imagePreview: string | null;
  sessionId: string | null;

  // Actions
  sendMessage: () => Promise<void>;
  selectImage: (file: File) => void;
  removeImage: () => void;
  sendQuickFix: (prompt: string) => void;
  abortCurrentRequest: () => void;
}

/**
 * useChat hook
 * Encapsulates the entire MyTech-Fix chat state machine, image handling,
 * Supabase persistence, and communication with /api/chat.
 *
 * This makes the chat page dramatically simpler and easier to enhance
 * (streaming, regenerate, edit, etc.).
 */
export function useChat({ initialSessionId }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm MyTech-Fix. Describe your issue or use Quick Fixes. You can also paste a screenshot (Ctrl+V).",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId ?? null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  }, [imagePreview]);

  const selectImage = useCallback((file: File) => {
    removeImage(); // clean previous
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, [removeImage]);

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
      console.error('Image upload failed:', err);
      toast.error('Failed to upload image. Sending text only.');
      return null;
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    let imageUrl: string | null = null;
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || '[Pasted Screenshot]',
      imageUrl: imageUrl || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    removeImage();
    setIsLoading(true);

    // Abort controller for this request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let currentSessionId = sessionId;

    try {
      // Ensure we have a session (best effort)
      if (!currentSessionId) {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        const { data: newSession } = await supabaseBrowser
          .from('chat_sessions')
          .insert({
            user_id: user?.id,
            title: currentInput.substring(0, 60) || 'New Conversation',
          })
          .select('id')
          .single();

        currentSessionId = newSession?.id || null;
        if (currentSessionId) setSessionId(currentSessionId);
      }

      // Persist user message (fire and forget — server is source of truth for limits)
      if (currentSessionId) {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        await supabaseBrowser.from('chat_messages').insert({
          session_id: currentSessionId,
          user_id: user?.id,
          role: 'user',
          content: currentInput || '[Pasted Screenshot]',
          image_url: imageUrl,
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput || 'Please analyze this screenshot',
          imageUrl,
          history: messages,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        
        if (response.status === 402 || errData.code === 'RATE_LIMIT') {
          toast.error(errData.error || 'You have reached your chat limit. Please upgrade.', {
            duration: 6000,
          });
          // Remove the optimistic user message on hard limit
          setMessages((prev) => prev.slice(0, -1));
          return;
        }

        throw new Error(errData.error || `Request failed with ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't generate a response right now.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Persist assistant reply
      if (currentSessionId) {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        await supabaseBrowser.from('chat_messages').insert({
          session_id: currentSessionId,
          user_id: user?.id,
          role: 'assistant',
          content: assistantMessage.content,
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // User cancelled — we already removed optimistic message if needed
        return;
      }
      console.error('Send message error:', error);
      toast.error(error.message || 'Failed to get a response. Please try again.');
      // Roll back the user message on total failure
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const abortCurrentRequest = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const sendQuickFix = (prompt: string) => {
    setInput(prompt);
    // Small delay so state updates before send
    setTimeout(() => {
      sendMessage();
    }, 50);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    selectedImage,
    imagePreview,
    sessionId,
    sendMessage,
    selectImage,
    removeImage,
    sendQuickFix,
    abortCurrentRequest,
  };
}
