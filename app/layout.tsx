import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeSync } from '@/components/ThemeSync';
import ConditionalFooter from '@/components/ConditionalFooter';
import ConditionalAppShell from '@/components/ConditionalAppShell';
import { MotionConfig } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'MyTech-Fix - AI Tech Support & Troubleshooting',
  description: 'Instant AI-powered tech support and troubleshooting for home users and small business teams. Fix problems faster and get more done.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${sora.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ThemeSync />
            <MotionConfig reducedMotion="user">
              <ConditionalAppShell>
                {children}
              </ConditionalAppShell>
              <ConditionalFooter />
            </MotionConfig>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}