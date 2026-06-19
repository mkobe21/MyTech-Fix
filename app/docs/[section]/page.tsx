import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { DOC_SECTIONS, getSectionBySlug } from '@/lib/docs-navigation';

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateStaticParams() {
  return DOC_SECTIONS.map(s => ({ section: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: sectionSlug } = await params;
  const section = getSectionBySlug(sectionSlug);
  if (!section) return {};
  return {
    title: `${section.title} — MyTech-Fix Docs`,
    description: section.description,
  };
}

export default async function SectionIndexPage({ params }: Props) {
  const { section: sectionSlug } = await params;
  const section = getSectionBySlug(sectionSlug);
  if (!section) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
        <Link href="/docs" className="hover:text-slate-300 transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-slate-300">{section.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl leading-none flex-shrink-0">{section.icon}</span>
        <div>
          <h1 className="font-sora text-3xl font-bold text-slate-50 tracking-tight mb-2">{section.title}</h1>
          <p className="text-slate-400">{section.description}</p>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {section.items.map((item, idx) => (
          <Link
            key={item.slug}
            href={`/docs/${item.slug}`}
            className="group flex items-center justify-between p-4 rounded-2xl border border-white/[0.07] bg-card/30 hover:border-white/20 hover:bg-card/60 transition-all"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.05] text-xs text-slate-500 flex items-center justify-center font-mono mt-0.5">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-slate-200 group-hover:text-white transition-colors text-sm leading-snug">
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Clock className="w-3 h-3 text-slate-600" />
              <span className="text-xs text-slate-600">5 min</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-10">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All sections
        </Link>
      </div>
    </div>
  );
}
