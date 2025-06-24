import { LearningDashboard } from "@/components/LearningDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧠 brAInwav
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI Engineering Learning Platform - Track your progress, master concepts,
            and build real-world AI skills with our interactive learning journey.
          </p>
        </header>

        <LearningDashboard />
      </div>
    </main>
  );
}
