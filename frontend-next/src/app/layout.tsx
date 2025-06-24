import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { CognitiveThemeProvider } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Engineering Roadmap - Personal Learning Edition",
  description: "A cognitive-adaptive learning platform for AI engineering mastery with spaced repetition, interactive roadmaps, and psychology-informed design.",
  keywords: ["AI", "engineering", "learning", "roadmap", "spaced repetition", "cognitive design"],
  authors: [{ name: "Jamie Scott Craig", url: "https://github.com/jamiescottcraik" }],
  creator: "Jamie Scott Craig",
  publisher: "brAInwav Platform",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "AI Engineering Roadmap - Personal Learning Edition",
    description: "Transform your AI learning journey with psychology-informed design and adaptive learning patterns.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Engineering Roadmap",
    description: "Cognitive-adaptive learning platform for AI mastery",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <CognitiveThemeProvider defaultTheme="system" defaultAccessibility="default">
          {children}
        </CognitiveThemeProvider>
      </body>
    </html>
  );
}
