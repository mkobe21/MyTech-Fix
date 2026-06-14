'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface UsageMeterProps {
  tier: string;
  used: number;
  remaining: number;
  className?: string;
}

const tierLabels: Record<string, string> = {
  free_trial: 'Free Trial',
  single_use: 'Single Use',
  home: 'Home Plan',
  business: 'Small Business',
};

export default function UsageMeter({ tier, used, remaining, className }: UsageMeterProps) {
  const label = tierLabels[tier] || 'Free Trial';
  const isLow = remaining <= 2 && tier !== 'business';

  return (
    <Card className={`border-blue-500/20 bg-blue-500/5 ${className || ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-400">Current Plan</span>
          <span className="font-semibold text-blue-400">{label}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-bold text-blue-400 tabular-nums">{remaining}</span>
          <span className="text-xl text-slate-400">chats left</span>
        </div>

        <div className="text-sm text-slate-500 mb-4">
          {used} used this period
        </div>

        {(tier === 'free_trial' || tier === 'single_use') && (
          <Link href="/pricing">
            <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              Upgrade for more chats
            </Button>
          </Link>
        )}

        {isLow && (
          <p className="text-xs text-amber-400 mt-2">Running low — consider upgrading soon.</p>
        )}
      </CardContent>
    </Card>
  );
}
