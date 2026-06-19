import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs')

export function getDocSource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, slug + '.mdx')
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

export interface TOCHeading {
  id: string
  title: string
  level: 2 | 3
}

export function extractHeadings(source: string): TOCHeading[] {
  const regex = /^(#{2,3}) (.+)$/gm
  const headings: TOCHeading[] = []
  let match
  while ((match = regex.exec(source)) !== null) {
    const level = match[1].length as 2 | 3
    const title = match[2].replace(/\*\*|__|\*|_|`/g, '').trim()
    // Matches github-slugger used by rehype-slug
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
    headings.push({ id, title, level })
  }
  return headings
}

export interface DocFrontmatter {
  title: string
  description: string
  section: string
  order?: number
  lastUpdated?: string
}

// Strip frontmatter block so compileMDX receives clean source when parseFrontmatter is true.
// next-mdx-remote handles this internally; this helper is for when we need frontmatter only.
export function parseFrontmatterOnly(source: string): DocFrontmatter {
  const fmMatch = source.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) return { title: '', description: '', section: '' }
  const raw = fmMatch[1]
  const get = (key: string) => {
    const m = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
    return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : ''
  }
  return {
    title: get('title'),
    description: get('description'),
    section: get('section'),
    order: Number(get('order')) || undefined,
    lastUpdated: get('lastUpdated') || undefined,
  }
}
