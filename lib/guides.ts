// ADD NEW GUIDES HERE when building new batches
// Single source of truth for the /fix guides search bar (components/seo/GuidesSearch.tsx)

export interface Guide {
  title: string;
  category: string;
  href: string;
  keywords: string[];
  type?: 'fix' | 'setup' | 'productivity';
}

export const guides: Guide[] = [
  // WiFi & Networking
  {
    title: 'Eero 6 Red Light Blinking',
    category: 'WiFi & Networking',
    href: '/fix/wifi/eero-6/red-light-blinking',
    keywords: ['eero', 'red light', 'wifi', 'router'],
  },
  {
    title: "Eero 6 Won't Connect to App",
    category: 'WiFi & Networking',
    href: '/fix/wifi/eero-6/wont-connect-to-app',
    keywords: ['eero', 'app', 'bluetooth', 'setup'],
  },
  {
    title: 'Eero 6 Keeps Disconnecting',
    category: 'WiFi & Networking',
    href: '/fix/wifi/eero-6/keeps-disconnecting',
    keywords: ['eero', 'disconnecting', 'dropping', 'wifi'],
  },
  {
    title: 'Eero 6 Slow Speeds',
    category: 'WiFi & Networking',
    href: '/fix/wifi/eero-6/slow-speeds',
    keywords: ['eero', 'slow', 'speed', 'wifi'],
  },
  {
    title: 'Netgear Orbi Red Light',
    category: 'WiFi & Networking',
    href: '/fix/wifi/netgear-orbi/red-light-blinking',
    keywords: ['orbi', 'netgear', 'red light', 'router'],
  },
  {
    title: "Netgear Orbi Won't Connect to App",
    category: 'WiFi & Networking',
    href: '/fix/wifi/netgear-orbi/wont-connect-to-app',
    keywords: ['orbi', 'netgear', 'app'],
  },
  {
    title: 'Netgear Orbi Keeps Disconnecting',
    category: 'WiFi & Networking',
    href: '/fix/wifi/netgear-orbi/keeps-disconnecting',
    keywords: ['orbi', 'netgear', 'disconnecting'],
  },
  {
    title: 'Netgear Orbi Slow Speeds',
    category: 'WiFi & Networking',
    href: '/fix/wifi/netgear-orbi/slow-speeds',
    keywords: ['orbi', 'netgear', 'slow', 'speed'],
  },

  // Printers
  {
    title: 'HP OfficeJet Offline',
    category: 'Printers',
    href: '/fix/printers/hp-officejet/offline',
    keywords: ['hp', 'officejet', 'offline', 'printer'],
  },
  {
    title: "HP OfficeJet Won't Print",
    category: 'Printers',
    href: '/fix/printers/hp-officejet/wont-print',
    keywords: ['hp', 'officejet', "won't print", 'printer'],
  },
  {
    title: "HP OfficeJet Won't Connect to WiFi",
    category: 'Printers',
    href: '/fix/printers/hp-officejet/wont-connect-to-wifi',
    keywords: ['hp', 'officejet', 'wifi', 'printer'],
  },
  {
    title: 'HP OfficeJet Print Queue Stuck',
    category: 'Printers',
    href: '/fix/printers/hp-officejet/print-queue-stuck',
    keywords: ['hp', 'officejet', 'print queue', 'stuck'],
  },
  {
    title: 'Canon PIXMA Offline',
    category: 'Printers',
    href: '/fix/printers/canon-pixma/offline',
    keywords: ['canon', 'pixma', 'offline', 'printer'],
  },
  {
    title: "Canon PIXMA Won't Print",
    category: 'Printers',
    href: '/fix/printers/canon-pixma/wont-print',
    keywords: ['canon', 'pixma', "won't print"],
  },
  {
    title: "Canon PIXMA Won't Connect to WiFi",
    category: 'Printers',
    href: '/fix/printers/canon-pixma/wont-connect-to-wifi',
    keywords: ['canon', 'pixma', 'wifi'],
  },
  {
    title: 'Canon PIXMA Print Queue Stuck',
    category: 'Printers',
    href: '/fix/printers/canon-pixma/print-queue-stuck',
    keywords: ['canon', 'pixma', 'print queue', 'stuck'],
  },

  // Smart Home
  {
    title: 'Nest Thermostat Offline',
    category: 'Smart Home',
    href: '/fix/smart-home/nest-thermostat/offline',
    keywords: ['nest', 'thermostat', 'offline'],
  },
  {
    title: "Nest Thermostat Won't Connect to WiFi",
    category: 'Smart Home',
    href: '/fix/smart-home/nest-thermostat/wont-connect-to-wifi',
    keywords: ['nest', 'thermostat', 'wifi'],
  },
  {
    title: 'Nest Thermostat Not Responding in App',
    category: 'Smart Home',
    href: '/fix/smart-home/nest-thermostat/not-responding-in-app',
    keywords: ['nest', 'thermostat', 'app', 'not responding'],
  },
  {
    title: 'Nest Thermostat Firmware Update Stuck',
    category: 'Smart Home',
    href: '/fix/smart-home/nest-thermostat/firmware-update-stuck',
    keywords: ['nest', 'thermostat', 'firmware', 'update'],
  },
  {
    title: 'Ring Doorbell Offline',
    category: 'Smart Home',
    href: '/fix/smart-home/ring-doorbell/offline',
    keywords: ['ring', 'doorbell', 'offline'],
  },
  {
    title: "Ring Doorbell Won't Connect to WiFi",
    category: 'Smart Home',
    href: '/fix/smart-home/ring-doorbell/wont-connect-to-wifi',
    keywords: ['ring', 'doorbell', 'wifi'],
  },
  {
    title: 'Ring Doorbell Motion Detection Not Working',
    category: 'Smart Home',
    href: '/fix/smart-home/ring-doorbell/motion-detection-not-working',
    keywords: ['ring', 'doorbell', 'motion', 'detection'],
  },
  {
    title: 'Ring Doorbell Battery Draining Fast',
    category: 'Smart Home',
    href: '/fix/smart-home/ring-doorbell/battery-draining-fast',
    keywords: ['ring', 'doorbell', 'battery'],
  },
  {
    title: 'Nest Thermostat Not Showing in Google Home',
    category: 'Smart Home',
    href: '/fix/smart-home/nest-thermostat-not-showing-in-google-home',
    keywords: ['nest', 'google home', 'not showing', 'ecosystem'],
  },
  {
    title: 'Ring Doorbell Not Working with Alexa',
    category: 'Smart Home',
    href: '/fix/smart-home/ring-doorbell-not-working-with-alexa',
    keywords: ['ring', 'alexa', 'not working', 'ecosystem'],
  },
  {
    title: 'Philips Hue Not Syncing with HomeKit',
    category: 'Smart Home',
    href: '/fix/smart-home/philips-hue-not-syncing-with-homekit',
    keywords: ['philips', 'hue', 'homekit', 'syncing'],
  },
  {
    title: 'Ecobee Not Working with Google Home',
    category: 'Smart Home',
    href: '/fix/smart-home/ecobee-not-working-with-google-home',
    keywords: ['ecobee', 'google home'],
  },
  {
    title: 'Wyze Cam Not Working with Google Home',
    category: 'Smart Home',
    href: '/fix/smart-home/wyze-cam-not-working-with-google-home',
    keywords: ['wyze', 'cam', 'google home'],
  },

  // Computers
  {
    title: 'Windows WiFi Keeps Disconnecting',
    category: 'Computers',
    href: '/fix/computers/windows/wifi-keeps-disconnecting',
    keywords: ['windows', 'wifi', 'disconnecting'],
  },
  {
    title: 'Windows Running Slow',
    category: 'Computers',
    href: '/fix/computers/windows/running-slow',
    keywords: ['windows', 'slow', 'performance'],
  },
  {
    title: 'Windows Blue Screen Error',
    category: 'Computers',
    href: '/fix/computers/windows/blue-screen-error',
    keywords: ['windows', 'blue screen', 'bsod', 'error'],
  },
  {
    title: "Windows Won't Install Updates",
    category: 'Computers',
    href: '/fix/computers/windows/wont-install-updates',
    keywords: ['windows', 'update', "won't install"],
  },

  // VPN & Remote Work
  {
    title: "Windows VPN Won't Connect",
    category: 'VPN & Remote Work',
    href: '/fix/vpn-remote-work/windows-vpn/wont-connect',
    keywords: ['vpn', 'windows', "won't connect"],
  },
  {
    title: 'Windows VPN Keeps Disconnecting',
    category: 'VPN & Remote Work',
    href: '/fix/vpn-remote-work/windows-vpn/keeps-disconnecting',
    keywords: ['vpn', 'windows', 'disconnecting'],
  },
  {
    title: 'Windows VPN Slow Speeds',
    category: 'VPN & Remote Work',
    href: '/fix/vpn-remote-work/windows-vpn/slow-speeds',
    keywords: ['vpn', 'windows', 'slow'],
  },
  {
    title: 'VPN Blocking Internet Access',
    category: 'VPN & Remote Work',
    href: '/fix/vpn-remote-work/windows-vpn/blocking-internet-access',
    keywords: ['vpn', 'blocking', 'internet', 'no access'],
  },

  // Security & Privacy
  {
    title: 'Suspicious Login Alert — What to Do',
    category: 'Security & Privacy',
    href: '/fix/security-privacy/suspicious-login-alert',
    keywords: ['suspicious', 'login', 'alert', 'security'],
  },
  {
    title: 'Router Default Password Risk',
    category: 'Security & Privacy',
    href: '/fix/security-privacy/router-default-password-risk',
    keywords: ['router', 'password', 'default', 'security'],
  },
  {
    title: 'Smart Camera Privacy Settings Checklist',
    category: 'Security & Privacy',
    href: '/fix/security-privacy/smart-camera-privacy-settings',
    keywords: ['camera', 'privacy', 'settings', 'checklist'],
  },
  {
    title: 'Signs Your WiFi Has Been Hacked',
    category: 'Security & Privacy',
    href: '/fix/security-privacy/wifi-network-hacked-signs',
    keywords: ['wifi', 'hacked', 'security', 'signs'],
  },
  {
    title: 'How to Set Up Two-Factor Authentication',
    category: 'Security & Privacy',
    href: '/fix/security-privacy/two-factor-authentication-setup',
    keywords: ['two-factor', '2fa', 'authentication', 'security'],
  },

  // Phone & Tablet
  {
    title: "iPhone Won't Connect to WiFi",
    category: 'Phone & Tablet',
    href: '/fix/phone-tablet/iphone/wont-connect-to-wifi',
    keywords: ['iphone', 'wifi', "won't connect"],
  },
  {
    title: "iPhone Bluetooth Won't Pair",
    category: 'Phone & Tablet',
    href: '/fix/phone-tablet/iphone/bluetooth-wont-pair',
    keywords: ['iphone', 'bluetooth', 'pair', 'pairing'],
  },
  {
    title: 'iPhone Battery Draining Fast',
    category: 'Phone & Tablet',
    href: '/fix/phone-tablet/iphone/battery-draining-fast',
    keywords: ['iphone', 'battery', 'draining'],
  },
  {
    title: 'iPhone Storage Full',
    category: 'Phone & Tablet',
    href: '/fix/phone-tablet/iphone/storage-full-error',
    keywords: ['iphone', 'storage', 'full', 'space'],
  },

  // Setup Guides — WiFi & Networking
  {
    title: 'How to Set Up an Eero 6 Mesh Network',
    category: 'Setup Guides',
    href: '/setup/eero-6-mesh-network',
    keywords: ['eero', 'setup', 'mesh', 'install', 'wifi'],
    type: 'setup',
  },
  {
    title: 'How to Set Up a Netgear Orbi Mesh Network',
    category: 'Setup Guides',
    href: '/setup/netgear-orbi-mesh-network',
    keywords: ['orbi', 'netgear', 'setup', 'mesh', 'install', 'wifi'],
    type: 'setup',
  },
  {
    title: 'How to Set Up a Nest Thermostat with Google Home',
    category: 'Setup Guides',
    href: '/setup/nest-thermostat-with-google-home',
    keywords: ['nest', 'thermostat', 'setup', 'install', 'google home'],
    type: 'setup',
  },
  {
    title: 'How to Set Up a Ring Doorbell with Alexa',
    category: 'Setup Guides',
    href: '/setup/ring-doorbell-with-alexa',
    keywords: ['ring', 'doorbell', 'setup', 'install', 'alexa'],
    type: 'setup',
  },

  // Setup Guides — Smart Home
  {
    title: 'Philips Hue Starter Kit Setup',
    category: 'Smart Home',
    href: '/setup/philips-hue-starter-kit',
    keywords: ['philips', 'hue', 'setup', 'install', 'starter kit', 'bridge', 'bulb'],
    type: 'setup',
  },
  {
    title: 'Ecobee Thermostat Setup',
    category: 'Smart Home',
    href: '/setup/ecobee-thermostat',
    keywords: ['ecobee', 'thermostat', 'setup', 'install', 'hvac', 'smart thermostat'],
    type: 'setup',
  },

  // Setup Guides — WiFi & Networking (batch 2)
  {
    title: 'TP-Link Deco Mesh Setup',
    category: 'WiFi & Networking',
    href: '/setup/tp-link-deco-mesh',
    keywords: ['tp-link', 'deco', 'setup', 'mesh', 'install', 'wifi'],
    type: 'setup',
  },

  // Setup Guides — Security Cameras
  {
    title: 'Arlo Camera System Setup',
    category: 'Security Cameras',
    href: '/setup/arlo-camera-system',
    keywords: ['arlo', 'camera', 'setup', 'install', 'security camera', 'base station'],
    type: 'setup',
  },

  // Productivity tools
  {
    title: 'Excel Formula Help',
    category: 'Productivity',
    href: '/productivity/excel-formula-help',
    keywords: ['excel', 'formula', 'spreadsheet', 'vlookup', 'pivot table', 'sumif'],
    type: 'productivity',
  },
  {
    title: 'Word Document Help',
    category: 'Productivity',
    href: '/productivity/word-document-help',
    keywords: ['word', 'document', 'formatting', 'styles', 'mail merge', 'table of contents'],
    type: 'productivity',
  },
  {
    title: 'New Device Setup Help',
    category: 'Productivity',
    href: '/productivity/new-device-setup-help',
    keywords: ['device', 'setup', 'new phone', 'laptop', 'printer', 'iphone', 'android', 'windows'],
    type: 'productivity',
  },

  // Security Cameras
  {
    title: 'Ring Camera Offline',
    category: 'Security Cameras',
    href: '/fix/security-cameras/ring-camera/offline',
    keywords: ['ring', 'camera', 'offline', 'security'],
  },
  {
    title: 'Ring Camera No Video Feed',
    category: 'Security Cameras',
    href: '/fix/security-cameras/ring-camera/no-video-feed',
    keywords: ['ring', 'camera', 'no video', 'feed'],
  },
  {
    title: 'Ring Camera Motion Alerts Not Working',
    category: 'Security Cameras',
    href: '/fix/security-cameras/ring-camera/motion-alerts-not-working',
    keywords: ['ring', 'camera', 'motion', 'alerts'],
  },
  {
    title: 'Ring Camera Night Vision Not Working',
    category: 'Security Cameras',
    href: '/fix/security-cameras/ring-camera/night-vision-not-working',
    keywords: ['ring', 'camera', 'night vision'],
  },
];
