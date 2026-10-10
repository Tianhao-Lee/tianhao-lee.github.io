'use client';

import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';

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
        <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
            {role && (
                <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent dark:bg-accent/20 dark:text-accent-light">
                    {role}
                </span>
            )}
            {ranks.map((rank) => (
                <span
                    key={rank}
                    className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
                >
                    {rank}
                </span>
            ))}
        </div>
    );
}
