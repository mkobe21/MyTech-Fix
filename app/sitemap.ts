import type { MetadataRoute } from 'next';
import { DOC_SECTIONS } from '@/lib/docs-navigation';

function buildDocsRoutes(base: string): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];
  for (const section of DOC_SECTIONS) {
    routes.push({
      url: `${base}/docs/${section.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    for (const item of section.items) {
      routes.push({
        url: `${base}/docs/${item.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }
  return routes;
}

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
    // VPN & Remote Work category hub
    {
      url: `${base}/fix/vpn-remote-work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Windows VPN brand hub
    {
      url: `${base}/fix/vpn-remote-work/windows-vpn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Windows VPN guides
    {
      url: `${base}/fix/vpn-remote-work/windows-vpn/wont-connect`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/vpn-remote-work/windows-vpn/keeps-disconnecting`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/vpn-remote-work/windows-vpn/slow-speeds`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/vpn-remote-work/windows-vpn/blocking-internet-access`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Security & Privacy category hub
    {
      url: `${base}/fix/security-privacy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Security & Privacy guides
    {
      url: `${base}/fix/security-privacy/suspicious-login-alert`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-privacy/router-default-password-risk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-privacy/smart-camera-privacy-settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-privacy/wifi-network-hacked-signs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-privacy/two-factor-authentication-setup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Phone & Tablet category hub
    {
      url: `${base}/fix/phone-tablet`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // iPhone brand hub
    {
      url: `${base}/fix/phone-tablet/iphone`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // iPhone guides
    {
      url: `${base}/fix/phone-tablet/iphone/wont-connect-to-wifi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/phone-tablet/iphone/bluetooth-wont-pair`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/phone-tablet/iphone/battery-draining-fast`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/phone-tablet/iphone/storage-full-error`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Security Cameras category hub
    {
      url: `${base}/fix/security-cameras`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Ring Camera brand hub
    {
      url: `${base}/fix/security-cameras/ring-camera`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Setup Guides hub
    {
      url: `${base}/setup`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Setup Guides detail pages
    {
      url: `${base}/setup/eero-6-mesh-network`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/netgear-orbi-mesh-network`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/nest-thermostat-with-google-home`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/ring-doorbell-with-alexa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/philips-hue-starter-kit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/tp-link-deco-mesh`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/ecobee-thermostat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/setup/arlo-camera-system`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // My Devices (personal device monitoring)
    {
      url: `${base}/my-devices`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Productivity hub + SEO landing pages
    {
      url: `${base}/productivity`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${base}/productivity/excel-formula-help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/productivity/word-document-help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/productivity/new-device-setup-help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Ring Camera guides
    {
      url: `${base}/fix/security-cameras/ring-camera/offline`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-cameras/ring-camera/no-video-feed`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-cameras/ring-camera/motion-alerts-not-working`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/fix/security-cameras/ring-camera/night-vision-not-working`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...buildDocsRoutes(base),
  ];
}
