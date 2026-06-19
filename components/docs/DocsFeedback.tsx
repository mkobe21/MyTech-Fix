'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';

interface Props {
  articleSlug: string;
}

type FeedbackState = 'idle' | 'helpful' | 'not-helpful' | 'submitted';

export default function DocsFeedback({ articleSlug }: Props) {
  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (helpful: boolean) => {
    setState(helpful ? 'helpful' : 'not-helpful');
    if (helpful) {
      // Save immediately for positive feedback
      await saveFeedback(true, '');
      setState('submitted');
    }
  };

  const saveFeedback = async (helpful: boolean, feedbackComment: string) => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      await supabaseBrowser.from('docs_feedback').insert({
        article_slug: articleSlug,
        helpful,
        comment: feedbackComment || null,
        user_id: user?.id ?? null,
      });
    } catch {
      // Fail silently — feedback is non-critical
    }
  };

  const handleSubmitComment = async () => {
    setSubmitting(true);
    await saveFeedback(false, comment);
    setState('submitted');
    setSubmitting(false);
  };

  if (state === 'submitted') {
    return (
      <div className="border border-white/[0.07] rounded-2xl p-6 text-center mt-12">
        <div className="text-2xl mb-2">🙏</div>
        <p className="text-slate-300 font-medium">Thanks for your feedback!</p>
        <p className="text-sm text-slate-500 mt-1">It helps us improve the documentation.</p>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.07] rounded-2xl p-6 mt-12">
      {state === 'idle' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-300">Was this article helpful?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
            >
              <ThumbsUp className="w-4 h-4" />
              Yes
            </button>
            <button
              onClick={() => handleVote(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
            >
              <ThumbsDown className="w-4 h-4" />
              No
            </button>
          </div>
        </div>
      )}

      {state === 'not-helpful' && (
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3">What was missing or unclear?</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what would make this article better..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none focus:border-blue-500/50 mb-3"
            rows={3}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmitComment}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Sending…' : 'Send feedback'}
            </button>
            <button
              onClick={() => setState('submitted')}
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
