import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl">
              🔧
            </div>
            <span className="font-semibold text-xl">MyTech-Fix</span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <Link href="/fix" className="hover:text-primary transition-colors">Troubleshooting Guides</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>

          <div className="text-sm text-muted-foreground/80">
            © {new Date().getFullYear()} MyTech-Fix. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}