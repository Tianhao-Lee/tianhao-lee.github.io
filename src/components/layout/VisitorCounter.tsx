'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useMessages } from '@/lib/i18n/useMessages';
import { goatCounterTotalUrl } from '@/lib/analytics';

export default function VisitorCounter({ siteCode }: { siteCode?: string }) {
  const messages = useMessages();
  const [total, setTotal] = useState<string | null>(null);

  useEffect(() => {
    if (!siteCode) return;

    const controller = new AbortController();

    fetch(goatCounterTotalUrl(siteCode), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`GoatCounter responded with ${response.status}`);
        return response.json();
      })
      .then((data: { count?: unknown }) => {
        const value = typeof data?.count === 'string' ? data.count.trim() : '';
        if (/^[\d,]+$/.test(value)) setTotal(value);
      })
      .catch(() => {
        // Stay hidden until the public totals API is reachable; never show a placeholder number.
      });

    return () => controller.abort();
  }, [siteCode]);

  if (!siteCode || total === null) return null;

  return (
    <p className="flex items-center gap-1.5">
      <Eye className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span>
        {messages.footer.totalViews}
        <span aria-hidden="true"> · </span>
        <span className="tabular-nums">{total}</span>
      </span>
    </p>
  );
}
