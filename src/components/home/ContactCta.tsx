'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Github } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';

const ease = [0.32, 0.72, 0, 1] as const;

const OrcidMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
  </svg>
);

/**
 * Closing band, in the spirit of the dark call-to-action section that ends
 * every Apple product page.
 */
export default function ContactCta({ social }: { social: SiteConfig['social'] }) {
  const messages = useMessages();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!social.email) return;
    try {
      await navigator.clipboard.writeText(social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${social.email}`;
    }
  };

  const links = [
    social.google_scholar && { href: social.google_scholar, label: 'Google Scholar', icon: <AcademicCapIcon className="h-[18px] w-[18px]" /> },
    social.orcid && { href: social.orcid, label: 'ORCID', icon: <OrcidMark className="h-[18px] w-[18px]" /> },
    social.github && { href: social.github, label: 'GitHub', icon: <Github className="h-[18px] w-[18px]" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease }}
      className="overflow-hidden rounded-[32px] bg-neutral-900 px-8 py-16 text-center dark:bg-neutral-100 sm:px-14 sm:py-20"
    >
      {social.email && (
        <button
          type="button"
          onClick={copyEmail}
          className="group inline-flex flex-col items-center gap-3 text-white transition-opacity hover:opacity-80 dark:text-neutral-900"
        >
          <EnvelopeIcon className="h-7 w-7 opacity-50" />
          <span className="text-[clamp(1.25rem,3.6vw,2.25rem)] font-semibold tracking-tight break-all">
            {social.email}
          </span>
          <span className="text-xs uppercase tracking-wider opacity-50">
            {copied ? messages.profile.copied : messages.profile.click}
          </span>
        </button>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
        {(social.location || social.location_details) && (
          <a
            href={social.location_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-white/20 dark:bg-neutral-900/10 dark:text-neutral-900 dark:hover:bg-neutral-900/20"
          >
            <MapPinIcon className="h-[18px] w-[18px]" />
            {social.location}
          </a>
        )}
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-white/20 dark:bg-neutral-900/10 dark:text-neutral-900 dark:hover:bg-neutral-900/20"
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
    </motion.section>
  );
}
