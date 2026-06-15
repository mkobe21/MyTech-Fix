import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/fix`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Eero brand hub
    {
      url: `${base}/fix/wifi/eero`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Eero 6 guides
    {
      url: `${base}/fix/wifi/eero-6/red-light-blinking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/wifi/eero-6/wont-connect-to-app`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/wifi/eero-6/keeps-disconnecting`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/wifi/eero-6/slow-speeds`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Netgear Orbi brand hub
    {
      url: `${base}/fix/wifi/netgear-orbi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Netgear Orbi guides
    {
      url: `${base}/fix/wifi/netgear-orbi/red-light-blinking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/wifi/netgear-orbi/wont-connect-to-app`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/wifi/netgear-orbi/keeps-disconnecting`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/wifi/netgear-orbi/slow-speeds`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // HP OfficeJet brand hub
    {
      url: `${base}/fix/printers/hp-officejet`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // HP OfficeJet guides
    {
      url: `${base}/fix/printers/hp-officejet/offline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/printers/hp-officejet/wont-print`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/printers/hp-officejet/wont-connect-to-wifi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/printers/hp-officejet/print-queue-stuck`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Canon PIXMA brand hub
    {
      url: `${base}/fix/printers/canon-pixma`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Canon PIXMA guides
    {
      url: `${base}/fix/printers/canon-pixma/offline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/printers/canon-pixma/wont-print`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/printers/canon-pixma/wont-connect-to-wifi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/printers/canon-pixma/print-queue-stuck`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
