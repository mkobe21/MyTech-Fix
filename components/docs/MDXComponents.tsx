import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="font-sora text-3xl font-bold text-slate-50 mt-0 mb-6 tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="font-sora text-xl font-semibold text-slate-100 mt-10 mb-3 tracking-tight border-b border-white/[0.07] pb-2 scroll-mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="font-sora text-base font-semibold text-slate-200 mt-6 mb-2 scroll-mt-6" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-slate-300 leading-7 mb-4" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => (
    href?.startsWith('http') ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors" {...props}>
        {children}
      </a>
    ) : (
      <Link href={href ?? '#'} className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors" {...props}>
        {children}
      </Link>
    )
  ),
  code: ({ children, ...props }) => (
    <code className="px-1.5 py-0.5 text-sm bg-white/[0.07] border border-white/10 rounded text-blue-300 font-mono" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="bg-[#060D1A] border border-white/10 rounded-xl p-5 overflow-x-auto text-sm text-slate-300 font-mono my-6 leading-relaxed" {...props}>
      {children}
    </pre>
  ),
  ul: ({ children, ...props }) => (
    <ul className="text-slate-300 mb-4 space-y-1.5 pl-5 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-slate-300 mb-4 space-y-1.5 pl-5 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-blue-500/50 pl-4 py-0.5 italic text-slate-400 my-5 bg-blue-500/5 rounded-r-lg" {...props}>
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-white/[0.07] my-10" />,
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-white/10" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-white/[0.05]" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-white/[0.02] transition-colors" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="py-2.5 px-3 text-slate-300" {...props}>
      {children}
    </td>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-slate-100" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-slate-300" {...props}>
      {children}
    </em>
  ),
}
