'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for managing online/offline status and offline functionality
 * Provides real-time network status and offline capabilities for the brAInwav platform
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initialize with current status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Trigger sync when coming back online
        window.dispatchEvent(new CustomEvent('app:online'));
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      window.dispatchEvent(new CustomEvent('app:offline'));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      const online = response.ok;
      setIsOnline(online);
      return online;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, []);

  return {
    isOnline,
    wasOffline,
    checkConnection,
  };
}

/**
 * Hook for managing offline data queue
 */
export function useOfflineQueue() {
  const [queue, setQueue] = useState<
    Array<{
      id: string;
      action: string;
      data: unknown;
      timestamp: number;
    }>
  >([]);

  const addToQueue = useCallback((action: string, data: unknown) => {
    const item = {
      id: `${Date.now()}-${Math.random()}`,
      action,
      data,
      timestamp: Date.now(),
    };

    setQueue((prev) => [...prev, item]);

    // Store in localStorage for persistence
    try {
      const stored = localStorage.getItem('brainwav-offline-queue') || '[]';
      const storedQueue = JSON.parse(stored);
      storedQueue.push(item);
      localStorage.setItem('brainwav-offline-queue', JSON.stringify(storedQueue));
    } catch {
      // Handle localStorage errors silently
    }
  }, []);

  const processQueue = useCallback(async () => {
    if (queue.length === 0) return;

    const processed: string[] = [];

    for (const item of queue) {
      try {
        // Process each queued action
        await processOfflineAction(item.action, item.data);
        processed.push(item.id);
      } catch {
        // Keep failed items in queue for retry
        break;
      }
    }

    // Remove processed items
    setQueue((prev) => prev.filter((item) => !processed.includes(item.id)));

    // Update localStorage
    try {
      const remaining = queue.filter((item) => !processed.includes(item.id));
      localStorage.setItem('brainwav-offline-queue', JSON.stringify(remaining));
    } catch {
      // Handle localStorage errors silently
    }
  }, [queue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem('brainwav-offline-queue');
  }, []);

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('brainwav-offline-queue');
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch {
      // Handle localStorage errors silently
    }
  }, []);

  // Process queue when coming back online
  useEffect(() => {
    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener('app:online', handleOnline);
    return () => window.removeEventListener('app:online', handleOnline);
  }, [processQueue]);

  return {
    queue,
    addToQueue,
    processQueue,
    clearQueue,
  };
}

/**
 * Process offline actions when connection is restored
 */
async function processOfflineAction(action: string, data: unknown): Promise<void> {
  switch (action) {
    case 'COMPLETE_TASK':
      // Sync task completion
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      break;

    case 'UPDATE_PROGRESS':
      // Sync progress updates
      await fetch('/api/progress/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      break;

    case 'SAVE_NOTE':
      // Sync saved notes
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      break;

    default:
      throw new Error(`Unknown offline action: ${action}`);
  }
}

/**
 * Hook for offline-capable data management
 */
export function useOfflineData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  syncFn?: (data: T) => Promise<void>,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const { isOnline } = useOfflineStatus();
  const { addToQueue } = useOfflineQueue();

  // Load data from cache or fetch from network
  const loadData = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to load from cache first
        if (!forceRefresh) {
          const cached = localStorage.getItem(`cache-${key}`);
          if (cached) {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            setData(cachedData);
            setLastSynced(new Date(timestamp));

            // If offline, use cached data
            if (!isOnline) {
              setIsLoading(false);
              return;
            }
          }
        }

        // If online, fetch fresh data
        if (isOnline) {
          const freshData = await fetchFn();
          setData(freshData);
          setLastSynced(new Date());

          // Cache the fresh data
          localStorage.setItem(
            `cache-${key}`,
            JSON.stringify({
              data: freshData,
              timestamp: new Date().toISOString(),
            }),
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');

        // Try to use cached data as fallback
        try {
          const cached = localStorage.getItem(`cache-${key}`);
          if (cached) {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            setData(cachedData);
            setLastSynced(new Date(timestamp));
          }
        } catch {
          // No cached data available
        }
      } finally {
        setIsLoading(false);
      }
    },
    [key, fetchFn, isOnline],
  );

  // Update data (with offline queueing)
  const updateData = useCallback(
    (newData: T) => {
      setData(newData);

      // Cache the updated data
      localStorage.setItem(
        `cache-${key}`,
        JSON.stringify({
          data: newData,
          timestamp: new Date().toISOString(),
        }),
      );

      // If online, sync immediately
      if (isOnline && syncFn) {
        syncFn(newData).catch(() => {
          // If sync fails, add to offline queue
          addToQueue('SYNC_DATA', { key, data: newData });
        });
      } else if (!isOnline && syncFn) {
        // If offline, add to queue for later sync
        addToQueue('SYNC_DATA', { key, data: newData });
      }
    },
    [key, isOnline, syncFn, addToQueue],
  );

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh when coming back online
  useEffect(() => {
    const handleOnline = () => {
      loadData(true);
    };

    window.addEventListener('app:online', handleOnline);
    return () => window.removeEventListener('app:online', handleOnline);
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    lastSynced,
    isOffline: !isOnline,
    refresh: () => loadData(true),
    updateData,
  };
}
