import Navbar from '@/components/Navbar';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: April 2026</p>
        </div>

        <div className="legal-content">
          <p>
            MyTech-Fix ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and AI-powered troubleshooting service.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
            <li><strong>Chat Data:</strong> All messages you send to our AI, including text descriptions of technical issues, cybersecurity concerns/events, and any uploaded images or screenshots.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our service, including chat history, session frequency, and features used.</li>
            <li><strong>Team &amp; Organization Data:</strong> If you are part of a business plan, we collect information about your team membership, role, and associated devices.</li>
            <li><strong>Billing Information:</strong> Payment details are processed securely through Stripe. We store limited billing metadata (such as subscription status and customer ID).</li>
            <li><strong>Technical Information:</strong> Browser type, device information, IP address, and cookies for authentication and analytics.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide AI-powered troubleshooting assistance</li>
            <li>Improve the accuracy and capabilities of our AI models</li>
            <li>Enable team collaboration features (shared history, reports, device inventory)</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service updates and respond to support requests</li>
            <li>Detect and prevent abuse or fraudulent activity</li>
            <li>Analyze usage trends to improve the product</li>
          </ul>

          <h2>3. AI Training and Data Usage</h2>
          <p>
            By default, conversations with MyTech-Fix may be used to improve our models. You can request that your chat history not be used for training by contacting us. Business customers can request data exclusion agreements.
          </p>

          <h2>4. Sharing of Information</h2>
          <p>We do not sell your personal data. We may share information with:</p>
          <ul>
            <li>Service providers (such as Stripe for payments and hosting providers)</li>
            <li>Team members when you are part of a business plan (shared chat history and reports are visible to authorized team members)</li>
            <li>Law enforcement or regulators when required by law</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your chat history and account data for as long as your account is active or as needed to provide services. You can delete individual sessions or request full account deletion at any time.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Export your chat history (available directly in the app for most users)</li>
            <li>Opt out of certain data uses</li>
            <li>Withdraw consent (where applicable)</li>
          </ul>

          <h2>7. Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our service is not directed to children under 13. We do not knowingly collect personal information from children.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            <a href="mailto:privacy@mytech-fix.com">privacy@mytech-fix.com</a>
          </p>

          <div className="legal-note">
            <strong className="text-foreground">Note:</strong> This Privacy Policy is provided for demonstration purposes. Before launching publicly, please have this document reviewed by a qualified attorney to ensure compliance with applicable laws (GDPR, CCPA, etc.).
          </div>
        </div>
      </div>
    </div>
  );
}
