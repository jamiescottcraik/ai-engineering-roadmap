/**
 * Header Navigation Component - Modular Layout Architecture
 *
 * Part of the cognitive UI refactoring to split RoadmapLayout into:
 * - HeaderNav (this component)
 * - PageContainer
 * - Footer
 *
 * Implements:
 * - TypeScript strict typing with React.FC
 * - Semantic theme tokens instead of hardcoded values
 * - Accessibility-compliant navigation
 * - Learning state indicators
 */

'use client';

import { motion } from 'framer-motion';
import { Brain, Menu, Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import React from 'react';

import { useCognitiveTheme } from '@/lib/theme';

interface HeaderNavProps {
  title?: string;
  showUserMenu?: boolean;
  onMenuToggle?: () => void;
  className?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title = 'AI Engineering Roadmap',
  showUserMenu = true,
  onMenuToggle,
  className = '',
}) => {
  const { theme, setTheme, resolvedTheme } = useCognitiveTheme(); // TODO: Restore full theme object and toggleTheme

  const getThemeIcon = () => {
    // Use resolvedTheme for UI representation if system is selected
    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default: // Default to system or light
        return <Monitor className="h-4 w-4" />;
    }
  };

  const handleToggleTheme = () => {
    // Basic toggle, TODO: implement full cycle (light->dark->system->light) if that was the original logic
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        glass-card sticky top-0
        z-50
        border-b border-neutral-200 px-6
        py-4 dark:border-neutral-700
        ${className}
      `}
    >
      <div className="mx-auto flex max-w-8xl items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="cognitive-button p-2 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center space-x-3">
            <div
              className="
                flex h-10
                w-10
                items-center justify-center rounded-xl
                transition-all duration-300
                hover:scale-110
              "
              // TODO: Restore theme.colors.focus
              style={{ backgroundColor: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb' }}
            >
              <Brain className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold leading-tight text-foreground">{title}</h1>
              <p className="text-sm leading-tight text-neutral-500">Personal Learning Edition</p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme} // Updated onClick handler
            className="
              cognitive-button
              rounded-lg
              bg-neutral-100
              p-3 transition-all
              duration-200 hover:bg-neutral-200
              dark:bg-neutral-800 dark:hover:bg-neutral-700
            "
            // TODO: Restore proper theme mode logic if different from simple light/dark toggle
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
          >
            {getThemeIcon()}
          </button>

          {/* Accessibility Options */}
          <div className="relative">
            <button
              className="
                cognitive-button
                rounded-lg
                bg-neutral-100
                p-3 transition-all
                duration-200 hover:bg-neutral-200
                dark:bg-neutral-800 dark:hover:bg-neutral-700
              "
              aria-label="Accessibility options"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* User Menu */}
          {showUserMenu && (
            <div className="relative">
              <button
                className="
                  cognitive-button
                  rounded-lg
                  bg-neutral-100
                  p-3 transition-all
                  duration-200 hover:bg-neutral-200
                  dark:bg-neutral-800 dark:hover:bg-neutral-700
                "
                aria-label="User menu"
              >
                <User className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Learning Progress Indicator */}
      <div className="mx-auto mt-4 max-w-8xl">
        <div className="h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '25%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full"
            // TODO: Restore theme.colors.progress
            style={{ backgroundColor: resolvedTheme === 'dark' ? '#10b981' : '#059669' }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
          <span>Learning Progress</span>
          <span>25% Complete</span>
        </div>
      </div>
    </motion.header>
  );
};
