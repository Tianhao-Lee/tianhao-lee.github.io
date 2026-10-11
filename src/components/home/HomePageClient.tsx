'use client';

import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import News, { type NewsItem } from '@/components/home/News';
import SelectedPublications from '@/components/home/SelectedPublications';
import ContactCta from '@/components/home/ContactCta';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import { Publication } from '@/types/publication';
import type { SiteConfig } from '@/lib/config';
import { CardPageConfig, PublicationPageConfig, TextPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
}

type PageData =
  | { type: 'about'; id: string; sections: SectionConfig[] }
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; id: string; config: TextPageConfig; content: string }
  | { type: 'card'; id: string; config: CardPageConfig };

export interface HomePageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  enableOnePageMode?: boolean;
  researchInterests?: string[];
  pagesToShow: PageData[];
}

interface HomePageClientProps {
  dataByLocale: Record<string, HomePageLocaleData>;
  defaultLocale: string;
}

/**
 * Layout follows the Apple product-page rhythm: a centred hero, centred body
 * sections with generous vertical spacing, then a dark closing band.
 */
export default function HomePageClient({ dataByLocale, defaultLocale }: HomePageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden">
        <div className="aurora" />
      </div>

      <div className="relative pt-24 lg:pt-28">
        <Hero author={data.author} researchInterests={data.researchInterests} />

        <div className="mx-auto mt-20 max-w-6xl space-y-24 px-5 pb-24 sm:px-8 lg:mt-28 lg:space-y-32">
          {data.pagesToShow.map((page) => (
            <div key={page.id} id={page.id} className="scroll-mt-28 space-y-24 lg:space-y-32">
              {page.type === 'about' &&
                page.sections.map((section: SectionConfig) => {
                  switch (section.type) {
                    case 'markdown':
                      return (
                        <div key={section.id} className="mx-auto max-w-3xl">
                          <About content={section.content || ''} title={section.title} />
                        </div>
                      );
                    case 'publications':
                      return (
                        <div key={section.id} className="mx-auto max-w-5xl">
                          <SelectedPublications
                            publications={section.publications || []}
                            title={section.title}
                            enableOnePageMode={data.enableOnePageMode}
                          />
                        </div>
                      );
                    case 'list':
                      return (
                        <div key={section.id} className="mx-auto max-w-3xl">
                          <News items={section.items || []} title={section.title} />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              {page.type === 'publication' && (
                <PublicationsList config={page.config} publications={page.publications} />
              )}
              {page.type === 'text' && (
                <div className="mx-auto max-w-3xl">
                  <TextPage config={page.config} content={page.content} />
                </div>
              )}
              {page.type === 'card' && <CardPage config={page.config} />}
            </div>
          ))}

          <div className="mx-auto max-w-5xl">
            <ContactCta social={data.social} />
          </div>
        </div>
      </div>
    </div>
  );
}
