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
  title: 'Word Document Help — AI-Powered Formatting & Layout Assistance | MyTech-Fix',
  description:
    'Get AI help with Microsoft Word formatting, styles, templates, mail merge, tables of contents, and document layout. Step-by-step answers for home users and small businesses.',
  alternates: {
    canonical: `${BASE}/productivity/word-document-help`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Productivity', href: '/productivity' },
  { label: 'Word Document Help' },
];

const TLDR = [
  'Describe the formatting problem or what you\'re trying to achieve — no technical terms needed.',
  'Get step-by-step menu instructions tailored to your version of Word or Google Docs.',
  'Works with Microsoft Word (2016, 2019, 2021, 365) and Google Docs.',
  'Ask about styles, templates, mail merge, track changes, or any formatting puzzle.',
];

const FAQS = [
  {
    question: "Why does my document look different when I open it on another computer?",
    answer:
      "Usually a font substitution problem — the original font isn't installed on the other computer, so Word replaces it. Fixes: embed fonts before sharing (File → Options → Save → Embed fonts), use a universally available font like Calibri or Arial, or save as PDF when the recipient only needs to read it.",
  },
  {
    question: "How do I create a Table of Contents that updates automatically?",
    answer:
      "Apply Heading 1, Heading 2, etc. styles to your section titles (don't just bold them). Then go to References → Table of Contents and insert an automatic TOC. To update it after editing, right-click the TOC and choose Update Field → Update entire table.",
  },
  {
    question: "How do I stop Word from changing my formatting automatically?",
    answer:
      "AutoCorrect is the usual culprit. Go to File → Options → Proofing → AutoCorrect Options. The AutoFormat As You Type tab is where most automatic formatting changes happen — you can disable bullets, numbered lists, hyperlinks, and style changes individually.",
  },
  {
    question: "Can you help me with mail merge for letters or labels?",
    answer:
      "Yes. Tell the AI whether you're creating letters, labels, or envelopes, and whether your data is in Excel, a CSV, or an Outlook contact list. You'll get step-by-step instructions including how to insert merge fields and preview results before printing.",
  },
  {
    question: "What's the best way to format a long document with consistent styles?",
    answer:
      "Use named Styles (Home → Styles panel) rather than direct formatting. Define Heading 1, Heading 2, Body Text styles once, apply them throughout, and change them globally by modifying the style — every instance updates automatically.",
  },
];

export default function WordDocumentHelpPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <Breadcrumb items={BREADCRUMBS} />

        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          📝 Productivity Tool
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50 mb-4 leading-tight">
          Word Document Help — Formatting Made Simple
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          Get clear, step-by-step answers for any Word or Google Docs question — from basic formatting to mail merge and automatic tables of contents.
        </p>

        <TLDRBox points={TLDR} label="What you get" />

        <h2 className="text-xl font-semibold text-slate-100 mb-5 mt-8">Common things to ask about</h2>
        <div className="space-y-0 mb-8">
          <StepItem
            step={1}
            title="Styles and consistent formatting"
            description="Learn how to use Word's built-in Styles (Heading 1, Heading 2, Body Text) to keep formatting consistent across your whole document. Change a style once and every instance updates automatically."
            tip="Never manually bold or indent a heading — apply a Heading style instead. It unlocks the automatic Table of Contents and Navigation Pane."
          />
          <StepItem
            step={2}
            title="Tables of Contents and navigation"
            description="Get step-by-step instructions for inserting an automatic Table of Contents, keeping it updated as you edit, and customising its appearance and depth."
          />
          <StepItem
            step={3}
            title="Mail merge (letters, labels, envelopes)"
            description="Walk through setting up a mail merge from scratch — connecting a data source, inserting merge fields, previewing results, and printing or exporting to individual documents."
          />
          <StepItem
            step={4}
            title="Tables: inserting, formatting, and layout"
            description="Ask about merging cells, controlling row heights and column widths, applying table styles, converting text to a table, or fixing tables that break awkwardly across pages."
            tip="To stop a table row from splitting across a page, right-click the row → Table Properties → Row → uncheck 'Allow row to break across pages'."
          />
          <StepItem
            step={5}
            title="Track Changes and document review"
            description="Understand how to enable Track Changes, accept or reject individual edits, compare two versions of a document, and manage comments from multiple reviewers."
          />
        </div>

        <MidCTA
          heading="Stuck on a Word formatting problem?"
          body="Describe what you're trying to do and get clear step-by-step instructions — no Word expertise needed."
          chatLink="/chat?tool=word"
        />

        <h2 className="text-xl font-semibold text-slate-100 mb-5">Frequently asked questions</h2>
        <div className="rounded-2xl border border-white/10 bg-card/60 px-6 mb-10">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <RelatedGrid
          items={[
            { category: 'Productivity', title: 'Excel Formula Help', href: '/productivity/excel-formula-help' },
            { category: 'Productivity', title: 'New Device Setup Help', href: '/productivity/new-device-setup-help' },
            { category: 'Productivity', title: 'All Productivity Tools', href: '/productivity' },
            { category: 'Computers', title: 'Windows Running Slow', href: '/fix/computers/windows/running-slow' },
          ]}
        />

        <FinalCTA
          heading="Get your Word question answered now"
          body="Describe your formatting problem in plain English and get step-by-step instructions tailored to your version of Word."
          chatLink="/chat?tool=word"
        />
      </main>
    </div>
  );
}
