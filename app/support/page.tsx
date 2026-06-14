import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">Support Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get help using MyTech-Fix — whether you&apos;re troubleshooting at home, managing tech across your team, or seeking general guidance on cybersecurity events (advice only — always consult professionals for real incidents).
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Options */}
          <div className="card-premium rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-1.5">Email Support</h3>
                <a href="mailto:support@mytech-fix.com" className="text-primary hover:underline">
                  support@mytech-fix.com
                </a>
                <p className="text-sm text-muted-foreground mt-1">Typical response time: 24 hours</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1.5">Billing &amp; Account Questions</h3>
                <a href="mailto:billing@mytech-fix.com" className="text-primary hover:underline">
                  billing@mytech-fix.com
                </a>
              </div>

              <div>
                <h3 className="font-medium mb-1.5">Business / Team Inquiries</h3>
                <a href="mailto:business@mytech-fix.com" className="text-primary hover:underline">
                  business@mytech-fix.com
                </a>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-2 card-premium rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-1">
              <div className="faq-item">
                <h3>How do I get the best results from the AI chat?</h3>
                <p>
                  Be as specific as possible, include error messages, and upload screenshots when possible. 
                  Follow up if a step doesn&apos;t work — the chat remembers context.
                </p>
              </div>

              <div className="faq-item">
                <h3>Can I use MyTech-Fix for productivity tasks (not just fixing broken things)?</h3>
                <p>
                  Yes! The chat can help you create Excel formulas, automate emails, build presentations, write scripts, and more. 
                  See our <Link href="/how-it-works" className="text-primary hover:underline">How it Works</Link> page for examples.
                </p>
              </div>

              <div className="faq-item">
                <h3>How does team sharing work?</h3>
                <p>
                  On Business and Business Plus plans, all chat sessions can be shared across team members.
                  You can also tag devices and view team-wide reports and analytics.
                </p>
              </div>

              <div className="faq-item">
                <h3>Can I export my chat history?</h3>
                <p>
                  Yes. On the <Link href="/history" className="text-primary hover:underline">History page</Link>, use the &quot;Export CSV&quot; button to download all your sessions.
                </p>
              </div>

              <div className="faq-item">
                <h3>How do I manage my subscription or update my payment method?</h3>
                <p>
                  Go to <Link href="/account" className="text-primary hover:underline">Account Settings</Link> and click &quot;Manage Billing &amp; Subscription&quot;. 
                  This will take you to our secure Stripe Customer Portal.
                </p>
              </div>

              <div className="faq-item">
                <h3>Can MyTech-Fix help with cybersecurity events?</h3>
                <p>
                  Yes — the chat can provide general educational advice on recognizing threats (phishing, malware, etc.), high-level initial response ideas, and prevention basics. <strong>All cybersecurity guidance is advice only.</strong> For any real or suspected incident, immediately contact a qualified IT professional or incident response service.
                </p>
              </div>

              <div className="faq-item">
                <h3>Is my data used to train the AI?</h3>
                <p>
                  By default, conversations may be used to improve our models. You can request that your data be excluded from training by contacting us at privacy@mytech-fix.com.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-muted-foreground mb-5">Need more help?</p>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm">
            <Link href="/how-it-works" className="text-primary hover:underline">How MyTech-Fix Works</Link>
            <Link href="/pricing" className="text-primary hover:underline">Pricing &amp; Plans</Link>
            <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
