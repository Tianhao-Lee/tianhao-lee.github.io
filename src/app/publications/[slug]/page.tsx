import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBibtexContent } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import { getPublicationDetail } from '@/lib/publicationDetails';
import PublicationDetail from '@/components/publications/PublicationDetail';
import { Publication } from '@/types/publication';

function getPublications(): Publication[] {
  return parseBibTeX(getBibtexContent('publications.bib'));
}

function getPublicationBySlug(slug: string): Publication | null {
  return getPublications().find((publication) => (publication.slug || publication.id) === slug) || null;
}

export function generateStaticParams() {
  return getPublications().map((publication) => ({ slug: publication.slug || publication.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  if (!publication) return {};
  const detail = getPublicationDetail(publication.doi, publication.id);
  const venue = publication.journal || publication.conference || 'Publication';
  return {
    title: publication.title,
    description: detail?.summary || `${publication.title}. ${venue}, ${publication.year}.`,
    alternates: { canonical: `/publications/${slug}/` },
  };
}

export default async function PublicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  if (!publication) notFound();
  return <PublicationDetail publication={publication} detail={getPublicationDetail(publication.doi, publication.id)} />;
}