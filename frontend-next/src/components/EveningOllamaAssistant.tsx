'use client';


import { Brain } from "lucide-react";
import { useState } from "react";

export const EveningOllamaAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const askOllama = async (prompt: string) => {
    const enhancedPrompt = `
      Context: It's evening (23:00 UTC), end of learning day.
      User is reviewing Python basics from Week 1.
      Task: ${prompt}

      Provide a helpful, concise response suitable for evening review.
    `;

    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral:latest',
        prompt: enhancedPrompt,
        stream: false,
      }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="mb-3 flex items-center gap-2 text-white">
        <Brain className="h-5 w-5 text-purple-400" />
        Evening Review Assistant
      </h4>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about today's learning..."
        className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/30"
        rows={3}
      />
      <button
        onClick={() => askOllama(query)}
        className="mt-2 rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-white hover:bg-purple-500/30"
      >
        Ask Ollama
      </button>
      {response && (
        <div className="mt-3 rounded-lg bg-white/5 p-3 text-sm text-white/80">{response}</div>
      )}
    </div>
  );
};
