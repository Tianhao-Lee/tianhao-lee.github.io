'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
  i18n: I18nRuntimeConfig;
  itemsByLocale?: Record<string, SiteConfig['navigation']>;
  siteTitleByLocale?: Record<string, string>;
}

/**
 * Apple product-page chrome: a single floating, frosted pill that holds the
 * identity on the left, the section links in the middle and the controls on
 * the right.
 */
export default function Navigation({
  items,
  siteTitle,
  enableOnePageMode,
  i18n,
  itemsByLocale,
  siteTitleByLocale,
}: NavigationProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const resolvedLocale = i18n.enabled ? locale : i18n.defaultLocale;

  const effectiveItems = useMemo(
    () => itemsByLocale?.[resolvedLocale] || itemsByLocale?.[i18n.defaultLocale] || items,
    [i18n.defaultLocale, items, itemsByLocale, resolvedLocale],
  );

  const effectiveSiteTitle = useMemo(
    () => siteTitleByLocale?.[resolvedLocale] || siteTitleByLocale?.[i18n.defaultLocale] || siteTitle,
    [i18n.defaultLocale, resolvedLocale, siteTitle, siteTitleByLocale],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const visibleSections = useRef(new Set<string>());

  useEffect(() => {
    if (!enableOnePageMode) return;

    setActiveHash(window.location.hash);
    const onHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    visibleSections.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.current.add(entry.target.id);
          else visibleSections.current.delete(entry.target.id);
        });
        const firstVisible = effectiveItems.find(
          (item) => item.type === 'page' && visibleSections.current.has(item.target),
        );
        if (firstVisible) setActiveHash(firstVisible.target === 'about' ? '' : `#${firstVisible.target}`);
      },
      { root: null, rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );

    effectiveItems.forEach((item) => {
      if (item.type !== 'page') return;
      const el = document.getElementById(item.target);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      observer.disconnect();
    };
  }, [enableOnePageMode, effectiveItems]);

  const isItemActive = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode
      ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
      : item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href);

  const hrefOf = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode ? `/#${item.target}` : item.href;

  const activeItem = effectiveItems.find(isItemActive) ?? null;

  const measure = useCallback(() => {
    const container = navContainerRef.current;
    if (!container || !activeItem) {
      setIndicator(null);
      return;
    }
    const el = container.querySelector<HTMLElement>(
      `[data-nav-href="${CSS.escape(hrefOf(activeItem))}"]`,
    );
    setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [activeItem, enableOnePageMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    measure();
  }, [measure, resolvedLocale, pathname, activeHash]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5">
        <header
          className={cn(
            'toolbar pointer-events-auto mx-auto flex h-14 max-w-5xl items-center gap-3 pl-4 pr-2 transition-shadow duration-300 sm:pl-5',
            scrolled ? 'shadow-[0_6px_24px_rgba(0,0,0,0.10)]' : 'shadow-[0_2px_12px_rgba(0,0,0,0.05)]',
          )}
        >
          <Link
            href="/"
            className="shrink-0 text-[15px] font-semibold tracking-tight text-primary transition-opacity hover:opacity-70"
          >
            {effectiveSiteTitle}
          </Link>

          <nav
            ref={navContainerRef}
            className="relative mx-auto hidden items-center gap-0.5 lg:flex"
          >
            {indicator && (
              <motion.span
                aria-hidden
                className="absolute inset-y-0 rounded-full bg-fill"
                initial={false}
                animate={{ left: indicator.left, width: indicator.width }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {effectiveItems.map((item) => (
              <Link
                key={`${item.href}-${item.title}`}
                href={hrefOf(item)}
                data-nav-href={hrefOf(item)}
                className={cn(
                  'relative z-10 rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-200',
                  isItemActive(item)
                    ? 'font-medium text-primary'
                    : 'text-neutral-500 hover:text-primary dark:text-neutral-400',
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <LanguageToggle i18n={i18n} />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-fill hover:text-primary dark:text-neutral-400 lg:hidden"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-3 top-3 z-[61] overflow-hidden rounded-3xl bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:hidden"
            >
              <div className="flex h-14 items-center justify-between px-5">
                <span className="text-[15px] font-semibold text-primary">{effectiveSiteTitle}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-fill"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-3 pb-3">
                {effectiveItems.map((item) => (
                  <Link
                    key={`${item.href}-${item.title}-m`}
                    href={hrefOf(item)}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block rounded-2xl px-4 py-3 text-[15px] transition-colors',
                      isItemActive(item)
                        ? 'bg-accent-soft font-medium text-accent'
                        : 'text-neutral-700 hover:bg-fill dark:text-neutral-600',
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
