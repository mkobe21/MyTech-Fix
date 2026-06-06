import Navbar from '@/components/Navbar';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">Last updated: April 2026</p>
        </div>

        <div className="legal-content">
          <p>
            These Terms of Service ("Terms") govern your access to and use of MyTech-Fix (the "Service"), operated by MyTech-Fix. By using the Service, you agree to be bound by these Terms.
          </p>

          <h2>1. Description of Service</h2>
          <p>
            MyTech-Fix provides an AI-powered platform that offers step-by-step technical support and troubleshooting assistance for hardware and software issues, including but not limited to networking, computers, smart home devices, printers, and productivity tools.
          </p>

          <h2>2. Eligibility and Accounts</h2>
          <p>
            You must be at least 13 years old to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p>
            Business accounts may include multiple users ("Team Members"). The account owner is responsible for the actions of all Team Members added to the account.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any laws</li>
            <li>Attempt to reverse engineer, decompile, or extract the underlying AI models</li>
            <li>Upload malicious content, viruses, or content that infringes on others&apos; rights</li>
            <li>Share access to your account with unauthorized parties (except through official team features)</li>
            <li>Use the Service to generate content for spam or deceptive practices</li>
          </ul>

          <h2>4. AI-Generated Content and Limitations</h2>
          <p>
            MyTech-Fix uses artificial intelligence to provide suggestions and instructions, including general educational guidance on cybersecurity events. While we strive for accuracy, AI responses may contain errors, outdated information, or be inappropriate for your specific situation.
          </p>
          <p>
            <strong>You acknowledge that:</strong>
          </p>
          <ul>
            <li>AI-generated advice (including on cybersecurity topics) is not a substitute for professional technical support or incident response services</li>
            <li>For any cybersecurity event or suspected incident, you must contact qualified IT professionals or specialists — the Service provides advice only</li>
            <li>You are solely responsible for following any instructions provided by the Service</li>
            <li>MyTech-Fix is not liable for any damage to devices, data loss, breaches, or other consequences resulting from use of the Service</li>
          </ul>

          <h2>5. Subscriptions and Billing</h2>
          <p>
            Paid plans are billed in advance on a recurring basis. You may cancel your subscription at any time through your Account settings or the Stripe customer portal. Upon cancellation, you will retain access until the end of your current billing period.
          </p>
          <p>
            We reserve the right to change pricing with reasonable notice. Price changes will not affect the current billing period.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and all content, features, and functionality (including AI models and software) are owned by MyTech-Fix or its licensors. You may not copy, modify, or create derivative works without our permission.
          </p>
          <p>
            You retain ownership of the content you submit (chat messages and images). By using the Service, you grant us a license to use this content to provide and improve the Service.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time for violation of these Terms, fraudulent activity, or at our sole discretion. You may delete your account at any time through the Account settings page.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, MyTech-Fix shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free, or that AI responses will be accurate or suitable for your needs.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will provide notice of material changes by updating the "Last updated" date and, where appropriate, notifying users via email or in-app notification. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MyTech-Fix is registered, without regard to its conflict of law provisions.
          </p>

          <h2>12. Contact</h2>
          <p>
            For questions about these Terms, please contact us at:
          </p>
          <p>
            <a href="mailto:legal@mytech-fix.com">legal@mytech-fix.com</a>
          </p>

          <div className="legal-note">
            <strong className="text-foreground">Important:</strong> These Terms of Service are provided as a template for development purposes. Before making the service publicly available, please consult with a qualified attorney to customize these terms for your specific business, jurisdiction, and risk profile.
          </div>
        </div>
      </div>
    </div>
  );
}
