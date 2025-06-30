"use client";

import { useState } from "react";
import { Brain } from "lucide-react";

export const EveningOllamaAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const askOllama = async (prompt: string) => {
    const enhancedPrompt = `
      Context: It's evening (23:00 UTC), end of learning day.
      User is reviewing Python basics from Week 1.
      Task: ${prompt}

      Provide a helpful, concise response suitable for evening review.
    `;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral:latest",
        prompt: enhancedPrompt,
        stream: false,
      }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <h4 className="text-white mb-3 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        Evening Review Assistant
      </h4>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about today's learning..."
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30"
        rows={3}
      />
      <button
        onClick={() => askOllama(query)}
        className="mt-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white text-sm"
      >
        Ask Ollama
      </button>
      {response && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg text-white/80 text-sm">
          {response}
        </div>
      )}
    </div>
  );
};
