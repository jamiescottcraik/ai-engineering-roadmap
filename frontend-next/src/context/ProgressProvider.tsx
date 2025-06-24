'use client';

import React from 'react';
import { ProgressProvider as BaseProgressProvider } from './ProgressContext';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return <BaseProgressProvider>{children}</BaseProgressProvider>;
}