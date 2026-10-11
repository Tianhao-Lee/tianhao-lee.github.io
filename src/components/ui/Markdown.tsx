'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

type Variant = 'page' | 'card';

/**
 * Single markdown surface for every content file, so raw markdown picked up
 * from `content/` always lands on the design system.
 */
export default function Markdown({
  content,
  variant = 'page',
  className,
}: {
  content: string;
  variant?: Variant;
  className?: string;
}) {
  const compact = variant === 'card';
  const scale = compact ? 'text-[14px]' : 'text-[15px]';

  const components = {
    h1: ({ children }: React.ComponentProps<'h1'>) => (
      <h1 className={cn('display mb-5 mt-14 text-primary first:mt-0', compact ? 'text-2xl' : 'text-3xl')}>
        {children}
      </h1>
    ),
    h2: ({ children }: React.ComponentProps<'h2'>) => (
      <h2 className={cn('display mb-5 mt-14 text-primary first:mt-0', compact ? 'text-xl' : 'text-2xl')}>
        {children}
      </h2>
    ),
    h3: ({ children }: React.ComponentProps<'h3'>) => (
      <h3 className={cn('mb-3 mt-10 font-semibold tracking-tight text-primary first:mt-0', compact ? 'text-[17px]' : 'text-xl')}>
        {children}
      </h3>
    ),
    h4: ({ children }: React.ComponentProps<'h4'>) => (
      <h4
        className={cn(
          'first:mt-0',
          compact
            ? 'eyebrow mb-3 mt-8'
            : 'display mb-4 mt-14 border-t border-hairline pt-8 text-[19px] text-primary',
        )}
      >
        {children}
      </h4>
    ),
    p: ({ children }: React.ComponentProps<'p'>) => (
      <p className="mb-4 leading-[1.7] last:mb-0">{children}</p>
    ),
    ul: ({ children }: React.ComponentProps<'ul'>) => (
      <ul className={cn('mb-5 list-disc pl-5 marker:text-accent', compact ? 'space-y-2' : 'space-y-2.5')}>
        {children}
      </ul>
    ),
    ol: ({ children }: React.ComponentProps<'ol'>) => (
      <ol className="mb-5 list-decimal space-y-2.5 pl-5 marker:text-neutral-400">{children}</ol>
    ),
    li: ({ children }: React.ComponentProps<'li'>) => <li className="leading-[1.7]">{children}</li>,
    a: ({ ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
      />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
      <blockquote className="my-5 border-l-2 border-accent/40 pl-4 italic text-neutral-500">
        {children}
      </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
      <code className="rounded-md bg-fill px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
    hr: () => <hr className="my-8 border-hairline" />,
  };

  return (
    <div className={cn(scale, 'text-neutral-700', className)}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
