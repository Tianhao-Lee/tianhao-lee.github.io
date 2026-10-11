'use client';

import { motion } from 'framer-motion';
import Markdown from '@/components/ui/Markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
}

const ease = [0.32, 0.72, 0, 1] as const;

export default function TextPage({ config, content }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
        >
            <header className="mb-14 text-center">
                <h1 className="hero-title mx-auto max-w-4xl text-primary">{config.title}</h1>
                {config.description && (
                    <p className="lede mx-auto mt-6 max-w-2xl text-neutral-500">{config.description}</p>
                )}
            </header>
            <Markdown content={content} />
        </motion.div>
    );
}
