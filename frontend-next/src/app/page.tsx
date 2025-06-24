import { LearningDashboard } from "@/components/LearningDashboard";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
      <div className="relative container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-4 shadow-xl">
              <Image
                src="/brAInwav-new.png"
                alt="brAInwav Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            brAInwav
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Your AI Engineering Learning Platform - Track your progress, master concepts,
            and build real-world AI skills with our interactive learning journey.
          </p>
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent max-w-2xl mx-auto"></div>
        </header>

        <LearningDashboard />
      </div>
    </main>
  );
}
