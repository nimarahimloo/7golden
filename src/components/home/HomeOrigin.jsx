import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowUpLeft } from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';

const PILLARS = [
  {
    key: 'hazelnut',
    label: '۰۱',
    title: 'فندق',
    subtitle: 'مغز · خمیر · گرانول · پودر',
    text: 'مغز خام و برشته، خمیر، گرانول و پودر فندق برای شکلات، کرم فندق، کیک و بستنی.',
    image: '/banner/hazelnut-chopped-dark.webp',
    href: '/shop?category=hazelnut',
  },
  {
    key: 'pistachio',
    label: '۰۲',
    title: 'پسته',
    subtitle: 'مغز · خلال · پودر',
    text: 'مغز پسته، مغز پوست‌کنده، خلال و پودر برای شکلات، بستنی، قنادی و حلوا ارده.',
    image: '/banner/pistachio-kernels.webp',
    href: '/shop?category=pistachio',
  },
  {
    key: 'almond',
    label: '۰۳',
    title: 'بادام',
    subtitle: 'مغز · خلال · پرک',
    text: 'مغز، خلال و پرک بادام برای کیک، شیرینی، شکلات و دیگر خطوط تولید غذایی.',
    image: '/banner/tray-pistachio-almond.webp',
    href: '/shop?category=almond',
  },
];

/**
 * Section 03 — three product pillars as editorial image panels.
 * No icon cards, no corporate feature grid.
 */
export default function HomeOrigin({ section = {} }) {
  return (
    <section className="chapter home-origin" aria-label="سه گروه محصول هفت طلایی">
      <div className="chapter-shell">
        <StoryChapter
          index="03"
          eyebrow={section.badge_fa || 'محصولات هفت طلایی'}
          title={section.title_fa || 'سه ستون تولید'}
          lead={
            section.subtitle_fa ||
            'تمرکز مجموعه روی فندق، پسته و بادام است؛ هر گروه در شکل‌های مختلف فرآوری برای صنایع غذایی عرضه می‌شود.'
          }
          className="mb-10 md:mb-14"
        />

        <div className="home-pillars">
          {PILLARS.map((item, index) => (
            <Reveal key={item.key} delay={index * 90} className="home-pillar">
              <Link to={item.href} className="home-pillar-link group">
                <div className="home-pillar-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <span className="home-pillar-scrim" aria-hidden="true" />
                </div>

                <div className="home-pillar-body">
                  <span className="home-pillar-index">{item.label}</span>
                  <h3>{item.title}</h3>
                  <span className="home-pillar-sub">{item.subtitle}</span>
                  <p>{item.text}</p>
                  <span className="home-pillar-cta">
                    مشاهده گروه
                    <ArrowUpLeft size={15} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-14">
          <Link to="/shop" className="btn-gold">
            فهرست کامل محصولات
            <ChevronLeft size={16} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border px-6 py-2.5 text-sm transition-colors"
            style={{
              borderColor: 'var(--hairline)',
              color: 'var(--fg)',
              fontFamily: "'Kalameh', system-ui, sans-serif",
            }}
          >
            استعلام قیمت
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
