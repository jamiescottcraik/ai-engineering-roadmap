'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Local storage hook with type safety and error handling for the brAInwav platform
 * Provides persistent storage for roadmap progress and user preferences
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    validateValue?: (value: unknown) => value is T;
  } = {}
): [
  T,
  (value: T | ((prev: T) => T)) => void,
  {
    remove: () => void;
    refresh: () => void;
    isLoading: boolean;
    error: string | null;
  },
] {
  const { serialize = JSON.stringify, deserialize = JSON.parse, validateValue } = options;

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Initialize value from localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const item = window.localStorage.getItem(key);

      if (item === null) {
        // No stored value, use initial value
        setStoredValue(initialValue);
        setError(null);
      } else {
        const parsed = deserialize(item);

        // Validate the parsed value if validator provided
        if (validateValue && !validateValue(parsed)) {
          throw new Error(`Invalid stored value for key "${key}"`);
        }

        setStoredValue(parsed);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load from localStorage');
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
      isInitialized.current = true;
    }
  }, [key, initialValue, deserialize, validateValue]);

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Validate the new value if validator provided
        if (validateValue && !validateValue(valueToStore)) {
          throw new Error(`Invalid value for key "${key}"`);
        }

        setStoredValue(valueToStore);
        setError(null);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save to localStorage');
      }
    },
    [key, serialize, storedValue, validateValue]
  );

  // Remove item from localStorage
  const remove = useCallback(() => {
    try {
      setStoredValue(initialValue);
      setError(null);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from localStorage');
    }
  }, [key, initialValue]);

  // Refresh value from localStorage
  const refresh = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const item = window.localStorage.getItem(key);

      if (item === null) {
        setStoredValue(initialValue);
      } else {
        const parsed = deserialize(item);

        if (validateValue && !validateValue(parsed)) {
          throw new Error(`Invalid stored value for key "${key}"`);
        }

        setStoredValue(parsed);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh from localStorage');
      setStoredValue(initialValue);
    }
  }, [key, initialValue, deserialize, validateValue]);

  return [storedValue, setValue, { remove, refresh, isLoading, error }];
}

/**
 * Hook for storing roadmap completion state
 */
export function useRoadmapProgress() {
  const validateProgress = (value: unknown): value is Set<string> => {
    if (Array.isArray(value)) {
      return value.every((item) => typeof item === 'string');
    }
    return false;
  };

  const [completedTasks, setCompletedTasks, { remove, refresh, isLoading, error }] =
    useLocalStorage<Set<string>>('brainwav-roadmap-completed', new Set(), {
      serialize: (value) => JSON.stringify([...value]),
      deserialize: (value) => new Set(JSON.parse(value)),
      validateValue: validateProgress,
    });

  const markComplete = useCallback(
    (taskId: string) => {
      setCompletedTasks((prev) => new Set([...prev, taskId]));
    },
    [setCompletedTasks]
  );

  const markIncomplete = useCallback(
    (taskId: string) => {
      setCompletedTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    },
    [setCompletedTasks]
  );

  const toggleComplete = useCallback(
    (taskId: string) => {
      setCompletedTasks((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(taskId)) {
          newSet.delete(taskId);
        } else {
          newSet.add(taskId);
        }
        return newSet;
      });
    },
    [setCompletedTasks]
  );

  const isComplete = useCallback(
    (taskId: string) => {
      return completedTasks.has(taskId);
    },
    [completedTasks]
  );

  const getCompletionStats = useCallback(() => {
    return {
      totalCompleted: completedTasks.size,
      completedTasks: [...completedTasks],
    };
  }, [completedTasks]);

  return {
    completedTasks,
    markComplete,
    markIncomplete,
    toggleComplete,
    isComplete,
    getCompletionStats,
    remove,
    refresh,
    isLoading,
    error,
  };
}

/**
 * Hook for storing user preferences
 */
export function useUserPreferences() {
  interface UserPreferences {
    theme: 'dark' | 'light' | 'auto';
    language: string;
    notifications: boolean;
    compactMode: boolean;
    autoSave: boolean;
    weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  }

  const defaultPreferences: UserPreferences = {
    theme: 'dark',
    language: 'en',
    notifications: true,
    compactMode: false,
    autoSave: true,
    weekStartsOn: 1,
  };

  const validatePreferences = (value: unknown): value is UserPreferences => {
    if (typeof value !== 'object' || value === null) return false;

    const prefs = value as Record<string, unknown>;

    return (
      ['dark', 'light', 'auto'].includes(prefs.theme as string) &&
      typeof prefs.language === 'string' &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.compactMode === 'boolean' &&
      typeof prefs.autoSave === 'boolean' &&
      [0, 1].includes(prefs.weekStartsOn as number)
    );
  };

  const [preferences, setPreferences, { remove, refresh, isLoading, error }] =
    useLocalStorage<UserPreferences>('brainwav-user-preferences', defaultPreferences, {
      validateValue: validatePreferences,
    });

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [setPreferences]
  );

  return {
    preferences,
    updatePreference,
    setPreferences,
    remove,
    refresh,
    isLoading,
    error,
  };
}

/**
 * Hook for storing learning session data
 */
export function useLearningSession() {
  interface LearningSession {
    currentWeek: number;
    startDate: string;
    totalTimeSpent: number; // in minutes
    streakDays: number;
    lastActiveDate: string;
    dailyGoalMinutes: number;
    weeklyGoalHours: number;
  }

  const defaultSession: LearningSession = {
    currentWeek: 1,
    startDate: new Date().toISOString(),
    totalTimeSpent: 0,
    streakDays: 0,
    lastActiveDate: new Date().toISOString(),
    dailyGoalMinutes: 60,
    weeklyGoalHours: 10,
  };

  const validateSession = (value: unknown): value is LearningSession => {
    if (typeof value !== 'object' || value === null) return false;

    const session = value as Record<string, unknown>;

    return (
      typeof session.currentWeek === 'number' &&
      typeof session.startDate === 'string' &&
      typeof session.totalTimeSpent === 'number' &&
      typeof session.streakDays === 'number' &&
      typeof session.lastActiveDate === 'string' &&
      typeof session.dailyGoalMinutes === 'number' &&
      typeof session.weeklyGoalHours === 'number'
    );
  };

  const [session, setSession, { remove, refresh, isLoading, error }] =
    useLocalStorage<LearningSession>('brainwav-learning-session', defaultSession, {
      validateValue: validateSession,
    });

  const addStudyTime = useCallback(
    (minutes: number) => {
      setSession((prev) => ({
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + minutes,
        lastActiveDate: new Date().toISOString(),
      }));
    },
    [setSession]
  );

  const updateWeek = useCallback(
    (week: number) => {
      setSession((prev) => ({ ...prev, currentWeek: week }));
    },
    [setSession]
  );

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastActive = new Date(session.lastActiveDate).toDateString();

    if (today !== lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (yesterday.toDateString() === lastActive) {
        // Consecutive day
        setSession((prev) => ({
          ...prev,
          streakDays: prev.streakDays + 1,
          lastActiveDate: new Date().toISOString(),
        }));
      } else {
        // Streak broken
        setSession((prev) => ({
          ...prev,
          streakDays: 1,
          lastActiveDate: new Date().toISOString(),
        }));
      }
    }
  }, [session.lastActiveDate, setSession]);

  return {
    session,
    addStudyTime,
    updateWeek,
    updateStreak,
    setSession,
    remove,
    refresh,
    isLoading,
    error,
  };
}

/**
 * Custom hook for managing local storage with automatic sync across tabs
 */
export function useLocalStorageSync<T>(key: string, initialValue: T) {
  const [value, setValue, controls] = useLocalStorage(key, initialValue);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setValue(newValue);
        } catch {
          // Handle parse error silently
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, setValue]);

  return [value, setValue, controls] as const;
}
