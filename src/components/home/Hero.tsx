'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { SiteConfig } from '@/lib/config';

interface HeroProps {
  author: SiteConfig['author'];
  researchInterests?: string[];
}

const ease = [0.32, 0.72, 0, 1] as const;

/**
 * Apple product-page hero: eyebrow, oversized headline, supporting line and
 * the subject rendered large. Everything is centred and generously spaced.
 */
export default function Hero({ author, researchInterests }: HeroProps) {
  return (
    <section className="relative px-5 pb-10 pt-16 text-center sm:pt-20">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="text-[15px] font-semibold tracking-tight text-primary sm:text-base"
      >
        {author.institution}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.06, ease }}
        className="hero-title mx-auto mt-3 max-w-5xl text-primary"
      >
        {author.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease }}
        className="lede mx-auto mt-6 max-w-2xl font-medium text-accent"
      >
        {author.title}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.18, ease }}
        className="relative mx-auto mt-12 w-52 sm:w-64"
      >
        <div className="absolute inset-x-6 bottom-0 top-6 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="relative overflow-hidden rounded-full ring-1 ring-hairline">
          <Image
            src={author.avatar}
            alt={author.name}
            width={512}
            height={512}
            className="h-auto w-full object-cover object-center"
            priority
          />
        </div>
      </motion.div>

      {researchInterests && researchInterests.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2.5"
        >
          {researchInterests.map((interest) => (
            <li
              key={interest}
              className="rounded-full border border-hairline bg-surface px-4 py-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400"
            >
              {interest}
            </li>
          ))}
        </motion.ul>
      )}
    </section>
  );
}
