'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductivityToolCard from '@/components/ProductivityToolCard';
import { PRODUCTIVITY_TOOL_CONFIG, PRODUCTIVITY_TOOL_IDS } from '@/lib/productivity-prompts';
import { supabaseBrowser } from '@/lib/supabase';
import { pickHighestTier } from '@/lib/tiers';
import Link from 'next/link';

export default function ProductivityPage() {
  const [tier, setTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTier = async () => {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) { setTier('free_trial'); setLoading(false); return; }

        const [{ data: prof }, { data: ut }] = await Promise.all([
          supabaseBrowser.from('profiles').select('tier').eq('id', user.id).maybeSingle(),
          supabaseBrowser.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
        ]);
        setTier(pickHighestTier(prof?.tier, ut?.tier));
      } catch {
        setTier('free_trial');
      } finally {
        setLoading(false);
      }
    };
    loadTier();
  }, []);

  const canUseProductivity = !loading && tier != null && !['free_trial', 'single_use'].includes(tier);
  const tools = PRODUCTIVITY_TOOL_IDS.map((id) => PRODUCTIVITY_TOOL_CONFIG[id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            ✨ Productivity
          </div>
          <h1 className="text-4xl font-semibold tracking-tighter text-foreground mb-3">
            Get More Done With AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Specialized AI tools pre-configured with deep expertise in Excel, Word documents, and new device setup.
          </p>
        </div>

        {/* Tier gate */}
        {!loading && !canUseProductivity && (
          <div className="mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center max-w-xl mx-auto">
            <div className="text-3xl mb-3">🔒</div>
            <h2 className="font-semibold text-xl mb-2">Requires a Home Plan or higher</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Upgrade to unlock Excel formula help, Word document assistance, and new device setup guidance.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              View Plans & Upgrade →
            </Link>
          </div>
        )}

        {/* Tool cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {tools.map((tool) => (
            <ProductivityToolCard
              key={tool.id}
              tool={tool}
              locked={loading || !canUseProductivity}
            />
          ))}
        </div>

        {/* How it works — only for unlocked users */}
        {canUseProductivity && (
          <div className="border-t border-white/10 pt-12 mb-14">
            <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Choose a tool',
                  desc: 'Pick Excel, Word, or Device Setup. The AI is pre-loaded with deep expertise in that specific area.',
                },
                {
                  step: '2',
                  title: 'Describe your problem',
                  desc: 'Type your question or paste content you need help with. No special formatting required.',
                },
                {
                  step: '3',
                  title: 'Get expert help instantly',
                  desc: 'Receive step-by-step guidance, copy-ready formulas, or setup instructions in plain language.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked state — show locked cards with upgrade context */}
        {!loading && !canUseProductivity && (
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-xl font-semibold text-center mb-6 text-muted-foreground">What's Included</h2>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-center">
              {[
                { emoji: '📊', title: 'Excel', points: ['Formulas & functions', 'Pivot tables', 'Data analysis', 'Error fixing'] },
                { emoji: '📝', title: 'Word', points: ['Styles & formatting', 'Templates', 'Mail merge', 'Tables of contents'] },
                { emoji: '🖥️', title: 'Device Setup', points: ['New phone setup', 'Laptop first-run', 'Printer setup', 'Data transfer'] },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-card/40 p-5">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-semibold text-sm mb-3">{item.title}</div>
                  <ul className="space-y-1.5">
                    {item.points.map((p) => (
                      <li key={p} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="text-primary/60">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Upgrade to Home Plan →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
