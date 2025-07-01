'use client';

import { useState } from 'react';

import { BrowserWindowChrome, DeviceSize } from './browser-window-chrome';

/**
 * Browser Container - OpenUI-Style Browser Experience
 *
 * Provides a complete browser-like interface for the AI learning platform.
 * Features responsive preview modes, full-screen capabilities, and seamless
 * navigation between different views.
 *
 * Implements constitutional requirements for accessibility and UI components.
 */

interface BrowserContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const DEVICE_SIZES: DeviceSize[] = [
  { id: 'desktop', name: 'Desktop', width: 1920, height: 1080, icon: '🖥️' },
  { id: 'tablet', name: 'Tablet', width: 768, height: 1024, icon: '📱' },
  { id: 'mobile', name: 'Mobile', width: 375, height: 667, icon: '📱' },
];

export function BrowserContainer({
  children,
  title = 'brAInwav - AI Engineering Roadmap',
  className = '',
}: BrowserContainerProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');

  const handleMinimize = () => {
    // In a real implementation, this would minimize the window
    // For now, we'll just update state or emit an event
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    // In a real implementation, this would close the window
    // For now, we'll just update state or emit an event
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNavigate = (url: string) => {
    setCurrentUrl(url);
    // In a real implementation, this would navigate to the URL
    // For now, we'll just update the URL state
  };

  const handleDeviceChange = (deviceId: string) => {
    setActiveDevice(deviceId);
  };

  const handleHome = () => {
    setCurrentUrl('http://localhost:3000');
    // Navigate to home
    if (typeof window !== 'undefined') {
      window.location.pathname = '/';
    }
  };

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleForward = () => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  };

  const currentDevice = DEVICE_SIZES.find((device) => device.id === activeDevice);
  const containerStyle = currentDevice
    ? {
        maxWidth: currentDevice.width,
        minHeight: currentDevice.height,
      }
    : {};

  return (
    <div
      className={`${
        isMaximized ? 'fixed inset-0 z-50' : 'relative'
      } bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 ${className}`}
      style={isMaximized ? { width: '100vw', height: '100vh' } : {}}
    >
      {/* Browser Window Chrome */}
      <BrowserWindowChrome
        title={title}
        currentUrl={currentUrl}
        isMaximized={isMaximized}
        deviceSizes={DEVICE_SIZES}
        activeDevice={activeDevice}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
        onRefresh={handleRefresh}
        onNavigate={handleNavigate}
        onDeviceChange={handleDeviceChange}
        onHome={handleHome}
        onBack={handleBack}
        onForward={handleForward}
      />

      {/* Content Area */}
      <div
        className={`${
          isMaximized ? 'h-[calc(100vh-120px)]' : 'min-h-screen'
        } overflow-auto transition-all duration-300`}
        style={!isMaximized ? containerStyle : {}}
      >
        {children}
      </div>

      {/* Device Size Indicator */}
      {activeDevice !== 'desktop' && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-black/50 px-3 py-2 text-sm text-white backdrop-blur-sm">
          {currentDevice?.name}: {currentDevice?.width}×{currentDevice?.height}
        </div>
      )}
    </div>
  );
}
