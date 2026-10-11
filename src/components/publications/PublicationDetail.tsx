'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon,
  CodeBracketIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import type { PublicationDetail as PublicationDetailData } from '@/lib/publicationDetails';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import PublicationFigure from '@/components/publications/PublicationFigure';
import PublicationBadges from '@/components/publications/PublicationBadges';
import { useMessages } from '@/lib/i18n/useMessages';

interface PublicationDetailProps {
  publication: Publication;
  detail: PublicationDetailData | null;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="display mb-3 text-xl text-primary">{title}</h2>
      <div className="max-w-[46rem] text-[15px] leading-[1.75] text-neutral-700">{children}</div>
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
  const basisText =
    detail?.contentBasis === 'full-text'
      ? messages.publicationDetail.fullTextBasis
      : detail?.contentBasis === 'abstract'
        ? messages.publicationDetail.abstractBasis
        : messages.publicationDetail.metadataBasis;

  const copyBibtex = async () => {
    if (!publication.bibtex) return;
    try {
      await navigator.clipboard.writeText(publication.bibtex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const actionClass =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors';

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] overflow-hidden">
        <div className="aurora" />
      </div>

      <article className="relative mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-8 lg:pt-28">
        <Link
          href="/publications/"
          className="mx-auto flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-accent"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {messages.publicationDetail.backToPublications}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mt-10 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <span>
              {publication.type === 'conference'
                ? messages.publicationDetail.conference
                : messages.publicationDetail.journal}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span>{publication.year}</span>
            {venue && (
              <>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-neutral-400">{venue}</span>
              </>
            )}
          </div>

          <h1 className="section-title mx-auto mt-6 max-w-4xl text-primary">
            <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            {publication.authors.map((author, index) => (
              <span key={`${author.name}-${index}`}>
                <span
                  className={
                    author.isHighlighted
                      ? 'font-semibold text-accent'
                      : author.isCoAuthor
                        ? 'underline decoration-neutral-300 underline-offset-4'
                        : ''
                  }
                >
                  {author.name}
                </span>
                {author.isCorresponding && <sup className="text-accent">†</sup>}
                {index < publication.authors.length - 1 && ', '}
              </span>
            ))}
          </p>

          <p className="mx-auto mt-3 max-w-3xl text-sm text-neutral-500">
            {venue} {publication.year}
            {publication.volume ? `, ${publication.volume}` : ''}
            {publication.issue ? `(${publication.issue})` : ''}
            {publication.pages ? `, ${publication.pages.replace(/--/g, '–')}` : ''}
          </p>

          <PublicationBadges publication={publication} className="mt-5 justify-center" />

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {publication.doi && (
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionClass} bg-accent text-white hover:opacity-85`}
              >
                DOI
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            )}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionClass} bg-fill text-neutral-700 hover:text-primary dark:text-neutral-600`}
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                {messages.publicationDetail.pdf}
              </a>
            )}
            {codeUrl && (
              <a
                href={codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionClass} bg-fill text-neutral-700 hover:text-primary dark:text-neutral-600`}
              >
                <CodeBracketIcon className="h-4 w-4" />
                {messages.publicationDetail.code}
              </a>
            )}
          </div>
        </motion.header>

        <div className="mx-auto max-w-5xl">
          {detail?.figure && <PublicationFigure figure={detail.figure} />}
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-start">
          <main className="space-y-10">
            {isMetadataOnly ? (
              <section className="rounded-2xl border-l-2 border-accent/50 bg-surface-sunken px-6 py-5">
                <h2 className="font-semibold text-primary">{messages.publicationDetail.metadataOnlyTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {messages.publicationDetail.metadataOnlyBody}
                </p>
              </section>
            ) : (
              <>
                {detail.motivation && (
                  <DetailSection title={messages.publicationDetail.researchMotivation}>
                    <p>{detail.motivation}</p>
                  </DetailSection>
                )}
                {detail.method && (
                  <DetailSection title={messages.publicationDetail.methodOverview}>
                    <p>{detail.method}</p>
                  </DetailSection>
                )}
                {detail.contributions.length > 0 && (
                  <DetailSection title={messages.publicationDetail.keyContributions}>
                    <ul className="space-y-3">
                      {detail.contributions.map((contribution) => (
                        <li key={contribution} className="flex gap-3">
                          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                          <span>{contribution}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailSection>
                )}
                {detail.results && (
                  <DetailSection title={messages.publicationDetail.results}>
                    <p>{detail.results}</p>
                  </DetailSection>
                )}
                {detail.abstract && (
                  <DetailSection title={messages.publicationDetail.abstract}>
                    <p className="text-neutral-500">{detail.abstract}</p>
                  </DetailSection>
                )}
              </>
            )}
          </main>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="border-t border-hairline pt-5">
              <h2 className="eyebrow">{messages.publicationDetail.contentBasis}</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">{basisText}</p>
            </div>
            <div className="border-t border-hairline pt-5">
              <h2 className="eyebrow">{messages.publicationDetail.linksAndCitation}</h2>
              <div className="mt-3 space-y-2 text-[13px]">
                {publication.doi && (
                  <a
                    className="block text-accent transition-opacity hover:opacity-70"
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DOI ↗
                  </a>
                )}
                {pdfUrl && (
                  <a
                    className="block text-accent transition-opacity hover:opacity-70"
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PDF ↗
                  </a>
                )}
                {codeUrl && (
                  <a
                    className="block text-accent transition-opacity hover:opacity-70"
                    href={codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code ↗
                  </a>
                )}
              </div>
              {publication.bibtex && (
                <button
                  type="button"
                  onClick={copyBibtex}
                  className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-neutral-600 transition-colors hover:text-accent dark:text-neutral-400"
                >
                  {copied ? <CheckIcon className="h-4 w-4 text-accent" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
                  {copied ? messages.publicationDetail.copied : messages.publicationDetail.copyBibtex}
                </button>
              )}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
