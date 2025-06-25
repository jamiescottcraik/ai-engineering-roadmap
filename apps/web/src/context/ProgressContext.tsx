"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ProgressState {
  [key: string]: number;
}

interface ProgressContextProps {
  progress: ProgressState;
  setProgress: (id: string, value: number) => void;
}

const ProgressContext = createContext<ProgressContextProps | undefined>(undefined);

export const ProgressProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [progress, setProgressState] = useState<ProgressState>({});

  useEffect(() => {
    const stored = localStorage.getItem("progress");
    if (stored) {
      setProgressState(JSON.parse(stored));
    }
  }, []);

  const setProgress = (id: string, value: number) => {
    setProgressState((prev) => {
      const updated = { ...prev, [id]: value };
      localStorage.setItem("progress", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextProps => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
};
