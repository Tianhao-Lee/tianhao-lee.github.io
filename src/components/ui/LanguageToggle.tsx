'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface LanguageToggleProps {
  i18n: I18nRuntimeConfig;
}

/**
 * Segmented control for the common two-locale case, dropdown beyond that —
 * both patterns straight out of iOS.
 */
export default function LanguageToggle({ i18n }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [isOpen]);

  if (!i18n.enabled || !i18n.switcher || i18n.locales.length <= 1) {
    return null;
  }

  if (!mounted) {
    return <div className="h-8 w-24 rounded-full bg-fill" />;
  }

  const currentLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  const labelOf = (code: string) => i18n.labels[code] || code.toUpperCase();

  if (i18n.locales.length <= 3) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-fill p-0.5" role="group">
        {i18n.locales.map((code) => {
          const active = code === currentLocale;
          return (
            <button
              key={code}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setLocale(code)}
              aria-pressed={active}
              className={cn(
                'relative rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200',
                active ? 'text-primary' : 'text-neutral-500 hover:text-primary dark:text-neutral-400',
              )}
            >
              {active && (
                <motion.span
                  layoutId="locale-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                />
              )}
              <span className="relative">{labelOf(code)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen((v) => !v)}
        title={labelOf(currentLocale)}
        className={cn(
          'flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium',
          'text-neutral-600 transition-colors hover:bg-fill hover:text-primary dark:text-neutral-400',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        )}
      >
        <LanguageIcon className="h-4 w-4" />
        {labelOf(currentLocale)}
        <ChevronDownIcon className="h-3 w-3" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
              className="glass absolute right-0 z-50 mt-2 w-40 origin-top-right overflow-hidden rounded-2xl p-1"
            >
              {i18n.locales.map((code) => {
                const active = code === currentLocale;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      setLocale(code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-accent-soft font-medium text-accent'
                        : 'text-neutral-700 hover:bg-fill dark:text-neutral-600',
                    )}
                  >
                    {labelOf(code)}
                    <span className="text-xs opacity-60">{code.toUpperCase()}</span>
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
