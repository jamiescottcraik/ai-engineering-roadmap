'use client';


import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const checkOllamaSync = async () => {
  // placeholder check implementation
  return { status: 'synced', activeModel: 'mistral:latest', progress: {} };
};

export const OllamaStatusCard = () => {
  const [syncStatus, setSyncStatus] = useState<'checking' | 'synced' | 'error'>('checking');
  const [activeModel, setActiveModel] = useState('');
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    checkOllamaSync()
      .then((res) => {
        setSyncStatus(res.status as 'synced');
        setActiveModel(res.activeModel);
        setProgress(res.progress);
      })
      .catch(() => setSyncStatus('error'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-white/5 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Terminal className="h-5 w-5 text-purple-400" />
          Ollama AI Assistant
        </h3>
        {syncStatus === 'synced' ? (
          <span className="flex items-center gap-1 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            Synced
          </span>
        ) : syncStatus === 'error' ? (
          <span className="flex items-center gap-1 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            Error
          </span>
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-white/60" />
        )}
      </div>

      {activeModel && (
        <div className="mb-4">
          <p className="mb-1 text-sm text-white/60">Active Model</p>
          <p className="font-mono text-white">{activeModel}</p>
        </div>
      )}

      {Object.entries(progress).map(([model, percent]) => (
        <div key={model} className="mb-2">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-white/60">{model}</span>
            <span className="text-white/80">{percent}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-purple-500"
            />
          </div>
        </div>
      ))}

      <button
        onClick={() => window.open('http://localhost:11434', '_blank')}
        className="mt-4 w-full rounded-lg border border-purple-500/30 bg-purple-500/20 px-4 py-2 text-sm text-white transition-all hover:bg-purple-500/30"
      >
        Open Ollama Dashboard
      </button>
    </motion.div>
  );
};
