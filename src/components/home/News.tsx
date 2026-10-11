'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    if (items.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
        >
            <h2 className="display mb-5 text-2xl text-primary">{resolvedTitle}</h2>
            <ul className="max-w-[44rem] divide-y divide-[color:var(--hairline)] border-y border-hairline">
                {items.map((item, index) => (
                    <li key={index} className="flex gap-5 py-3.5">
                        <span className="w-24 shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400">{item.date}</span>
                        <p className="text-[15px] leading-relaxed text-neutral-700">{item.content}</p>
                    </li>
                ))}
            </ul>
        </motion.section>
    );
}
