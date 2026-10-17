'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { goatCounterCountUrl } from '@/lib/analytics';

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars?: { path?: string }) => void;
    };
  }
}

const SCRIPT_ID = 'goatcounter-count-js';

export default function GoatCounterTracker({ siteCode }: { siteCode: string }) {
  const pathname = usePathname();
  const countedPath = useRef<string | null>(null);

  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = '/vendor/count.js';
    script.setAttribute('data-goatcounter', goatCounterCountUrl(siteCode));
    document.body.appendChild(script);
  }, [siteCode]);

  useEffect(() => {
    const currentPath = `${window.location.pathname}${window.location.search}`;

    // count.js records the initial document load itself; only forward later route changes.
    if (countedPath.current === null) {
      countedPath.current = currentPath;
      return;
    }
    if (countedPath.current === currentPath) return;

    countedPath.current = currentPath;
    window.goatcounter?.count?.({ path: currentPath });
  }, [pathname]);

  return null;
}
