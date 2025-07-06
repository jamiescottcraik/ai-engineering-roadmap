import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { CognitiveThemeProvider } from '@/lib/theme';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Engineering Roadmap - Personal Learning Edition',
  description:
    'A cognitive-adaptive learning platform for AI engineering mastery with spaced repetition, interactive roadmaps, and psychology-informed design.',
  keywords: ['AI', 'engineering', 'learning', 'roadmap', 'spaced repetition', 'cognitive design'],
  authors: [{ name: 'Jamie Scott Craik', url: 'https://github.com/jamiescottcraik' }],
  creator: 'Jamie Scott Craik',
  publisher: 'brAInwav Platform',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Engineering Roadmap - Personal Learning Edition',
    description:
      'Transform your AI learning journey with psychology-informed design and adaptive learning patterns.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Engineering Roadmap',
    description: 'Cognitive-adaptive learning platform for AI mastery',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {/* iOS-style dynamic blur background for glass morphism */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.03)_0%,transparent_50%)] blur-3xl"></div>
        </div>
        <CognitiveThemeProvider>{children}</CognitiveThemeProvider>
      </body>
    </html>
  );
}
