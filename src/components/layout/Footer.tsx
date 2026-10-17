'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import VisitorCounter from '@/components/layout/VisitorCounter';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
  goatcounterSiteCode?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale = 'en', goatcounterSiteCode }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-xs text-neutral-500 sm:flex-row sm:px-8">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
          <p>
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
          <VisitorCounter siteCode={goatcounterSiteCode} />
        </div>
        <p>
          <a
            href="https://github.com/Tianhao-Lee"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            © {new Date().getFullYear()} Tianhao Li
          </a>
        </p>
      </div>
    </footer>
  );
}
