import { DOC_SECTIONS } from './docs-navigation'

export interface DocSearchItem {
  title: string
  description: string
  slug: string
  section: string
  sectionIcon: string
}

// Flat list of all searchable items derived from the nav config.
// Imported in DocsSearch (client component) to build the fuse.js index.
export const DOCS_SEARCH_INDEX: DocSearchItem[] = DOC_SECTIONS.flatMap(section =>
  section.items.map(item => ({
    title: item.title,
    description: item.description ?? '',
    slug: item.slug,
    section: section.title,
    sectionIcon: section.icon,
  }))
)
