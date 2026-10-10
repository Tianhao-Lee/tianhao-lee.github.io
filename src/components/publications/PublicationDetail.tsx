'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, ArrowUpRightIcon, ClipboardDocumentIcon, CheckIcon, CodeBracketIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import type { PublicationDetail as PublicationDetailData } from '@/lib/publicationDetails';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import PublicationFigure from '@/components/publications/PublicationFigure';
import PublicationBadges from '@/components/publications/PublicationBadges';
import { useMessages } from '@/lib/i18n/useMessages';

interface PublicationDetailProps { publication: Publication; detail: PublicationDetailData | null; }

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <h2 className="font-serif text-2xl font-bold text-primary">{title}</h2>
      <div className="mt-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}

export default function PublicationDetail({ publication, detail }: PublicationDetailProps) {
  const messages = useMessages();
  const [copied, setCopied] = useState(false);
  const venue = publication.journal || publication.conference || '';
  const pdfUrl = publication.pdfUrl || detail?.links.pdf || null;
  const codeUrl = publication.code || detail?.links.code || null;
  const isMetadataOnly = !detail || detail.contentBasis === 'metadata-only';
  const basisText = detail?.contentBasis === 'full-text' ? messages.publicationDetail.fullTextBasis : detail?.contentBasis === 'abstract' ? messages.publicationDetail.abstractBasis : messages.publicationDetail.metadataBasis;
  const copyBibtex = async () => { if (!publication.bibtex) return; await navigator.clipboard.writeText(publication.bibtex); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link href="/publications/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-accent">
        <ArrowLeftIcon className="h-4 w-4" /> {messages.publicationDetail.backToPublications}
      </Link>
      <header className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <span>{publication.type === 'conference' ? messages.publicationDetail.conference : messages.publicationDetail.journal}</span>
          <span className="text-neutral-300 dark:text-neutral-700">/</span><span>{publication.year}</span>
          {venue && <><span className="text-neutral-300 dark:text-neutral-700">/</span><span className="text-neutral-500">{venue}</span></>}
        </div>
        <h1 className="mt-5 max-w-5xl font-serif text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
          <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
        </h1>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          {publication.authors.map((author, index) => (
            <span key={`${author.name}-${index}`}>
              <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>{author.name}</span>
              {author.isCorresponding && (
                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
              )}
              {index < publication.authors.length - 1 && ', '}
            </span>
          ))}
        </p>
        <p className="mt-3 text-sm text-neutral-500">
          {venue} {publication.year}{publication.volume ? `, ${publication.volume}` : ''}{publication.issue ? `(${publication.issue})` : ''}{publication.pages ? `, ${publication.pages.replace(/--/g, '–')}` : ''}
        </p>
        <PublicationBadges publication={publication} className="mt-3" />
        <div className="mt-7 flex flex-wrap gap-3">
          {publication.doi && <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark">DOI <ArrowUpRightIcon className="h-4 w-4" /></a>}
          {pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent dark:border-neutral-700 dark:text-neutral-300"><DocumentArrowDownIcon className="h-4 w-4" /> {messages.publicationDetail.pdf}</a>}
          {codeUrl && <a href={codeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent dark:border-neutral-700 dark:text-neutral-300"><CodeBracketIcon className="h-4 w-4" /> {messages.publicationDetail.code}</a>}
        </div>
      </header>
      {detail?.figure && <PublicationFigure figure={detail.figure} />}

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
        <main className="space-y-10">
          {isMetadataOnly ? (
            <section className="border-l-4 border-accent/60 bg-neutral-50 px-6 py-5 dark:bg-neutral-900">
              <h2 className="font-serif text-xl font-bold text-primary">{messages.publicationDetail.metadataOnlyTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{messages.publicationDetail.metadataOnlyBody}</p>
            </section>
          ) : (
            <>
              {detail.motivation && <DetailSection title={messages.publicationDetail.researchMotivation}><p>{detail.motivation}</p></DetailSection>}
              {detail.method && <DetailSection title={messages.publicationDetail.methodOverview}><p>{detail.method}</p></DetailSection>}
              {detail.contributions.length > 0 && (
                <DetailSection title={messages.publicationDetail.keyContributions}>
                  <ul className="space-y-3">{detail.contributions.map((contribution) => <li key={contribution} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" /><span>{contribution}</span></li>)}</ul>
                </DetailSection>
              )}
              {detail.results && <DetailSection title={messages.publicationDetail.results}><p>{detail.results}</p></DetailSection>}
              {detail.abstract && <DetailSection title={messages.publicationDetail.abstract}><p className="text-neutral-600 dark:text-neutral-400">{detail.abstract}</p></DetailSection>}
            </>
          )}
        </main>
        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{messages.publicationDetail.contentBasis}</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{basisText}</p>
          </div>
          <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{messages.publicationDetail.linksAndCitation}</h2>
            <div className="mt-3 space-y-2 text-sm">
              {publication.doi && <a className="block text-accent hover:text-accent-dark" href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">DOI ↗</a>}
              {pdfUrl && <a className="block text-accent hover:text-accent-dark" href={pdfUrl} target="_blank" rel="noopener noreferrer">PDF ↗</a>}
              {codeUrl && <a className="block text-accent hover:text-accent-dark" href={codeUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
            </div>
            {publication.bibtex && (
              <button type="button" onClick={copyBibtex} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-accent dark:text-neutral-400">
                {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
                {copied ? messages.publicationDetail.copied : messages.publicationDetail.copyBibtex}
              </button>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}