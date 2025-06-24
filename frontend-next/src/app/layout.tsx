import type { Metadata } from "next";
import "./globals.css";
import { VeteranRoadmapProvider } from "../context/VeteranRoadmapProvider";

export const metadata: Metadata = {
  title: "AI Engineering Roadmap - Interactive Learning Platform",
  description: "Transform your career with the veteran-led AI engineering roadmap. Interactive, 5-phase learning platform designed for systematic skill development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-gray-50">
        <VeteranRoadmapProvider>{children}</VeteranRoadmapProvider>
      </body>
    </html>
  );
}
