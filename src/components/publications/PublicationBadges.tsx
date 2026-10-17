'use client';

import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import { cn } from '@/lib/utils';

export default function PublicationBadges({
    publication,
    className = '',
}: {
    publication: Publication;
    className?: string;
}) {
    const messages = useMessages();
    const role = publication.authorRole ? messages.publications.authorRoles[publication.authorRole] : null;
    const ranks = publication.ranks ?? [];
    const isJournal = publication.type === 'journal';
    const impactFactor = isJournal ? publication.impactFactor : undefined;
    const impactFactor5y = isJournal ? publication.impactFactor5y : undefined;
    const metricsTitle = publication.impactFactorYear
        ? `Journal Citation Reports ${publication.impactFactorYear}`
        : undefined;

    if (!role && ranks.length === 0 && impactFactor === undefined && impactFactor5y === undefined) return null;

    const metricClass =
        'inline-flex items-center rounded-full border border-hairline px-2.5 py-1 text-[11px] font-medium tabular-nums text-neutral-600 dark:text-neutral-300';

    return (
        <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
            {role && (
                <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold tracking-tight text-accent">
                    {role}
                </span>
            )}
            {ranks.map((rank) => (
                <span
                    key={rank}
                    className="inline-flex items-center rounded-full border border-hairline px-2.5 py-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                    {rank}
                </span>
            ))}
            {impactFactor !== undefined && (
                <span className={metricClass} title={metricsTitle}>
                    {messages.publications.impactFactor} {impactFactor.toFixed(1)}
                </span>
            )}
            {impactFactor5y !== undefined && (
                <span className={metricClass} title={metricsTitle}>
                    {messages.publications.impactFactor5y} {impactFactor5y.toFixed(1)}
                </span>
            )}
        </div>
    );
}
