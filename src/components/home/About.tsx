'use client';

import { motion } from 'framer-motion';
import Markdown from '@/components/ui/Markdown';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
  content: string;
  title?: string;
}

const ease = [0.32, 0.72, 0, 1] as const;

export default function About({ content, title }: AboutProps) {
  const messages = useMessages();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease }}
      className="text-center"
    >
      <h2 className="section-title mx-auto max-w-3xl text-primary">{title || messages.home.about}</h2>
      <div className="mt-10 text-left">
        <Markdown content={content} />
      </div>
    </motion.section>
  );
}
