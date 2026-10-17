import type { SiteConfig } from '@/lib/config';

const SITE_CODE_PATTERN = /^[a-z0-9][a-z0-9-]*$/i;

export function getGoatCounterSiteCode(config: SiteConfig): string | undefined {
  const raw = config.analytics?.goatcounter?.trim();
  if (!raw) return undefined;

  const code = raw
    .replace(/^https?:\/\//i, '')
    .replace(/\.goatcounter\.com.*$/i, '')
    .replace(/\/.*$/, '')
    .trim();

  return SITE_CODE_PATTERN.test(code) ? code : undefined;
}

export function goatCounterCountUrl(siteCode: string): string {
  return `https://${siteCode}.goatcounter.com/count`;
}

export function goatCounterTotalUrl(siteCode: string): string {
  return `https://${siteCode}.goatcounter.com/counter/TOTAL.json`;
}
