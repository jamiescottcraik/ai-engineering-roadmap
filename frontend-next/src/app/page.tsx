import Image from 'next/image';

import { BrowserContainer } from '@/components/BrowserContainer';
import { GlassCard } from '@/components/enhanced/GlassComponents';
import { LearningDashboard } from '@/components/LearningDashboard';

export default function Home() {
  return (
    <BrowserContainer title="brAInwav - AI Engineering Roadmap">
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="bg-grid-pattern absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"></div>
        <div className="container relative mx-auto px-6 py-12">
          <header className="mb-16 text-center">
            <div className="mb-8 flex justify-center">
              <GlassCard variant="island" className="h-24 w-24 p-4">
                <Image
                  src="/brAInwav-new.png"
                  alt="brAInwav Logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                  priority
                />
              </GlassCard>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-6xl font-extrabold text-transparent">
              brAInwav
            </h1>
            <p className="mx-auto max-w-4xl px-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              Your AI Engineering Learning Platform - Track your progress, master concepts, and
              build real-world AI skills with our interactive learning journey.
            </p>
            <div className="mx-auto mt-8 h-px max-w-2xl bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
          </header>

          <LearningDashboard />
        </div>
      </main>
    </BrowserContainer>
  );
}
