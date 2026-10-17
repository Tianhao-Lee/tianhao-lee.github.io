import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';

export interface JournalMetrics {
  impactFactor?: number;
  impactFactor5y?: number;
  year?: number;
}

interface JournalMetricsEntry {
  name?: string;
  impact_factor?: number;
  impact_factor_5y?: number;
}

interface JournalMetricsFile {
  year?: number;
  journal?: JournalMetricsEntry[];
}

type MetricsIndex = {
  year?: number;
  byName: Map<string, { impactFactor?: number; impactFactor5y?: number }>;
};

let cachedIndex: MetricsIndex | null = null;

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ' ').replace(/[.,;]+$/, '').trim();
}

function loadIndex(): MetricsIndex {
  if (cachedIndex) return cachedIndex;

  const emptyIndex: MetricsIndex = { year: undefined, byName: new Map() };

  try {
    const filePath = path.join(process.cwd(), 'content', 'journal-metrics.toml');
    const parsed = parse(fs.readFileSync(filePath, 'utf-8')) as JournalMetricsFile;

    const byName = new Map<string, { impactFactor?: number; impactFactor5y?: number }>();
    for (const entry of parsed.journal ?? []) {
      if (!entry?.name) continue;
      byName.set(normalizeName(entry.name), {
        impactFactor: typeof entry.impact_factor === 'number' ? entry.impact_factor : undefined,
        impactFactor5y: typeof entry.impact_factor_5y === 'number' ? entry.impact_factor_5y : undefined,
      });
    }

    cachedIndex = { year: parsed.year, byName };
    return cachedIndex;
  } catch {
    // A missing or malformed metrics file must never break the publication pages.
    cachedIndex = emptyIndex;
    return cachedIndex;
  }
}

export function getJournalMetrics(journal?: string): JournalMetrics | undefined {
  if (!journal) return undefined;

  const index = loadIndex();
  const metrics = index.byName.get(normalizeName(journal));
  if (!metrics) return undefined;

  return { ...metrics, year: index.year };
}
