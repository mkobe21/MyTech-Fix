-- Add resolved flag to chat_sessions
-- Allows users to mark a troubleshooting session as resolved from the chat UI.

ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS resolved boolean NOT NULL DEFAULT false;

-- The existing policies cover SELECT/INSERT/DELETE but there was no UPDATE policy.
-- This allows users to update their own sessions (e.g. marking resolved).
DROP POLICY IF EXISTS "Users can update own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can update own chat sessions"
  ON public.chat_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
