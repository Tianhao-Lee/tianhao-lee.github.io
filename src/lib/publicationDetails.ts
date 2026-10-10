import fs from 'fs';
import path from 'path';

export interface PublicationFigure {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl: string;
  license: string;
}

export interface PublicationAudit {
  pdfAcquired: boolean;
  imageAcquired: boolean;
  imageFigure?: string | null;
  imagePermission?: string | null;
  evidence: string;
  missing: string[];
}

export interface PublicationDetail {
  id: string;
  doi: string;
  slug: string;
  summary?: string | null;
  contentBasis: 'full-text' | 'abstract' | 'metadata-only';
  motivation?: string | null;
  method?: string | null;
  contributions: string[];
  results?: string | null;
  abstract?: string | null;
  figure?: PublicationFigure | null;
  links: {
    pdf?: string | null;
    code?: string | null;
  };
  audit: PublicationAudit;
}

interface PublicationDetailsFile {
  version: number;
  papers: PublicationDetail[];
}

let cachedDetails: PublicationDetail[] | null = null;

export function getPublicationDetails(): PublicationDetail[] {
  if (cachedDetails) return cachedDetails;

  const filePath = path.join(process.cwd(), 'content', 'publication-details.json');
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as PublicationDetailsFile;
  cachedDetails = parsed.papers;
  return cachedDetails;
}

export function getPublicationDetail(doi?: string, id?: string): PublicationDetail | null {
  const papers = getPublicationDetails();

  if (doi) {
    const normalizedDoi = doi.toLowerCase();
    const byDoi = papers.find((paper) => paper.doi?.toLowerCase() === normalizedDoi);
    if (byDoi) return byDoi;
  }

  // Records awaiting a publisher DOI are matched by their BibTeX key instead.
  if (id) {
    return papers.find((paper) => paper.id === id) || null;
  }

  return null;
}