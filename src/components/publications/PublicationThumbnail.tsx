'use client';

import Image from 'next/image';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';

interface PublicationThumbnailProps {
    publication: Publication;
    priority?: boolean;
}

export default function PublicationThumbnail({ publication, priority = false }: PublicationThumbnailProps) {
    const messages = useMessages();
    const imageSrc = publication.preview ? `/papers/${publication.preview}` : null;
    const venue = publication.journal || publication.conference || 'Publication';

    return (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-hairline bg-surface">
            {imageSrc ? (
                <Image
                    src={imageSrc}
                    alt={`Method figure for ${publication.title}`}
                    fill
                    priority={priority}
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 30vw, 260px"
                />
            ) : (
                <div className="flex h-full flex-col justify-between p-4 text-left">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-accent">
                        <span>
                            {publication.type === 'conference'
                                ? messages.publicationDetail.conference
                                : messages.publicationDetail.journal}
                        </span>
                        <span>{publication.year}</span>
                    </div>
                    <p className="line-clamp-3 text-[13px] font-medium leading-snug text-primary">{venue}</p>
                    <p className="text-[10px] uppercase tracking-wide text-neutral-400">
                        {messages.publicationDetail.metadataOnlyTitle}
                    </p>
                </div>
            )}
        </div>
    );
}
