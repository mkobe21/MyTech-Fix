'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface PromptPack {
  label: string;
  prompt: string;
  category: string;
}

const businessPrompts: PromptPack[] = [
  { label: "POS System Down", prompt: "My POS terminal is not connecting to the network or processing payments.", category: "POS" },
  { label: "VoIP Phone Issues", prompt: "Our office VoIP phones have no dial tone or poor call quality.", category: "VoIP" },
  { label: "Security Camera Offline", prompt: "One or more of our security cameras are showing as offline in the app.", category: "Security" },
  { label: "Suspected Phishing Email", prompt: "I received a suspicious email asking me to click a link or provide login info. What general steps should I take right now?", category: "Cybersecurity" },
  { label: "Possible Malware / Ransomware", prompt: "Some files are locked or behaving strangely and there might be a ransom message. What high-level general advice applies first?", category: "Cybersecurity" },
  { label: "Account Takeover Signs", prompt: "I think one of our business accounts may have been compromised. What general immediate actions should the team consider?", category: "Cybersecurity" },
  { label: "Printer Fleet Problems", prompt: "Multiple network printers in the office are not printing or showing errors.", category: "Printers" },
  { label: "Microsoft 365 Login", prompt: "Team members can't sign into Microsoft 365 / Outlook / Teams.", category: "M365" },
  { label: "New Employee Device Setup", prompt: "Help setting up a new laptop and phone for a new employee (WiFi, printers, email, MFA).", category: "Onboarding" },
  { label: "Google Workspace Issues", prompt: "Users are having trouble with Gmail, Drive, or Meet in our Google Workspace.", category: "Google" },
  { label: "Network for Multiple Sites", prompt: "We're having connectivity issues between our main office and remote locations.", category: "Multi-site" },
  // Additional industry-specific packs
  { label: "Retail Inventory Sync", prompt: "Our store inventory system is not syncing with the main server.", category: "Retail" },
  { label: "Healthcare Device Issue", prompt: "Medical equipment or patient management software is having connectivity problems.", category: "Healthcare" },
  { label: "Restaurant Order System", prompt: "Kitchen display or online ordering system is down.", category: "Hospitality" },
];

interface BusinessPromptPacksProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function BusinessPromptPacks({ onSelectPrompt }: BusinessPromptPacksProps) {
  return (
    <div>
      <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <span>Business Quick Starts</span>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">B2B</span>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-2"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {businessPrompts.map((pack, index) => (
          <motion.div key={index} variants={fadeInUp}>
          <Button
            variant="outline"
            size="sm"
            className="justify-start h-auto py-2 px-3 text-left text-xs hover:bg-white/5 border-white/10 w-full"
            onClick={() => onSelectPrompt(pack.prompt)}
          >
            <div>
              <div className="font-medium text-primary">{pack.label}</div>
              <div className="text-[10px] text-muted-foreground line-clamp-1">{pack.category}</div>
            </div>
          </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
