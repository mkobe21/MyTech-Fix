'use client';

import { Check, X, Minus } from 'lucide-react';

type CellValue = string | boolean | null;

const FEATURES: { name: string; free: CellValue; single: CellValue; home: CellValue; business: CellValue; biz_pro: CellValue }[] = [
  { name: 'Monthly chats',               free: '3',          single: '5',        home: 'Unlimited',  business: 'Unlimited',  biz_pro: 'Unlimited' },
  { name: 'Team seats',                  free: '1',          single: '1',        home: '1',          business: 'Up to 5',    biz_pro: 'Up to 15' },
  { name: 'Image & screenshot analysis', free: true,         single: true,       home: true,         business: true,         biz_pro: true },
  { name: 'AI-generated diagrams',       free: null,         single: '1 total',  home: '10 / mo',    business: '50 / mo',    biz_pro: '150 / mo' },
  { name: 'Automated diagnostics',       free: '1 total',    single: '1 total',  home: '10 / mo',    business: '50 / mo',    biz_pro: '150 / mo' },
  { name: 'Detailed how-to guidance',    free: false,        single: false,      home: true,         business: true,         biz_pro: true },
  { name: 'Priority AI responses',       free: false,        single: false,      home: false,        business: true,         biz_pro: true },
  { name: 'Productivity app support',    free: false,        single: false,      home: true,         business: true,         biz_pro: true },
  { name: 'Chat history export (CSV)',   free: false,        single: false,      home: false,        business: true,         biz_pro: true },
  { name: 'Shared team history',         free: false,        single: false,      home: false,        business: true,         biz_pro: true },
  { name: 'Device inventory & tagging',  free: false,        single: false,      home: false,        business: true,         biz_pro: true },
  { name: 'Admin dashboard & reports',   free: false,        single: false,      home: false,        business: true,         biz_pro: true },
  { name: 'Usage analytics per member',  free: false,        single: false,      home: false,        business: false,        biz_pro: true },
  { name: 'Multi-location support',      free: false,        single: false,      home: false,        business: true,         biz_pro: true },
  { name: 'Cybersecurity guidance',      free: 'Limited',    single: true,       home: true,         business: true,         biz_pro: true },
];

const COLUMNS: { key: string; label: string; sub: string; highlight?: boolean }[] = [
  { key: 'free',     label: 'Free',       sub: '$0' },
  { key: 'single',   label: 'Quick Fix',  sub: '$7.99' },
  { key: 'home',     label: 'Home',       sub: '$9.99/mo' },
  { key: 'business', label: 'Business',   sub: '$29.99/mo',  highlight: true },
  { key: 'biz_pro',  label: 'Biz Plus',   sub: '$49.99/mo',  highlight: true },
];

function Cell({ value }: { value: CellValue }) {
  if (value === true)  return <Check className="mx-auto h-4 w-4 text-emerald-400" />;
  if (value === false) return <X className="mx-auto h-4 w-4 text-slate-700" />;
  if (value === null)  return <Minus className="mx-auto h-4 w-4 text-slate-700" />;
  return <span>{value}</span>;
}

export default function PlanComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full border-collapse text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/[0.03]">
            <th className="text-left py-4 px-5 font-semibold text-slate-200 w-[220px]">Feature</th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`text-center py-4 px-3 font-medium ${
                  col.highlight
                    ? 'bg-blue-500/10 text-blue-300'
                    : 'text-slate-400'
                }`}
              >
                <div className="font-semibold text-xs uppercase tracking-wide">{col.label}</div>
                <div className={`text-xs mt-0.5 font-normal ${col.highlight ? 'text-blue-400/70' : 'text-slate-600'}`}>{col.sub}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((feature, i) => (
            <tr
              key={i}
              className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <td className="py-3.5 px-5 text-slate-300 font-medium">{feature.name}</td>
              <td className="py-3.5 px-3 text-center text-slate-400"><Cell value={feature.free} /></td>
              <td className="py-3.5 px-3 text-center text-slate-400"><Cell value={feature.single} /></td>
              <td className="py-3.5 px-3 text-center text-slate-300"><Cell value={feature.home} /></td>
              <td className="py-3.5 px-3 text-center text-blue-300/90 font-medium bg-blue-500/[0.04]"><Cell value={feature.business} /></td>
              <td className="py-3.5 px-3 text-center text-blue-300 font-medium bg-blue-500/[0.07]"><Cell value={feature.biz_pro} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
