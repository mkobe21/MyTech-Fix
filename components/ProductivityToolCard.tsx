import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import type { ProductivityToolConfig } from '@/lib/productivity-prompts';

interface Props {
  tool: ProductivityToolConfig;
  locked?: boolean;
}

const GRADIENT_MAP: Record<string, string> = {
  emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40',
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40',
  violet: 'from-violet-500/10 to-violet-600/5 border-violet-500/20 hover:border-violet-500/40',
};

const DOT_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400',
  blue: 'bg-blue-500/20 text-blue-400',
  violet: 'bg-violet-500/20 text-violet-400',
};

function CardContent({ tool, locked }: Props) {
  const gradients = GRADIENT_MAP[tool.badgeColor] ?? GRADIENT_MAP.blue;
  const dotColors = DOT_MAP[tool.badgeColor] ?? DOT_MAP.blue;

  return (
    <div className={`group relative rounded-2xl border bg-gradient-to-br p-6 transition-all h-full ${gradients} ${locked ? 'opacity-60' : ''}`}>
      {locked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${dotColors}`}>
        {tool.emoji}
      </div>
      <h3 className="font-semibold text-lg mb-2">{tool.label}</h3>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{tool.description}</p>
      <div className="space-y-2 mb-5">
        {tool.examples.slice(0, 2).map((ex, i) => (
          <div key={i} className="text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/[0.07] text-muted-foreground truncate">
            "{ex}"
          </div>
        ))}
      </div>
      {locked ? (
        <div className="text-sm text-muted-foreground">Requires Home Plan or higher</div>
      ) : (
        <div className="text-sm font-medium text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
          Open tool <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default function ProductivityToolCard({ tool, locked = false }: Props) {
  if (locked) {
    return <CardContent tool={tool} locked />;
  }

  return (
    <Link href={tool.chatUrl} className="block h-full">
      <CardContent tool={tool} />
    </Link>
  );
}
