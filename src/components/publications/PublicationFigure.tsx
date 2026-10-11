'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PublicationFigure as PublicationFigureData } from '@/lib/publicationDetails';
import { useMessages } from '@/lib/i18n/useMessages';

interface PublicationFigureProps {
  figure: PublicationFigureData;
}

export default function PublicationFigure({ figure }: PublicationFigureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messages = useMessages();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <figure className="mt-10">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={messages.publicationDetail.enlargeFigure}
          className="group block w-full overflow-hidden rounded-2xl border border-hairline bg-surface p-3 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
        >
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            className="h-auto w-full rounded-xl"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </button>
        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-neutral-500">
          <span>{figure.caption}</span>
          <span className="text-neutral-400">{figure.credit}</span>
        </figcaption>
      </figure>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-10"
            onClick={() => setIsOpen(false)}
          >
            <button
              type="button"
              aria-label={messages.publicationDetail.closeFigure}
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="max-h-full max-w-6xl overflow-auto rounded-2xl bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                className="h-auto w-full"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
