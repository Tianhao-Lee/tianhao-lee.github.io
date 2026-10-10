'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import PublicationThumbnail from '@/components/publications/PublicationThumbnail';

interface SelectedPublicationsProps {
  publications: Publication[];
  title?: string;
  enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
  const messages = useMessages();
  const resolvedTitle = title || messages.home.selectedPublications;

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <h2 className="font-serif text-2xl font-bold text-primary">{resolvedTitle}</h2>
        <Link href={enableOnePageMode ? '/#publications' : '/publications'} prefetch className="text-sm font-medium text-accent transition-colors hover:text-accent-dark">
          {messages.home.viewAll} →
        </Link>
      </div>

      <div className="space-y-6">
        {publications.map((pub, index) => {
          const detailHref = `/publications/${pub.slug || pub.id}/`;
          const venue = pub.journal || pub.conference || '';
          return (
            <motion.article key={pub.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 * index }} className="grid grid-cols-[116px_minmax(0,1fr)] gap-4 border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0 dark:border-neutral-800 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
              <Link href={detailHref} className="block overflow-hidden rounded-lg" aria-label={pub.title}>
                <PublicationThumbnail publication={pub} priority={index === 0} />
              </Link>
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold leading-snug text-primary md:text-xl">
                  <Link href={detailHref} className="transition-colors hover:text-accent">
                    <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {pub.authors.map((author, authorIndex) => (
                    <span key={`${author.name}-${authorIndex}`}>
                      <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>{author.name}</span>
                      {authorIndex < pub.authors.length - 1 && ', '}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{venue} {pub.year}</p>
                {pub.description && <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{pub.description}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium">
                  <Link href={detailHref} className="text-accent hover:text-accent-dark">{messages.publicationDetail.details} →</Link>
                  {pub.doi && <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-accent">DOI ↗</a>}
                  {pub.pdfUrl && <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-accent">PDF ↗</a>}
                  {pub.code && <a href={pub.code} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-accent">Code ↗</a>}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}