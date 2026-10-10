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
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={`Method figure for ${publication.title}`}
          fill
          priority={priority}
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 220px"
        />
      ) : (
        <div className="flex h-full flex-col justify-between p-2 md:p-4">
          <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider text-accent md:text-[11px]">
            <span>{publication.type === 'conference' ? messages.publicationDetail.conference : messages.publicationDetail.journal}</span>
            <span>{publication.year}</span>
          </div>
          <div>
            <div className="mb-2 h-px w-8 bg-accent/60" />
            <p className="line-clamp-2 text-[11px] font-medium leading-snug text-primary md:line-clamp-3 md:text-sm">{venue}</p>
          </div>
          <p className="hidden text-[11px] uppercase tracking-wide text-neutral-400 md:block">
            {messages.publicationDetail.metadataOnlyTitle}
          </p>
        </div>
      )}
    </div>
  );
}