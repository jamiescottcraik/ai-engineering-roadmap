import { Home, RefreshCw, Wifi } from 'lucide-react';

/**
 * Offline page for the brAInwav platform
 * Displayed when users are offline and requested content is not cached
 */
export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="from-charcoal-black via-charcoal-black/95 to-electric-blue/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-6">
      <div className="glass-card w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full border border-white/20 bg-white/10 p-3">
            <Wifi className="h-8 w-8 text-white/60" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-white">You&apos;re Offline</h1>

        <p className="mb-6 leading-relaxed text-white/70">
          It looks like you&apos;re not connected to the internet. Don&apos;t worry - you can still
          access your cached learning progress and continue studying offline.
        </p>

        <div className="mb-6 space-y-3">
          <div className="flex items-center text-sm text-white/60">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
            Cached roadmap data available
          </div>
          <div className="flex items-center text-sm text-white/60">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
            Progress tracking works offline
          </div>
          <div className="flex items-center text-sm text-white/60">
            <div className="mr-2 h-2 w-2 rounded-full bg-yellow-400"></div>
            Will sync when connection returns
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleRefresh}
            className="glass-button flex flex-1 items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="glass-button-secondary flex flex-1 items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">
            Your progress will automatically sync when you reconnect to the internet.
          </p>
        </div>
      </div>
    </div>
  );
}
