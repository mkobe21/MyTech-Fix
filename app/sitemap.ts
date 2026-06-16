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
    // WiFi & Networking category hub
    {
      url: `${base}/fix/wifi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
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
    // Printers category hub
    {
      url: `${base}/fix/printers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
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
    // Smart Home category hub
    {
      url: `${base}/fix/smart-home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Nest Thermostat brand hub
    {
      url: `${base}/fix/smart-home/nest-thermostat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Nest Thermostat guides
    {
      url: `${base}/fix/smart-home/nest-thermostat/offline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/nest-thermostat/wont-connect-to-wifi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/nest-thermostat/not-responding-in-app`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/nest-thermostat/firmware-update-stuck`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Ring Doorbell brand hub
    {
      url: `${base}/fix/smart-home/ring-doorbell`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Ring Doorbell guides
    {
      url: `${base}/fix/smart-home/ring-doorbell/offline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/ring-doorbell/wont-connect-to-wifi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/ring-doorbell/motion-detection-not-working`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/ring-doorbell/battery-draining-fast`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Smart Home cross-ecosystem guides
    {
      url: `${base}/fix/smart-home/nest-thermostat-not-showing-in-google-home`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/ring-doorbell-not-working-with-alexa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/philips-hue-not-syncing-with-homekit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/ecobee-not-working-with-google-home`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/smart-home/wyze-cam-not-working-with-google-home`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Computers category hub
    {
      url: `${base}/fix/computers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Windows brand hub
    {
      url: `${base}/fix/computers/windows`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Windows guides
    {
      url: `${base}/fix/computers/windows/wifi-keeps-disconnecting`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/computers/windows/running-slow`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/computers/windows/blue-screen-error`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/computers/windows/wont-install-updates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
