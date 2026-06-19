import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import TLDRBox from '@/components/seo/TLDRBox';
import StepItem from '@/components/seo/StepItem';
import MidCTA from '@/components/seo/MidCTA';
import FAQItem from '@/components/seo/FAQItem';
import RelatedGrid from '@/components/seo/RelatedGrid';
import FinalCTA from '@/components/seo/FinalCTA';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Excel Formula Help — AI-Powered Spreadsheet Assistance | MyTech-Fix',
  description:
    'Get instant AI help with Excel formulas, VLOOKUP, INDEX/MATCH, XLOOKUP, pivot tables, and common spreadsheet errors. Plain-language answers, copy-ready formulas.',
  alternates: {
    canonical: `${BASE}/productivity/excel-formula-help`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Productivity', href: '/productivity' },
  { label: 'Excel Formula Help' },
];

const TLDR = [
  'Ask in plain language — you don\'t need to know the formula name before asking.',
  'Paste your broken formula and describe what it should do; the AI will fix it.',
  'Works with Excel (all versions), Google Sheets, and LibreOffice Calc.',
  'All formulas come with a plain-English explanation and a copy-ready version.',
];

const FAQS = [
  {
    question: 'Can you help me fix a formula that returns #VALUE! or #N/A?',
    answer:
      'Absolutely. Paste the formula and describe what data you\'re working with. Common causes include mismatched data types (text vs. numbers), exact-match lookup failures, and wrong range sizes. The AI will pinpoint the issue and rewrite the formula.',
  },
  {
    question: 'What\'s the difference between VLOOKUP and XLOOKUP?',
    answer:
      'VLOOKUP searches down the leftmost column of a range and returns a value to the right. XLOOKUP (Excel 365/2019+) is more flexible: it can look left or right, handles missing matches gracefully without IFERROR wrappers, and uses a simpler syntax. Ask the AI which is right for your version of Excel.',
  },
  {
    question: 'Can you help with Google Sheets formulas too?',
    answer:
      'Yes. Most Excel formulas work identically in Google Sheets. Where they differ (e.g., ARRAYFORMULA, QUERY, IMPORTRANGE are Sheets-specific), the AI will flag it and provide the correct Sheets equivalent.',
  },
  {
    question: 'I need to sum/count/average cells based on a condition. Where do I start?',
    answer:
      'SUMIF, COUNTIF, and AVERAGEIF are your starting points for single-condition logic. For multiple conditions, use SUMIFS, COUNTIFS, and AVERAGEIFS. Just describe the condition in words and the AI will write the exact formula for your data layout.',
  },
  {
    question: 'Can you help me build a pivot table?',
    answer:
      'Yes — the AI can walk you through creating, configuring, and refreshing a pivot table step by step, including how to group dates, add calculated fields, and change the value summarization.',
  },
];

export default function ExcelFormulaHelpPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <Breadcrumb items={BREADCRUMBS} />

        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          📊 Productivity Tool
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50 mb-4 leading-tight">
          Excel Formula Help — Get Answers in Seconds
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          Describe your spreadsheet problem in plain English and get exact formulas, explanations, and fixes — no searching through documentation required.
        </p>

        <TLDRBox points={TLDR} label="What you get" />

        <h2 className="text-xl font-semibold text-slate-100 mb-5 mt-8">Common things to ask about</h2>
        <div className="space-y-0 mb-8">
          <StepItem
            step={1}
            title="Lookup formulas (VLOOKUP, XLOOKUP, INDEX/MATCH)"
            description="The most common formula questions. Tell the AI what you're trying to match and which column you want returned. It will write the exact formula with your column letters and explain each argument."
            tip="If you're on Excel 365 or later, ask about XLOOKUP — it's simpler and handles errors automatically."
          />
          <StepItem
            step={2}
            title="Conditional sums and counts (SUMIF, COUNTIF, SUMIFS)"
            description='Describe the condition in words ("sum column C only when column A says Approved") and the AI will translate that into the correct formula with the right range syntax.'
          />
          <StepItem
            step={3}
            title="Nested IF statements and logic"
            description='If-then-else logic can get complex fast. Paste your current nested IF or describe the logic you need and the AI will write it, or suggest IFS() or SWITCH() as a cleaner alternative.'
            tip="For more than 3 conditions, IFS() is usually easier to read than nested IFs."
          />
          <StepItem
            step={4}
            title="Broken formulas and error messages"
            description="Paste the formula and the error (#VALUE!, #N/A, #REF!, #DIV/0!, #SPILL!). The AI will diagnose the root cause and provide a corrected version."
          />
          <StepItem
            step={5}
            title="Pivot tables and data analysis"
            description="Get step-by-step instructions for creating and configuring pivot tables, adding calculated fields, grouping dates, and refreshing data automatically."
          />
        </div>

        <MidCTA
          heading="Ready to fix your formula?"
          body="Describe your spreadsheet problem and get a copy-ready formula with a plain-English explanation."
          chatLink="/chat?tool=excel"
        />

        <h2 className="text-xl font-semibold text-slate-100 mb-5">Frequently asked questions</h2>
        <div className="rounded-2xl border border-white/10 bg-card/60 px-6 mb-10">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <RelatedGrid
          items={[
            { category: 'Productivity', title: 'Word Document Help', href: '/productivity/word-document-help' },
            { category: 'Productivity', title: 'New Device Setup Help', href: '/productivity/new-device-setup-help' },
            { category: 'Productivity', title: 'All Productivity Tools', href: '/productivity' },
            { category: 'Computers', title: 'Windows Running Slow', href: '/fix/computers/windows/running-slow' },
          ]}
        />

        <FinalCTA
          heading="Get your formula fixed right now"
          body="Ask in plain English. Get a copy-ready formula with a step-by-step explanation — no spreadsheet expertise required."
          chatLink="/chat?tool=excel"
        />
      </main>
    </div>
  );
}
