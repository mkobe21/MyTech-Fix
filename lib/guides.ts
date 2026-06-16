// ADD NEW GUIDES HERE when building new batches
// Single source of truth for the /fix guides search bar (components/seo/GuidesSearch.tsx)

export interface Guide {
  title: string;
  category: string;
  href: string;
  keywords: string[];
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
];
