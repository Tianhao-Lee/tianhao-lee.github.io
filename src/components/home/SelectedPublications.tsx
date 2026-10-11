'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import PublicationThumbnail from '@/components/publications/PublicationThumbnail';
import PublicationBadges from '@/components/publications/PublicationBadges';

interface SelectedPublicationsProps {
  publications: Publication[];
  title?: string;
  enableOnePageMode?: boolean;
}

const ease = [0.32, 0.72, 0, 1] as const;

/**
 * Alternating full-width rows — the figure swaps sides on every other entry,
 * the way Apple alternates feature blocks down a product page.
 */
export default function SelectedPublications({
  publications,
  title,
  enableOnePageMode = false,
}: SelectedPublicationsProps) {
  const messages = useMessages();
  const resolvedTitle = title || messages.home.selectedPublications;
  const href = enableOnePageMode ? '/#publications' : '/publications';

  return (
    <section>
      <div className="mb-14 text-center">
        <h2 className="section-title text-primary">{resolvedTitle}</h2>
        <Link
          href={href}
          prefetch
          className="group mt-4 inline-flex items-center gap-1 text-[15px] font-medium text-accent transition-opacity hover:opacity-70"
        >
          {messages.home.viewAll}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="space-y-6">
        {publications.map((pub, index) => {
          const flipped = index % 2 === 1;
          return (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease }}
              className="surface-card group grid gap-7 overflow-hidden p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-12"
            >
              <Link
                href={`/publications/${pub.slug || pub.id}/`}
                className={flipped ? 'block lg:order-2' : 'block'}
                aria-label={pub.title}
              >
                <PublicationThumbnail publication={pub} priority={index === 0} />
              </Link>

              <div className={`min-w-0 ${flipped ? 'lg:order-1' : ''}`}>
                <h3 className="text-[21px] font-semibold leading-snug tracking-tight text-primary sm:text-[23px]">
                  <Link
                    href={`/publications/${pub.slug || pub.id}/`}
                    className="transition-colors group-hover:text-accent"
                  >
                    <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                  </Link>
                </h3>

                <p className="mt-4 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {pub.authors.map((author, idx) => (
                    <span key={idx}>
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
                      {idx < pub.authors.length - 1 && ', '}
                    </span>
                  ))}
                </p>

                <p className="mt-3 text-[15px] font-medium text-primary">
                  {pub.journal || pub.conference} {pub.year}
                </p>

                <PublicationBadges publication={pub} className="mt-4" />

                {pub.description && (
                  <p className="mt-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {pub.description}
                  </p>
                )}

                <Link
                  href={`/publications/${pub.slug || pub.id}/`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent transition-opacity hover:opacity-70"
                >
                  {messages.publicationDetail.details}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
