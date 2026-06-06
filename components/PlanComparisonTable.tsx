'use client';

import { Check, X } from 'lucide-react';

const features = [
  { name: 'Monthly Chat Allowance', free: '5', single: '10', home: '30', business: 'Unlimited', business_pro: 'Unlimited' },
  { name: 'Team Accounts / Seats', free: '1', single: '1', home: '1', business: 'Up to 5', business_pro: 'Up to 15' },
  { name: 'Shared Conversation History', free: false, single: false, home: false, business: true, business_pro: true },
  { name: 'Device Inventory & Tagging', free: false, single: false, home: false, business: true, business_pro: true },
  { name: 'Admin Dashboard & Reports', free: false, single: false, home: false, business: true, business_pro: true },
  { name: 'Usage Analytics per Team Member', free: false, single: false, home: false, business: false, business_pro: true },
  { name: 'Export Conversation History', free: false, single: false, home: false, business: false, business_pro: true },
  { name: 'Multi-location Support', free: false, single: false, home: false, business: true, business_pro: true },
  { name: 'Priority Response Speed', free: false, single: false, home: true, business: true, business_pro: true },
  { name: 'Advanced Workflow & Productivity Assistance', free: false, single: false, home: 'Limited', business: true, business_pro: true },
  { name: 'Image Analysis', free: 'Limited', single: true, home: true, business: true, business_pro: true },
  { name: 'AI Image Generation (diagrams, visuals, layouts)', free: '1 total', single: '3 total', home: '10 / month', business: '50 / month', business_pro: '100 / month' },
  { name: 'Automated Diagnostics (speed, latency, packet loss, DNS, WiFi + MyTech-Fix AI analysis)', free: '1 total', single: '3 total', home: '10 / month', business: '50 / month', business_pro: '100 / month' },
  { name: 'Productivity App Support (Excel, Email, etc.)', free: false, single: false, home: true, business: true, business_pro: true },
  { name: 'General Cybersecurity Event Guidance (advice + professional referral)', free: 'Limited', single: true, home: true, business: true, business_pro: true },
];

export default function PlanComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card/50 backdrop-blur">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="text-left py-4 px-6 font-semibold text-white">Feature</th>
            <th className="text-center py-4 px-4 font-medium text-muted-foreground">Free Trial</th>
            <th className="text-center py-4 px-4 font-medium text-muted-foreground">Single Use</th>
            <th className="text-center py-4 px-4 font-medium text-muted-foreground">Home</th>
            <th className="text-center py-4 px-4 font-semibold text-primary bg-primary/10">Small Business</th>
            <th className="text-center py-4 px-4 font-semibold text-primary bg-primary/20 rounded-tr-2xl">Business Pro</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td className="py-4 px-6 font-medium text-foreground">{feature.name}</td>
              <td className="py-4 px-4 text-center text-muted-foreground">{renderValue(feature.free)}</td>
              <td className="py-4 px-4 text-center text-muted-foreground">{renderValue(feature.single)}</td>
              <td className="py-4 px-4 text-center text-muted-foreground">{renderValue(feature.home)}</td>
              <td className="py-4 px-4 text-center text-primary/90 font-medium bg-primary/5">{renderValue(feature.business)}</td>
              <td className="py-4 px-4 text-center text-primary font-medium bg-primary/10">{renderValue(feature.business_pro)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderValue(value: string | boolean) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-emerald-600" />;
  if (value === false) return <X className="mx-auto h-4 w-4 text-zinc-300" />;
  return value;
}
