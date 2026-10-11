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

    if (!role && ranks.length === 0) return null;

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
        </div>
    );
}
