'use client';

import type { ProductivityToolConfig } from '@/lib/productivity-prompts';

interface Props {
  tool: ProductivityToolConfig;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function ProductivityExamples({ tool, onSelect, disabled }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Try asking</div>
      {tool.examples.map((example, i) => (
        <button
          key={i}
          onClick={() => onSelect(example)}
          disabled={disabled}
          className="w-full text-left text-sm px-4 py-3 rounded-xl border border-white/10 bg-card/40 hover:bg-white/5 hover:border-white/20 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40 leading-snug"
        >
          "{example}"
        </button>
      ))}
    </div>
  );
}
