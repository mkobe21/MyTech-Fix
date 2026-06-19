export interface DocNavItem {
  title: string
  slug: string
  description?: string
}

export interface DocNavSection {
  title: string
  slug: string
  icon: string
  description: string
  items: DocNavItem[]
}

export const DOC_SECTIONS: DocNavSection[] = [
  {
    title: 'Getting Started',
    slug: 'getting-started',
    icon: '🚀',
    description: 'New to MyTech-Fix? Start here.',
    items: [
      { title: 'What is MyTech-Fix?', slug: 'getting-started/what-is-mytech-fix', description: "An overview of what MyTech-Fix does and who it's for." },
      { title: 'Creating Your Account', slug: 'getting-started/creating-your-account', description: 'Sign up and get your account set up in minutes.' },
      { title: 'Your First Chat Session', slug: 'getting-started/your-first-chat', description: 'How to describe a problem and get AI-powered help.' },
      { title: 'Adding Your First Device', slug: 'getting-started/adding-your-first-device', description: 'Track your hardware so the AI knows your setup.' },
    ],
  },
  {
    title: 'Monitor — Network Diagnostics',
    slug: 'monitor',
    icon: '📊',
    description: 'Understanding your network health and diagnostic results.',
    items: [
      { title: 'Network Diagnostics Explained', slug: 'monitor/network-diagnostics-explained', description: 'What the four diagnostic tests measure and how they work.' },
      { title: 'Understanding Your Results', slug: 'monitor/understanding-your-results', description: 'How to interpret Good, Fair, and Poor scores.' },
    ],
  },
  {
    title: 'Maintain — Device Monitoring',
    slug: 'maintain',
    icon: '🛡️',
    description: 'Automated firmware, security, and maintenance monitoring.',
    items: [
      { title: 'How Device Monitoring Works', slug: 'maintain/how-device-monitoring-works', description: 'How MyTech-Fix watches your devices for issues in the background.' },
      { title: 'Firmware and Security Alerts', slug: 'maintain/firmware-and-security-alerts', description: 'What triggers an alert and what to do when you receive one.' },
      { title: 'Notification Preferences', slug: 'maintain/notification-preferences', description: 'Control which alerts you receive and how often.' },
    ],
  },
  {
    title: 'Fix — AI Troubleshooting',
    slug: 'fix',
    icon: '🔧',
    description: 'How the AI chat and troubleshooting engine works.',
    items: [
      { title: 'How AI Troubleshooting Works', slug: 'fix/how-ai-troubleshooting-works', description: 'How the AI analyzes your problem and generates step-by-step fixes.' },
      { title: 'Getting the Best Results', slug: 'fix/getting-the-best-results', description: 'Tips for describing problems clearly and getting accurate help.' },
      { title: 'Supported Devices', slug: 'fix/supported-devices', description: 'The full list of device categories and brands MyTech-Fix can help with.' },
    ],
  },
  {
    title: 'Productivity Tools',
    slug: 'productivity',
    icon: '⚡',
    description: 'AI help for Excel, Word, and new device setup.',
    items: [
      { title: 'Excel Formula Help', slug: 'productivity/excel-formula-help', description: 'Get instant help with formulas, pivot tables, and spreadsheet logic.' },
      { title: 'Word Document Help', slug: 'productivity/word-document-help', description: 'Formatting, styles, mail merge, and document structure assistance.' },
      { title: 'Device Setup Help', slug: 'productivity/device-setup-help', description: 'Step-by-step guidance for setting up new phones, laptops, and printers.' },
    ],
  },
  {
    title: 'Devices',
    slug: 'devices',
    icon: '🖥️',
    description: 'Managing your device inventory and profiles.',
    items: [
      { title: 'Adding and Managing Devices', slug: 'devices/adding-and-managing-devices', description: 'How to add, edit, and organise devices in your inventory.' },
      { title: 'Device Memory Explained', slug: 'devices/device-memory-explained', description: 'How device context improves AI troubleshooting accuracy.' },
    ],
  },
  {
    title: 'Plans & Billing',
    slug: 'billing',
    icon: '💳',
    description: 'Plans, pricing, sessions, and the outcome guarantee.',
    items: [
      { title: 'Plans and Pricing', slug: 'billing/plans-and-pricing', description: 'Compare all available plans and what each includes.' },
      { title: 'How Sessions Work', slug: 'billing/how-sessions-work', description: 'What counts as a session and how limits reset.' },
      { title: 'Upgrading and Cancelling', slug: 'billing/upgrading-and-cancelling', description: 'How to change your plan or cancel at any time.' },
      { title: 'The Outcome Guarantee', slug: 'billing/outcome-guarantee', description: "What MyTech-Fix guarantees and what happens if it doesn't work." },
    ],
  },
  {
    title: 'Teams',
    slug: 'teams',
    icon: '👥',
    description: 'Team setup, shared history, and business features.',
    items: [
      { title: 'Setting Up a Team', slug: 'teams/setting-up-a-team', description: 'Create a team workspace and invite your colleagues.' },
      { title: 'Team History and Reports', slug: 'teams/team-history-and-reports', description: 'View shared chat history and usage reports across your team.' },
    ],
  },
  {
    title: 'Troubleshooting the App',
    slug: 'troubleshooting',
    icon: '⚙️',
    description: "Something not working? Here's how to fix it.",
    items: [
      { title: 'Chat Not Responding', slug: 'troubleshooting/chat-not-responding', description: 'What to do if the AI chat stops responding or errors out.' },
      { title: 'Diagnostics Not Running', slug: 'troubleshooting/diagnostics-not-running', description: 'Common reasons why network diagnostics fail to start or complete.' },
      { title: 'Notifications Not Arriving', slug: 'troubleshooting/notifications-not-arriving', description: 'Why device alerts may not be appearing and how to fix it.' },
    ],
  },
  {
    title: 'Privacy & Security',
    slug: 'privacy',
    icon: '🔒',
    description: 'How your data is handled and protected.',
    items: [
      { title: 'Data and Privacy', slug: 'privacy/data-and-privacy', description: 'What data MyTech-Fix collects, stores, and how long it is kept.' },
      { title: 'AI Conversation Handling', slug: 'privacy/ai-conversation-handling', description: 'How your chat messages are processed by the AI and what is retained.' },
    ],
  },
]

export function getSectionBySlug(slug: string): DocNavSection | undefined {
  return DOC_SECTIONS.find(s => s.slug === slug)
}

export function getItemBySlug(fullSlug: string): { section: DocNavSection; item: DocNavItem } | undefined {
  for (const section of DOC_SECTIONS) {
    const item = section.items.find(i => i.slug === fullSlug)
    if (item) return { section, item }
  }
  return undefined
}

export function getPrevNext(fullSlug: string): { prev: DocNavItem | null; next: DocNavItem | null } {
  const allItems = DOC_SECTIONS.flatMap(s => s.items)
  const idx = allItems.findIndex(i => i.slug === fullSlug)
  return {
    prev: idx > 0 ? allItems[idx - 1] : null,
    next: idx < allItems.length - 1 ? allItems[idx + 1] : null,
  }
}
