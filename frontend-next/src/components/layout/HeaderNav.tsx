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

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import { useCognitiveTheme } from '@/lib/theme';

interface HeaderNavProps {
  title?: string;
  showUserMenu?: boolean;
  onMenuToggle?: () => void;
  className?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title = "AI Engineering Roadmap",
  showUserMenu = true,
  onMenuToggle,
  className = "",
}) => {
  const { theme, toggleTheme } = useCognitiveTheme();

  const getThemeIcon = () => {
    switch (theme.mode) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        sticky top-0 z-50
        glass-card
        border-b border-neutral-200 dark:border-neutral-700
        px-6 py-4
        ${className}
      `}
    >
      <div className="max-w-8xl mx-auto flex items-center justify-between">
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
                h-10 w-10
                rounded-xl
                flex items-center justify-center
                transition-all duration-300
                hover:scale-110
              "
              style={{ backgroundColor: theme.colors.focus }}
            >
              <Brain className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-sm text-neutral-500 leading-tight">
                Personal Learning Edition
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              cognitive-button
              p-3
              rounded-lg
              bg-neutral-100 dark:bg-neutral-800
              hover:bg-neutral-200 dark:hover:bg-neutral-700
              transition-all duration-200
            "
            aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} theme`}
          >
            {getThemeIcon()}
          </button>

          {/* Accessibility Options */}
          <div className="relative">
            <button
              className="
                cognitive-button
                p-3
                rounded-lg
                bg-neutral-100 dark:bg-neutral-800
                hover:bg-neutral-200 dark:hover:bg-neutral-700
                transition-all duration-200
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
                  p-3
                  rounded-lg
                  bg-neutral-100 dark:bg-neutral-800
                  hover:bg-neutral-200 dark:hover:bg-neutral-700
                  transition-all duration-200
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
      <div className="max-w-8xl mx-auto mt-4">
        <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: theme.colors.progress }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
          <span>Learning Progress</span>
          <span>25% Complete</span>
        </div>
      </div>
    </motion.header>
  );
};
