'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import type { ProductivityToolConfig } from '@/lib/productivity-prompts';

interface Props {
  tool: ProductivityToolConfig;
}

const COLOR_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  violet: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
};

export default function ProductivityModeBadge({ tool }: Props) {
  const colors = COLOR_MAP[tool.badgeColor] ?? COLOR_MAP.blue;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${colors}`}>
      <span>{tool.emoji}</span>
      <span className="hidden sm:inline">{tool.label}</span>
      <Link
        href="/chat"
        className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
        title="Exit to regular chat"
      >
        <X className="w-3 h-3" />
      </Link>
    </div>
  );
}
