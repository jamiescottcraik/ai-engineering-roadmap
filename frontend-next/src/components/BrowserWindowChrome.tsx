'use client';

import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Home,
  Lock,
  Maximize2,
  Minimize2,
  Minus,
  RotateCcw,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

/**
 * Browser Window Chrome - OpenUI-Style Experience
 *
 * Provides a browser-like interface with macOS-style window controls,
 * navigation bar, and responsive preview features.
 *
 * Implements WCAG 2.1 AA accessibility standards and follows
 * the constitutional requirements for UI components.
 */

export interface BrowserWindowChromeProps {
  /** Current page title shown in the title bar */
  title: string;
  /** Current URL shown in the address bar */
  currentUrl: string;
  /** Whether the window is currently maximized */
  isMaximized?: boolean;
  /** Available device sizes for responsive preview */
  deviceSizes?: DeviceSize[];
  /** Current active device size */
  activeDevice?: string;

  // Event handlers
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onRefresh: () => void;
  onNavigate: (url: string) => void;
  onDeviceChange?: (device: string) => void;
  onHome?: () => void;
  onBack?: () => void;
  onForward?: () => void;
}

export interface DeviceSize {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const DEFAULT_DEVICE_SIZES: DeviceSize[] = [
  { id: 'desktop', name: 'Desktop', width: 1920, height: 1080, icon: '🖥️' },
  { id: 'tablet', name: 'Tablet', width: 768, height: 1024, icon: '📱' },
  { id: 'mobile', name: 'Mobile', width: 375, height: 667, icon: '📱' },
];

export function BrowserWindowChrome({
  title,
  currentUrl,
  isMaximized = false,
  deviceSizes = DEFAULT_DEVICE_SIZES,
  activeDevice = 'desktop',
  onMinimize,
  onMaximize,
  onClose,
  onRefresh,
  onNavigate,
  onDeviceChange,
  onHome,
  onBack,
  onForward,
}: BrowserWindowChromeProps) {
  const [urlValue, setUrlValue] = useState(currentUrl);
  const [isSecure] = useState(currentUrl.startsWith('https://'));

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(urlValue);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(e.target.value);
  };

  return (
    <div
      className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
      role="banner"
      aria-label="Browser window controls"
    >
      {/* Title Bar with macOS Controls */}
      <div className="flex items-center justify-between bg-white/5 px-4 py-2">
        {/* Left: Window Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Close window"
            title="Close"
          >
            <X className="h-2 w-2 text-white/80 opacity-0 transition-opacity hover:opacity-100" />
          </button>
          <button
            onClick={onMinimize}
            className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            aria-label="Minimize window"
            title="Minimize"
          >
            <Minus className="h-2 w-2 text-white/80 opacity-0 transition-opacity hover:opacity-100" />
          </button>
          <button
            onClick={onMaximize}
            className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="h-2 w-2 text-white/80 opacity-0 transition-opacity hover:opacity-100" />
            ) : (
              <Maximize2 className="h-2 w-2 text-white/80 opacity-0 transition-opacity hover:opacity-100" />
            )}
          </button>
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center">
          <h1 className="mx-auto max-w-md truncate text-sm font-medium text-white/80">{title}</h1>
        </div>

        {/* Right: Device Selector */}
        <div className="flex items-center gap-2">
          {deviceSizes.map((device) => (
            <button
              key={device.id}
              onClick={() => onDeviceChange?.(device.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeDevice === device.id
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={`Switch to ${device.name} view`}
              title={`${device.name} (${device.width}×${device.height})`}
            >
              <span className="mr-1">{device.icon}</span>
              {device.name}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-3 bg-white/5 px-4 py-3">
        {/* Navigation Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onBack}
            className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onForward}
            className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go forward"
            title="Forward"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onRefresh}
            className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Refresh page"
            title="Refresh"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="relative flex-1">
          <div className="flex items-center rounded-lg bg-white/10 px-3 py-2 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-blue-500">
            {/* Security Indicator */}
            <div className="mr-3 flex items-center gap-2">
              <Lock className={`h-4 w-4 ${isSecure ? 'text-green-400' : 'text-yellow-400'}`} />
              <span className="text-xs text-white/60">{isSecure ? 'Secure' : 'Not secure'}</span>
            </div>

            {/* URL Input */}
            <input
              type="url"
              value={urlValue}
              onChange={handleUrlChange}
              onKeyDown={handleUrlSubmit}
              className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/50 focus:outline-none"
              placeholder="Enter URL or search..."
              aria-label="Address bar"
              spellCheck={false}
            />

            {/* Copy URL Button */}
            <button
              onClick={() => navigator.clipboard.writeText(urlValue)}
              className="rounded p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy URL"
              title="Copy URL"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Home Button */}
        <button
          onClick={onHome}
          className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Go home"
          title="Home"
        >
          <Home className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
