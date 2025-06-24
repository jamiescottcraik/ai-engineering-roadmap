'use client';

import React, { useState } from 'react';
import RoadmapDisplay from '../components/RoadmapDisplay';
import ProgressTracker from '../components/ProgressTracker';
import { BarChart3, Map, Settings, Users } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'roadmap' | 'progress'>('roadmap');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Engineering Roadmap</h1>
                  <p className="text-xs text-gray-600">Veteran-Led Learning Platform</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('roadmap')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'roadmap' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Roadmap</span>
              </button>
              <button
                onClick={() => setActiveView('progress')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'progress' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Progress</span>
              </button>
              <div className="flex items-center space-x-2 px-3 py-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Veteran Community</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {activeView === 'roadmap' && (
          <div className="h-[calc(100vh-4rem)]">
            <RoadmapDisplay />
          </div>
        )}
        
        {activeView === 'progress' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Analytics</h2>
              <p className="text-gray-600">
                Track your transformation journey from military service to AI engineering leadership
              </p>
            </div>
            <ProgressTracker />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>© 2024 AI Engineering Roadmap. Built for veterans, by veterans.</p>
              <p className="mt-1">Empowering military professionals in their AI career transition.</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Settings className="w-4 h-4" />
                <span>v2.0</span>
              </span>
              <span>•</span>
              <span>48-week curriculum</span>
              <span>•</span>
              <span>5 specialized phases</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
