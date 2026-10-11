'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Markdown from '@/components/ui/Markdown';
import { CardPageConfig } from '@/types/page';

const ease = [0.32, 0.72, 0, 1] as const;

/**
 * One full-bleed panel per card, alternating between the two surface tones —
 * the same rhythm Apple uses for its feature sections.
 */
export default function CardPage({ config }: { config: CardPageConfig }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
        >
            <header className="mx-auto mb-16 max-w-3xl text-center">
                <h1 className="hero-title text-primary">{config.title}</h1>
                {config.description && (
                    <p className="lede mx-auto mt-6 max-w-2xl text-neutral-500">{config.description}</p>
                )}
            </header>

            <div className="mx-auto max-w-6xl space-y-8">
                {config.items.map((item, index) => (
                    <motion.article
                        key={`${item.title}-${index}`}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.55, ease }}
                        className={`overflow-hidden rounded-[32px] p-7 sm:p-10 lg:p-14 ${
                            index % 2 === 0
                                ? 'bg-surface ring-1 ring-hairline'
                                : 'bg-surface-sunken'
                        }`}
                    >
                        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={480}
                                    height={672}
                                    className="mx-auto h-auto w-40 shrink-0 rounded-3xl object-cover ring-1 ring-hairline sm:mx-0 sm:w-48"
                                />
                            )}

                            <div className="min-w-0 flex-1">
                                <h2 className="section-title text-primary">{item.title}</h2>
                                {item.subtitle && (
                                    <p className="mt-3 text-[17px] font-medium text-accent">{item.subtitle}</p>
                                )}

                                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
                                        >
                                            {item.linkLabel || 'Visit'}
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    {item.date && (
                                        <span className="rounded-full bg-fill px-4 py-2 text-[13px] font-medium text-neutral-500">
                                            {item.date}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {item.content && (
                            <div className="mt-10 max-w-4xl">
                                <Markdown content={item.content} variant="card" />
                            </div>
                        )}

                        {item.tags && item.tags.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-neutral-500 dark:text-neutral-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.article>
                ))}
            </div>
        </motion.div>
    );
}
