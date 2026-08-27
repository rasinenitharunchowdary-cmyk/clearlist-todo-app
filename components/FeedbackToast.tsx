'use client';

import { useEffect } from 'react';
import type { Feedback } from '@/types/todo';

type FeedbackToastProps = {
  feedback: Feedback | null;
  onDismiss: () => void;
};

export function FeedbackToast({ feedback, onDismiss }: FeedbackToastProps) {
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(timer);
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(440px,calc(100%-32px))] -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      <div role={feedback.tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-2xl border p-4 shadow-[0_18px_45px_rgba(16,24,40,.18)] ${feedback.tone === 'success' ? 'border-[#a6f0d7] bg-[#ecfdf7] text-[#08694f]' : 'border-[#f6c7bd] bg-[#fff4f1] text-[#8f2218]'}`}>
        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-current text-xs font-black text-white [box-shadow:inset_0_0_0_12px_rgba(255,255,255,.15)]">{feedback.tone === 'success' ? '✓' : '!'}</span>
        <p className="min-w-0 flex-1 pt-0.5 text-sm font-bold leading-5">{feedback.message}</p>
        <button type="button" onClick={onDismiss} aria-label="Dismiss message" className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-lg font-bold transition hover:bg-black/5">×</button>
      </div>
    </div>
  );
}
