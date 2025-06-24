"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Terminal } from "lucide-react";

const checkOllamaSync = async () => {
  // placeholder check implementation
  return { status: "synced", activeModel: "mistral:latest", progress: {} };
};

export const OllamaStatusCard = () => {
  const [syncStatus, setSyncStatus] = useState<"checking" | "synced" | "error">(
    "checking",
  );
  const [activeModel, setActiveModel] = useState("");
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    checkOllamaSync()
      .then((res) => {
        setSyncStatus(res.status as "synced");
        setActiveModel(res.activeModel);
        setProgress(res.progress);
      })
      .catch(() => setSyncStatus("error"));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          Ollama AI Assistant
        </h3>
        {syncStatus === "synced" ? (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Synced
          </span>
        ) : syncStatus === "error" ? (
          <span className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            Error
          </span>
        ) : (
          <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
        )}
      </div>

      {activeModel && (
        <div className="mb-4">
          <p className="text-white/60 text-sm mb-1">Active Model</p>
          <p className="text-white font-mono">{activeModel}</p>
        </div>
      )}

      {Object.entries(progress).map(([model, percent]) => (
        <div key={model} className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/60">{model}</span>
            <span className="text-white/80">{percent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-purple-500"
            />
          </div>
        </div>
      ))}

      <button
        onClick={() => window.open("http://localhost:11434", "_blank")}
        className="mt-4 w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-white text-sm transition-all"
      >
        Open Ollama Dashboard
      </button>
    </motion.div>
  );
};
