'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { ALL_TIERS, getPricingPlanKey } from '@/lib/tiers';
import PlanComparisonTable from '@/components/PlanComparisonTable';

async function buyImagePack(packKey: string) {
  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: packKey }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || 'Could not start purchase.');
    }
  } catch (e) {
    alert('Purchase flow failed. Please try again.');
  }
}
import { motion } from 'framer-motion';
import { staggerContainerSlow, fadeInUp } from '@/lib/animations';

// Transform centralized config into the shape the pricing UI expects
const tiers = ALL_TIERS.map((t, index) => {
  const defaultDescriptions = [
    'Test the waters',
    'Pay as you go',
    'Best for families & pro home users',
    t.description || 'IT Support for up to 5 Team Members',
    t.description || 'IT Support for up to 15 Team Members',
  ];

  return {
    name: t.label,
    price: t.price || '0',
    period: t.period || '',
    description: defaultDescriptions[index] || t.description || '',
    features: t.features,
    plan: getPricingPlanKey(t.key),
    popular: index === 2,
    buttonText: index === 0 ? 'Start Free Trial' : 
                index === 1 ? 'Buy Single Use' : 
                index === 3 ? 'Get Small Business' : 
                index === 4 ? 'Get Business Plus' : 
                `Choose ${t.label}`,
    annualNote: (t.key === 'home' || t.key === 'business' || t.key === 'business_plus') 
      ? 'or $XX/year (2 months free)' : undefined,
  };
});

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold tracking-tighter mb-4 text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple plans for MyTech-Fix — instant AI troubleshooting and productivity help.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainerSlow}
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 380, damping: 26 } }}
              whileTap={{ scale: 0.985 }}
            >
            <Card 
              className={`pricing-card relative flex flex-col border border-white/10 bg-card/80 backdrop-blur-sm ${tier.popular ? 'popular ring-1 ring-primary/40 scale-[1.01]' : ''}`}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-semibold tracking-tight">{tier.name}</CardTitle>
                <div className="mt-8">
                  <span className="text-6xl font-semibold tracking-tighter tabular-nums">${tier.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3 min-h-[40px]">{tier.description}</p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col px-8 pb-8">
                <ul className="space-y-3.5 mb-10 flex-1 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Most Popular Badge - Above Button */}
                {tier.popular && (
                  <div className="flex justify-center mb-4 -mt-2">
                    <div className="bg-primary text-primary-foreground text-[10px] font-semibold tracking-[1px] px-5 py-1.5 rounded-full flex items-center gap-1.5 uppercase">
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  </div>
                )}

                <Button 
                  asChild 
                  className={`w-full py-7 text-base rounded-xl font-medium mt-auto transition-all ${tier.popular ? 'bg-white text-black hover:bg-white/90 shadow-lg' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  <Link href={isLoggedIn ? `/upgrade?plan=${tier.plan}` : `/signup?plan=${tier.plan}`}>
                    {tier.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Cancel anytime • No hidden fees
        </p>

        {/* Extra Image Packs (one-time purchases) */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold tracking-tight">Need More Images?</h3>
            <p className="text-muted-foreground mt-2">Purchase one-time image packs. Credits are added immediately after payment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { key: 'images_20', count: 20, price: '3.99', label: 'Starter Pack' },
              { key: 'images_50', count: 50, price: '8.99', label: 'Value Pack' },
              { key: 'images_100', count: 100, price: '15.99', label: 'Power Pack' },
            ].map((pack) => (
              <Card key={pack.key} className="card-premium border-white/10 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-semibold tabular-nums">${pack.price}</div>
                  <div className="text-sm text-muted-foreground mt-1">{pack.label}</div>
                  <div className="my-4 text-4xl font-semibold text-primary">{pack.count} <span className="text-base font-normal">images</span></div>
                  <Button 
                    className="w-full btn-premium" 
                    onClick={() => buyImagePack(pack.key)}
                  >
                    Buy {pack.count} Images
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">One-time purchase. Credits added to your account instantly.</p>
        </div>

        {/* Detailed Comparison Table */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8 tracking-tight text-white">Compare Plans</h2>
          <PlanComparisonTable />
        </div>
      </div>
    </div>
  );
}