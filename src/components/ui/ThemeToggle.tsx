'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import { cn } from '@/lib/utils';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: ReactNode;
}

function useThemeOptions(): ThemeOption[] {
  const messages = useMessages();

  return [
    { value: 'system', label: messages.theme.system, icon: <ComputerDesktopIcon className="h-[18px] w-[18px]" /> },
    { value: 'light', label: messages.theme.light, icon: <SunIcon className="h-[18px] w-[18px]" /> },
    { value: 'dark', label: messages.theme.dark, icon: <MoonIcon className="h-[18px] w-[18px]" /> },
  ];
}

/** iOS-style circular icon button used in the toolbar. */
function IconButton({
  children,
  title,
  onClick,
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full',
        'text-neutral-600 transition-colors duration-200 dark:text-neutral-400',
        'hover:bg-fill hover:text-primary dark:hover:text-neutral-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
      )}
    >
      {children}
    </motion.button>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const messages = useMessages();
  const themes = useThemeOptions();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full bg-fill" />;
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <IconButton
      title={`${messages.theme.currentTheme}: ${currentTheme.label}. ${messages.theme.cycleTheme}.`}
      onClick={() => {
        const order: Theme[] = ['system', 'light', 'dark'];
        setTheme(order[(order.indexOf(theme) + 1) % order.length]);
      }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="grid place-items-center"
      >
        {currentTheme.icon}
      </motion.span>
    </IconButton>
  );
}

/** Segmented control in the spirit of macOS System Settings. */
export function ThemeToggleDropdown() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messages = useMessages();
  const themes = useThemeOptions();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [isOpen]);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full bg-fill" />;
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <IconButton
        title={`${messages.theme.currentTheme}: ${currentTheme.label}`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="grid place-items-center"
        >
          {currentTheme.icon}
        </motion.span>
      </IconButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
              className="glass absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-2xl p-1"
            >
              {themes.map((option) => {
                const active = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-accent-soft font-medium text-accent'
                        : 'text-neutral-700 hover:bg-fill dark:text-neutral-600',
                    )}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
