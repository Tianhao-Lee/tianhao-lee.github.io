'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PublicationFigure as PublicationFigureData } from '@/lib/publicationDetails';
import { useMessages } from '@/lib/i18n/useMessages';

interface PublicationFigureProps {
  figure: PublicationFigureData;
}

export default function PublicationFigure({ figure }: PublicationFigureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messages = useMessages();

  return (
    <>
      <figure className="mt-10">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group block w-full overflow-hidden rounded-xl border border-neutral-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
          aria-label={messages.publicationDetail.enlargeFigure}
        >
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            priority
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </button>
        <figcaption className="mt-3 flex flex-col gap-1 text-xs leading-relaxed text-neutral-500 sm:flex-row sm:items-start sm:justify-between">
          <span>{figure.caption} {figure.credit}.</span>
          <span className="flex-shrink-0">
            <a href={figure.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark">{messages.publicationDetail.source} ↗</a>
            <span> · {figure.license}</span>
          </span>
        </figcaption>
      </figure>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={messages.publicationDetail.figurePreview}
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label={messages.publicationDetail.closeFigure}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            className="h-full w-full object-contain"
            sizes="100vw"
          />
        </div>
      )}
    </>
  );
}