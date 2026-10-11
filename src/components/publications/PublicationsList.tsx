'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ClipboardDocumentIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';
import PublicationThumbnail from './PublicationThumbnail';
import PublicationBadges from './PublicationBadges';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
}

export default function PublicationsList({ config, publications }: PublicationsListProps) {
    const messages = useMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const years = useMemo(
        () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
        [publications],
    );

    const types = useMemo(
        () => Array.from(new Set(publications.map((p) => p.type))).sort(),
        [publications],
    );

    const filteredPublications = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return publications.filter((pub) => {
            const matchesSearch =
                pub.title.toLowerCase().includes(q) ||
                pub.authors.some((author) => author.name.toLowerCase().includes(q)) ||
                pub.journal?.toLowerCase().includes(q) ||
                pub.conference?.toLowerCase().includes(q);
            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;
            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    const hasFilters = selectedYear !== 'all' || selectedType !== 'all' || searchQuery.length > 0;

    /** Shared shape for the segmented filter rows. */
    const FilterRow = ({
        options,
        value,
        onChange,
        labelOf,
    }: {
        options: string[];
        value: string;
        onChange: (v: string) => void;
        labelOf: (v: string) => string;
    }) => (
        <div className="flex flex-wrap items-center gap-1.5">
            {['all', ...options].map((option) => {
                const active = option === value;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                            active
                                ? 'bg-primary text-[color:var(--background)]'
                                : 'bg-fill text-neutral-600 hover:text-primary dark:text-neutral-400',
                        )}
                    >
                        {labelOf(option)}
                    </button>
                );
            })}
        </div>
    );

    const copyBibtex = async (id: string, bibtex: string) => {
        try {
            await navigator.clipboard.writeText(bibtex);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1600);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
            <header className="mx-auto mb-14 max-w-3xl text-center">
                <h1 className="hero-title text-primary">{config.title}</h1>
                {config.description && (
                    <p className="lede mx-auto mt-6 max-w-2xl text-neutral-500">{config.description}</p>
                )}
            </header>

            {/* Sticky toolbar needs its own frosted backdrop, otherwise the
                list scrolls visibly underneath it. */}
            <div className="sticky top-[76px] z-30 mx-auto mb-10 max-w-5xl space-y-4 rounded-3xl bg-background/85 px-4 py-3 backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder={messages.publications.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-hairline bg-surface py-2.5 pl-11 pr-4 text-sm text-primary shadow-[var(--shadow-card)] outline-none transition-shadow placeholder:text-neutral-400 focus:shadow-[var(--shadow-lift)]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden text-xs text-neutral-400 sm:block">
                            {filteredPublications.length} / {publications.length}
                        </span>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedYear('all');
                                    setSelectedType('all');
                                }}
                                className="rounded-full bg-fill px-3.5 py-2 text-xs font-medium text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                            >
                                {messages.publications.reset}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <FilterRow
                        options={years.map(String)}
                        value={selectedYear === 'all' ? 'all' : String(selectedYear)}
                        onChange={(v) => setSelectedYear(v === 'all' ? 'all' : Number(v))}
                        labelOf={(v) => (v === 'all' ? messages.publications.allYears : v)}
                    />
                    <FilterRow
                        options={types}
                        value={selectedType}
                        onChange={setSelectedType}
                        labelOf={(v) =>
                            v === 'all'
                                ? messages.publications.allTypes
                                : messages.publicationDetail[v as 'journal' | 'conference'] || v
                        }
                    />
                </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-4">
                {filteredPublications.map((pub, index) => {
                    const bibtexOpen = expandedBibtexId === pub.id;
                    const abstractOpen = expandedAbstractId === pub.id;

                    return (
                        <motion.article
                            key={pub.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04, ease: [0.32, 0.72, 0, 1] }}
                            className="surface-card overflow-hidden p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
                                <Link href={`/publications/${pub.slug || pub.id}/`} className="block" aria-label={pub.title}>
                                    <PublicationThumbnail publication={pub} priority={index === 0} />
                                </Link>

                                <div className="min-w-0">
                                    <h2 className="text-[17px] font-semibold leading-snug tracking-tight text-primary">
                                        <Link
                                            href={`/publications/${pub.slug || pub.id}/`}
                                            className="transition-colors hover:text-accent"
                                        >
                                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                        </Link>
                                    </h2>

                                    <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
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

                                    <p className="mt-2 text-[13px] font-medium text-primary">
                                        {pub.journal || pub.conference} {pub.year}
                                        {(pub.volume || pub.issue || pub.pages) && (
                                            <span className="font-normal text-neutral-400">
                                                {pub.volume ? `, ${pub.volume}` : ''}
                                                {pub.issue ? `(${pub.issue})` : ''}
                                                {pub.pages ? `, ${pub.pages.replace(/--/g, '–')}` : ''}
                                            </span>
                                        )}
                                    </p>

                                    <PublicationBadges publication={pub} className="mt-3" />

                                    {pub.description && (
                                        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                                            {pub.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <Link
                                            href={`/publications/${pub.slug || pub.id}/`}
                                            className="inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-85"
                                        >
                                            {messages.publicationDetail.details}
                                        </Link>
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-full bg-fill px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                                            >
                                                DOI
                                            </a>
                                        )}
                                        {pub.pdfUrl && (
                                            <a
                                                href={pub.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-full bg-fill px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                                            >
                                                PDF
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center rounded-full bg-fill px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                                            >
                                                {messages.publications.code}
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                type="button"
                                                onClick={() => setExpandedAbstractId(abstractOpen ? null : pub.id)}
                                                className="inline-flex items-center gap-1 rounded-full bg-fill px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                                            >
                                                {messages.publications.abstract}
                                                <ChevronDownIcon className={cn('h-3.5 w-3.5 transition-transform', abstractOpen && 'rotate-180')} />
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                type="button"
                                                onClick={() => setExpandedBibtexId(bibtexOpen ? null : pub.id)}
                                                className="inline-flex items-center gap-1 rounded-full bg-fill px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                                            >
                                                {messages.publications.bibtex}
                                                <ChevronDownIcon className={cn('h-3.5 w-3.5 transition-transform', bibtexOpen && 'rotate-180')} />
                                            </button>
                                        )}
                                        {pub.citations !== undefined && (
                                            <span className="text-xs text-neutral-400">
                                                {pub.citations} {messages.publicationDetail.citations}
                                            </span>
                                        )}
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {abstractOpen && pub.abstract && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <p className="mt-4 rounded-2xl bg-surface-sunken p-4 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                                                    {pub.abstract}
                                                </p>
                                            </motion.div>
                                        )}

                                        {bibtexOpen && pub.bibtex && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="relative mt-4">
                                                    <pre className="overflow-x-auto rounded-2xl bg-surface-sunken p-4 font-mono text-[12px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                                                        {pub.bibtex}
                                                    </pre>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyBibtex(pub.id, pub.bibtex || '')}
                                                        aria-label={messages.publicationDetail.copyBibtex}
                                                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-surface text-neutral-500 transition-colors hover:text-accent"
                                                    >
                                                        {copiedId === pub.id ? (
                                                            <CheckIcon className="h-4 w-4 text-accent" />
                                                        ) : (
                                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.article>
                    );
                })}

                {filteredPublications.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-hairline py-20 text-center text-sm text-neutral-400">
                        {messages.publications.noResults}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
