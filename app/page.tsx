import MarketingNavBar from '@/components/marketing/MarketingNavBar';
import HeroSection from '@/components/marketing/HeroSection';
import ProofBar from '@/components/marketing/ProofBar';
import HowItWorks from '@/components/marketing/HowItWorks';
import WhatWeFix from '@/components/marketing/WhatWeFix';
import DiagnosticsHighlight from '@/components/marketing/DiagnosticsHighlight';
import AudienceSection from '@/components/marketing/AudienceSection';
import PricingSection from '@/components/marketing/PricingSection';
import Testimonials from '@/components/marketing/Testimonials';
import FinalCTA from '@/components/marketing/FinalCTA';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-50">
      <MarketingNavBar />
      <HeroSection />
      <ProofBar />
      <HowItWorks />
      <WhatWeFix />
      <DiagnosticsHighlight />
      <AudienceSection />
      <PricingSection />
      <Testimonials />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}
