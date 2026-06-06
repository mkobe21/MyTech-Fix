'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help. Choose the best way to reach us below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Support */}
          <div className="card-premium rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-3">Technical Support</h2>
            <p className="text-muted-foreground mb-6">
              Having trouble with the chat, your account, or a specific issue?
            </p>
            <a 
              href="mailto:support@mytech-fix.com" 
              className="btn-premium inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-2xl transition-colors"
            >
              Email Support
            </a>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Average response time: 24 hours
            </p>
          </div>

          {/* Billing */}
          <div className="card-premium rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-3">Billing &amp; Subscriptions</h2>
            <p className="text-muted-foreground mb-6">
              Questions about your plan, invoices, or payment methods?
            </p>
            <a 
              href="mailto:billing@mytech-fix.com" 
              className="btn-premium inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-2xl transition-colors"
            >
              Contact Billing
            </a>
            <p className="text-sm text-muted-foreground text-center mt-4">
              For fastest service, use the <Link href="/account" className="text-primary hover:underline">Manage Billing</Link> button in your account.
            </p>
          </div>

          {/* Business / Sales */}
          <div className="card-premium rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-3">Business &amp; Team Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              Interested in Business or Business Pro plans for your organization?
            </p>
            <a 
              href="mailto:business@mytech-fix.com" 
              className="btn-premium inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-2xl transition-colors"
            >
              Talk to Sales
            </a>
            <p className="text-sm text-muted-foreground text-center mt-4">
              We can help with custom team sizes and enterprise needs.
            </p>
          </div>

          {/* General / Press */}
          <div className="card-premium rounded-3xl p-10">
            <h2 className="text-2xl font-semibold mb-3">General Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              Press, partnerships, or anything else?
            </p>
            <a 
              href="mailto:hello@mytech-fix.com" 
              className="btn-premium inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-2xl transition-colors"
            >
              Email Us
            </a>
            <p className="text-sm text-muted-foreground text-center mt-4">
              We aim to respond within 48 hours.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          You can also reach us through the in-app chat while signed in. 
          We monitor it during business hours.
        </div>
      </div>
    </div>
  );
}
