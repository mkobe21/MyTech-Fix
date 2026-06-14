'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Check, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabaseBrowser } from '@/lib/supabase';
import PlanComparisonTable from '@/components/PlanComparisonTable';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// ── Plan data ─────────────────────────────────────────────────────────────────

const SUBSCRIPTION_PLANS = [
  {
    key: 'home',
    name: 'Home',
    monthly: 9.99,
    annual: 89,
    annualSave: 31,
    description: 'Best for individuals & families',
    popular: true,
    seats: null,
    features: [
      'Unlimited chats',
      'Image & screenshot analysis',
      '10 AI-generated diagrams / month',
      '10 automated diagnostics / month',
      'Detailed how-to guidance',
      'Productivity app support (Excel, Word)',
      'Full chat history',
    ],
  },
  {
    key: 'business',
    name: 'Small Business',
    monthly: 29.99,
    annual: 299,
    annualSave: 61,
    description: 'IT support for teams',
    popular: false,
    seats: 5,
    features: [
      'Up to 5 seats',
      'Unlimited chats for the team',
      'Shared history & device inventory',
      '50 AI-generated diagrams / month',
      '50 automated diagnostics / month',
      'Admin dashboard & usage reports',
      'Multi-location support',
    ],
  },
  {
    key: 'business_plus',
    name: 'Business Plus',
    monthly: 49.99,
    annual: 499,
    annualSave: 101,
    description: 'Grow your business without IT costs',
    popular: false,
    seats: 15,
    features: [
      'Up to 15 seats (~$3.33/seat)',
      'Unlimited chats for the team',
      'Shared history & device inventory',
      '150 AI-generated diagrams / month',
      '150 automated diagnostics / month',
      'Admin dashboard & per-member analytics',
      'Multi-location + export history',
    ],
  },
];

const IMAGE_PACKS = [
  { key: 'images_20',  count: 20,  price: '3.99',  label: 'Starter Pack' },
  { key: 'images_50',  count: 50,  price: '8.99',  label: 'Value Pack' },
  { key: 'images_100', count: 100, price: '15.99', label: 'Power Pack' },
];

// ── Checkout helpers ──────────────────────────────────────────────────────────

async function startCheckout(plan: string) {
  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || 'Could not start checkout.');
    }
  } catch {
    alert('Checkout failed. Please try again.');
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const planLink = (key: string) =>
    isLoggedIn ? `/upgrade?plan=${key}` : `/signup?plan=${key}`;

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            Pricing
          </div>
          <h1 className="font-sora text-4xl sm:text-5xl font-bold text-slate-50 tracking-tight mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Less than one Geek Squad visit — and we&apos;re available 24/7.
          </p>

          {/* Annual / monthly toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-800/60 border border-white/[0.07] rounded-full px-4 py-2">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
                !annual ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                annual ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Annual
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                SAVE 16%
              </span>
            </button>
          </div>
        </div>

        {/* ── Free trial banner ── */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 mb-8">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-100">Try free — no credit card required.</span>
              <span className="text-slate-400 text-sm ml-2">3 sessions + 1 diagnostic run, on us.</span>
            </div>
          </div>
          <Link
            href={isLoggedIn ? '/chat' : '/signup?plan=free'}
            className="flex-shrink-0 px-5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/30 transition-colors"
          >
            Start free →
          </Link>
        </div>

        {/* ── Subscription plan cards ── */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {SUBSCRIPTION_PLANS.map((plan) => (
            <motion.div
              key={plan.key}
              variants={fadeInUp}
              className={`relative rounded-3xl border flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.10)]'
                  : 'border-white/[0.07] bg-gray-900'
              }`}
            >
              {plan.popular && (
                <>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rounded-t-3xl" />
                </>
              )}

              <div className="mb-5">
                <div className="font-sora font-bold text-slate-50 text-lg mb-0.5">{plan.name}</div>
                {plan.seats && (
                  <div className="text-xs text-blue-400 font-medium mb-1">
                    Up to {plan.seats} seats · ${(annual ? plan.annual / 12 / plan.seats : plan.monthly / plan.seats).toFixed(2)}/seat/mo
                  </div>
                )}
                <div className="flex items-end gap-1 mt-2 mb-1">
                  <span className="font-sora text-3xl font-bold text-slate-50">
                    ${annual ? (plan.annual / 12).toFixed(2) : plan.monthly}
                  </span>
                  <span className="text-slate-500 text-sm pb-1">/mo</span>
                </div>
                {annual && (
                  <div className="text-xs text-emerald-400 font-medium">
                    Billed ${plan.annual}/yr · save ${plan.annualSave}
                  </div>
                )}
                <p className="text-slate-500 text-xs mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={planLink(plan.key)}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'border border-white/[0.12] text-slate-200 hover:bg-white/5 hover:border-white/25'
                }`}
              >
                {isLoggedIn ? 'Upgrade Now' : 'Get Started'}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Quick Fix one-time option ── */}
        <div className="rounded-2xl border border-white/[0.07] bg-gray-900/60 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-16">
          <div>
            <span className="font-semibold text-slate-200">Just need a one-time fix?</span>
            <span className="text-slate-400 text-sm ml-2">Quick Fix Pack — 5 sessions + 1 diagnostic for</span>
            <span className="text-slate-100 font-bold ml-1">$7.99</span>
            <span className="text-slate-500 text-xs ml-2">one-time, no subscription</span>
          </div>
          <Link
            href={planLink('single')}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 font-semibold text-sm transition-colors"
          >
            Buy Quick Fix →
          </Link>
        </div>

        {/* ── Compare plans ── */}
        <div className="mb-16">
          <h2 className="font-sora text-2xl font-bold text-slate-50 tracking-tight text-center mb-2">
            Compare plans
          </h2>
          <p className="text-slate-500 text-sm text-center mb-8">Full feature breakdown across all tiers</p>
          <PlanComparisonTable />
        </div>

        {/* ── Image packs ── */}
        <div>
          <div className="text-center mb-8">
            <h3 className="font-sora text-2xl font-bold text-slate-50 tracking-tight mb-2">
              Need more AI diagrams?
            </h3>
            <p className="text-slate-400">
              One-time image credit packs — added to your account instantly after payment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {IMAGE_PACKS.map((pack) => (
              <div
                key={pack.key}
                className="rounded-2xl border border-white/[0.07] bg-gray-900 p-6 text-center"
              >
                <div className="font-sora text-3xl font-bold text-slate-50 tabular-nums mb-1">
                  ${pack.price}
                </div>
                <div className="text-sm text-slate-500 mb-3">{pack.label}</div>
                <div className="font-sora text-4xl font-bold text-blue-400 mb-1">
                  {pack.count}
                </div>
                <div className="text-sm text-slate-400 mb-5">AI diagrams</div>
                <button
                  onClick={() => startCheckout(pack.key)}
                  className="w-full py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 font-semibold text-sm transition-colors"
                >
                  Buy {pack.count} images
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-4">
            One-time purchase · Credits never expire · Available on all paid plans
          </p>
        </div>

        <p className="text-center text-sm text-slate-600 mt-16">
          Cancel anytime · No hidden fees · All plans include a 5-chat free trial
        </p>
      </div>
    </div>
  );
}
