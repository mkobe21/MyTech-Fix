import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { DOC_SECTIONS, getItemBySlug, getPrevNext } from '@/lib/docs-navigation';
import { getDocSource, extractHeadings, parseFrontmatterOnly } from '@/lib/docs-content';
import { mdxComponents } from '@/components/docs/MDXComponents';
import DocsTOC from '@/components/docs/DocsTOC';
import DocsFeedback from '@/components/docs/DocsFeedback';
import DocsPrevNext from '@/components/docs/DocsPrevNext';

interface Props {
  params: Promise<{ section: string; article: string }>;
}

export async function generateStaticParams() {
  const params: { section: string; article: string }[] = [];
  for (const section of DOC_SECTIONS) {
    for (const item of section.items) {
      const [sectionSlug, articleSlug] = item.slug.split('/');
      if (sectionSlug && articleSlug) {
        params.push({ section: sectionSlug, article: articleSlug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, article } = await params;
  const fullSlug = `${section}/${article}`;
  const found = getItemBySlug(fullSlug);
  if (!found) return {};
  const source = getDocSource(fullSlug);
  const fm = source ? parseFrontmatterOnly(source) : null;
  return {
    title: `${found.item.title} — MyTech-Fix Docs`,
    description: fm?.description ?? found.item.description ?? '',
  };
}

export default async function ArticlePage({ params }: Props) {
  const { section, article } = await params;
  const fullSlug = `${section}/${article}`;

  const found = getItemBySlug(fullSlug);
  if (!found) notFound();

  const source = getDocSource(fullSlug);
  if (!source) notFound();

  const fm = parseFrontmatterOnly(source);
  const headings = extractHeadings(source);
  const { prev, next } = getPrevNext(fullSlug);

  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ],
      },
    },
    components: mdxComponents,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 flex-wrap">
        <Link href="/docs" className="hover:text-slate-300 transition-colors">Docs</Link>
        <span>/</span>
        <Link href={`/docs/${found.section.slug}`} className="hover:text-slate-300 transition-colors">
          {found.section.title}
        </Link>
        <span>/</span>
        <span className="text-slate-300 truncate">{found.item.title}</span>
      </div>

      <div className="flex gap-12">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg leading-none">{found.section.icon}</span>
              <span className="text-xs text-slate-500">{found.section.title}</span>
            </div>
            <h1 className="font-sora text-3xl font-bold text-slate-50 tracking-tight mb-3">
              {fm.title || found.item.title}
            </h1>
            {fm.description && (
              <p className="text-slate-400 text-lg leading-relaxed">{fm.description}</p>
            )}
            {fm.lastUpdated && (
              <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-600">
                <Calendar className="w-3 h-3" />
                Updated {fm.lastUpdated}
              </div>
            )}
          </header>

          {/* MDX content */}
          <article className="prose-custom">
            {content}
          </article>

          {/* Feedback */}
          <DocsFeedback articleSlug={fullSlug} />

          {/* CTA */}
          <div className="mt-8 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm font-medium text-blue-300 mb-1">
              Need personalised help?
            </p>
            <p className="text-xs text-slate-400 mb-3">
              The AI can walk through this with you step by step, tailored to your exact setup.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
            >
              Ask the AI <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Prev / Next */}
          <DocsPrevNext prev={prev} next={next} />
        </div>

        {/* TOC — desktop only */}
        {headings.length > 0 && (
          <aside className="hidden xl:block w-52 flex-shrink-0">
            <DocsTOC headings={headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
