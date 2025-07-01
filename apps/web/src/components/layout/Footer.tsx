/**
 * Footer Component - Modular Layout Architecture
 *
 * Educational footer with:
 * - Learning resources and documentation links
 * - Accessibility compliance information
 * - Theme and cognitive design credits
 * - TypeScript strict typing
 */

'use client';

import { motion } from 'framer-motion';
import { Github, BookOpen, Heart, Zap } from 'lucide-react';
import React from 'react';

import { useCognitiveTheme } from '@/lib/theme';

interface FooterProps {
  showSocialLinks?: boolean;
  showLearningResources?: boolean;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  showSocialLinks = true,
  showLearningResources = true,
  className = '',
}) => {
  const { theme } = useCognitiveTheme();
  const currentYear = new Date().getFullYear();

  const learningResources = [
    { name: 'Learning Guide', href: '/docs/learning', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Roadmap Editor', href: '/roadmap', icon: <Zap className="h-4 w-4" /> },
    { name: 'Progress Analytics', href: '/analytics', icon: <BookOpen className="h-4 w-4" /> },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/jamiescottcraik/ai-engineering-roadmap',
      icon: <Github className="h-4 w-4" />,
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`
        mt-auto
        border-t border-neutral-200 dark:border-neutral-700
        bg-neutral-50 dark:bg-neutral-900
        ${className}
      `}
    >
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">AI Engineering Roadmap</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              A cognitive-adaptive learning platform designed with psychology-informed patterns for
              accelerated AI skill development.
            </p>
            <div className="flex items-center space-x-1 text-sm text-neutral-500">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>and cognitive design principles</span>
            </div>
          </div>

          {/* Learning Resources */}
          {showLearningResources && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Learning Resources</h4>
              <ul className="space-y-2">
                {learningResources.map((resource) => (
                  <li key={resource.name}>
                    <a
                      href={resource.href}
                      className="
                        inline-flex items-center space-x-2
                        text-sm text-neutral-600 dark:text-neutral-400
                        hover:text-foreground
                        transition-colors duration-200
                      "
                    >
                      {resource.icon}
                      <span>{resource.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Technical Details</h4>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <p>Next.js 15 + TypeScript</p>
              <p>Tailwind CSS v4 + Cognitive Design</p>
              <p>Framer Motion + React 19</p>
              <p>WCAG 2.1 AA Compliant</p>
            </div>

            {showSocialLinks && (
              <div className="flex space-x-3 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      p-2 rounded-lg
                      bg-neutral-200 dark:bg-neutral-800
                      hover:bg-neutral-300 dark:hover:bg-neutral-700
                      transition-all duration-200
                      hover:scale-105
                    "
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="
          mt-8 pt-6
          border-t border-neutral-200 dark:border-neutral-700
          flex flex-col sm:flex-row justify-between items-center
          space-y-2 sm:space-y-0
        "
        >
          <p className="text-sm text-neutral-500">
            © {currentYear} AI Engineering Roadmap. Personal Learning Edition.
          </p>

          <div className="flex items-center space-x-4 text-xs text-neutral-400">
            <span>Theme: {theme.mode}</span>
            <span>•</span>
            <span>Accessibility: {theme.accessibilityMode}</span>
            <span>•</span>
            <span>Constitutional AI Compliance</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
