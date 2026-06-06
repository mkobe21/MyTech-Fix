'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabaseBrowser } from '@/lib/supabase';
import { toast } from 'sonner';
import Link from 'next/link';
import { getTierLabel } from '@/lib/tiers';

function UpgradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'home';

  const [loading, setLoading] = useState(false);
  const [, setUser] = useState<any>(null);

  const selectedPlan = {
    name: getTierLabel(plan === 'free' ? 'free_trial' : plan === 'single' ? 'single_use' : plan === 'home' ? 'home' : plan === 'business_plus' ? 'business_plus' : 'business'),
    price: plan === 'free' ? 0 : plan === 'single' ? 9.99 : plan === 'home' ? 9.99 : plan === 'business_plus' ? 59.99 : 29.99,
    desc: plan === 'free' ? '1 Free Session' : plan === 'single' ? 'One Session' : plan === 'home' ? '$9.99/month' : plan === 'business_plus' ? '$59.99/month' : '$29.99/month',
  };

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) {
        router.push(`/signup?plan=${plan}`);
      }
    });
  }, [plan, router]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      if (data.url) {
        // Redirect to Stripe Checkout (real payment page)
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start upgrade. Check Stripe configuration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold mb-3">Upgrade Your Plan</h1>
        <p className="text-zinc-600 mb-10">
          You're upgrading to: <strong>{selectedPlan.name}</strong>
        </p>

        <Card className="mb-10">
          <CardContent className="p-10">
            <div className="text-6xl font-bold mb-2">${selectedPlan.price}</div>
            <p className="text-zinc-500 mb-8">{selectedPlan.desc}</p>

            <Button 
              onClick={handleUpgrade} 
              disabled={loading}
              className="w-full py-8 text-xl"
            >
              {loading ? "Processing Upgrade..." : `Upgrade to ${selectedPlan.name}`}
            </Button>
          </CardContent>
        </Card>

        <p className="text-sm text-zinc-500">
          You can change or cancel your plan anytime from your dashboard.
        </p>

        <Link href="/pricing" className="text-blue-600 hover:underline block mt-8">
          ← Back to Pricing
        </Link>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading upgrade...</div>}>
      <UpgradeContent />
    </Suspense>
  );
}