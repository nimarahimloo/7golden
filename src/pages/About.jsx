import { useState } from 'react';
import { Factory, History, PackageCheck, Utensils } from 'lucide-react';
import AwardsSection from '@/components/AwardsSection';
import ProductionCapacity from '@/components/ProductionCapacity';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import { usePageHero } from '@/lib/usePageHero';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import MaskText from '@/components/story/MaskText';

const ABOUT_HERO_COPY = {
  title: 'از خشکبار محمدی تا هفت طلایی',
  subtitle: 'پیشینه خانوادگی در بازار قزوین از سال ۱۳۳۵؛ آغاز فرآوری خشکبار در سال ۱۳۷۷ و ثبت شرکت در سال ۱۳۹۶.',
  badge: 'درباره هفت طلایی',
};

const MILESTONES = [
  { year: '۱۳۳۵', label: 'آغاز فعالیت خانوادگی خشکبار محمدی در بازار قزوین' },
  { year: '۱۳۷۷', label: 'شروع فرآوری خشکبار در کارگاهی کوچک در قزوین' },
  { year: '۱۳۹۶', label: 'ثبت رسمی شرکت خشکبار و بسته‌بندی هفت طلایی' },
  { year: 'امروز', label: 'تمرکز بر فرآورده‌های فندق، پسته و بادام برای صنایع غذایی' },
];

const AREAS = [
  { icon: History, title: 'پیشینه در بازار قزوین', desc: 'فعالیت خانوادگی خشکبار محمدی از سال ۱۳۳۵ در بازار قزوین آغاز شد؛ پیشینه‌ای که بخشی از داستان شکل‌گیری هفت طلایی است.' },
  { icon: Factory, title: 'فرآوری خشکبار', desc: 'فعالیت فرآوری در سال ۱۳۷۷ با کارگاهی کوچک در قزوین آغاز شد و به محور اصلی کار هفت طلایی تبدیل شد.' },
  { icon: PackageCheck, title: 'سه گروه اصلی محصول', desc: 'فندق، پسته و بادام؛ از مغز و خلال تا شکل‌های دیگری مانند پرک، خمیر، گرانول و پودر.' },
  { icon: Utensils, title: 'کاربرد در صنایع غذایی', desc: 'محصولات مجموعه در تهیه شکلات، بستنی، شیرینی، کیک و دیگر فرآورده‌های غذایی کاربرد دارند.' },
];

export default function About() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = async () => setRefreshKey((key) => key + 1);

  const { hero } = usePageHero('about', {
    image: '/banner/pistachio-dishes-teal.webp',
    ...ABOUT_HERO_COPY,
  });

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title="درباره هفت طلایی | تاریخچه و محصولات"
        description="هفت طلایی در قزوین، فعال در زمینه فرآوری مغز فندق، پسته و بادام برای صنایع غذایی است. پیشینه خانوادگی خشکبار محمدی به سال ۱۳۳۵، آغاز فرآوری به سال ۱۳۷۷ و ثبت شرکت به سال ۱۳۹۶ بازمی‌گردد."
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/about`}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative">
          <DynamicHeroSlider
            pageKey="about"
            fallback={{
              image: hero?.image || '/banner/pistachio-dishes-teal.webp',
              ...ABOUT_HERO_COPY,
            }}
          />
        </div>

        <section className="chapter">
          <div className="chapter-shell grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <StoryChapter index="۰۱" eyebrow="تاریخچه هفت طلایی" title="از بازار خشکبار قزوین تا فرآوری تخصصی" />
              <Reveal delay={140}>
                <p className="font-body text-sm leading-relaxed mt-6 mb-4" style={{ color: 'var(--fg-muted)' }}>
                  داستان این مجموعه دو نقطه مهم دارد: فعالیت خانوادگی خشکبار محمدی در بازار قزوین که از سال ۱۳۳۵ آغاز شد، و شروع فرآوری خشکبار در کارگاهی کوچک در سال ۱۳۷۷. این دو تاریخ، پیشینه خانوادگی و آغاز مسیر فرآوری هفت طلایی را از هم متمایز می‌کنند.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  شرکت خشکبار و بسته‌بندی هفت طلایی در سال ۱۳۹۶ به‌صورت رسمی ثبت شد. امروز تمرکز مجموعه بر فرآوری فندق، پسته و بادام و عرضه شکل‌های مختلف این محصولات برای استفاده در صنایع غذایی است.
                </p>
              </Reveal>
            </div>
            <ParallaxMedia src="/gallery/AQ8A1499AQ8A1499.webp" alt="محیط کاری هفت طلایی در قزوین" ratio="aspect-[4/3]" className="rounded-3xl" />
          </div>
        </section>

        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter index="۰۲" eyebrow="مسیر فعالیت" title="سه تاریخ در مسیر هفت طلایی" className="mb-14" />
            <div className="relative">
              <div
                className="absolute top-0 bottom-0 w-px hidden md:block"
                style={{ right: '8.75rem', background: 'linear-gradient(to bottom, transparent, var(--hairline-strong) 12%, var(--hairline-strong) 88%, transparent)' }}
              />
              <div className="flex flex-col gap-10 md:gap-14">
                {MILESTONES.map((milestone, index) => (
                  <Reveal key={`${milestone.year}-${index}`} delay={index * 90} variant="left">
                    <div className="flex items-center gap-6 md:gap-10">
                      <span className="outline-num text-3xl md:text-4xl leading-none flex-shrink-0" style={{ width: '6rem', textAlign: 'left', overflow: 'visible' }}>
                        {milestone.year}
                      </span>
                      <span className="hidden md:block w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--gold-2)', boxShadow: '0 0 14px rgba(212,175,55,0.7)' }} />
                      <span className="font-body text-sm md:text-base leading-relaxed" style={{ color: 'var(--fg)' }}>{milestone.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="chapter">
          <div className="chapter-shell max-w-4xl">
            <StoryChapter index="۰۳" eyebrow="محصولات" title="فندق، پسته و بادام؛ محور فعالیت ما" />
            <div className="flex flex-col gap-7 mt-9">
              <Reveal delay={80}>
                <p className="font-body text-base md:text-lg leading-loose" style={{ color: 'var(--fg)' }}>
                  محصولات فندق شامل مغز خام و برشته، خمیر، گرانول و پودر فندق است؛ شکل‌هایی که در تهیه شکلات، کرم فندق، کیک و بستنی استفاده می‌شوند.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="font-body text-base md:text-lg leading-loose" style={{ color: 'var(--fg-muted)' }}>
                  در گروه پسته، مغز پسته، مغز پوست‌کنده، خلال و پودر قرار دارند. این محصولات در قنادی، شکلات، بستنی و فرآورده‌هایی مانند حلوا ارده کاربرد دارند.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="font-body text-base md:text-lg leading-loose" style={{ color: 'var(--fg-muted)' }}>
                  محصولات بادام نیز در شکل‌هایی مانند مغز، خلال و پرک عرضه می‌شوند. انتخاب هر شکل به نوع مصرف و محصول نهایی تولیدکننده بستگی دارد.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <MaskText image="/gallery/AQ8A1628AQ8A1628.webp" text="QAZVIN" eyebrow="هفت طلایی · قزوین" />

        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter index="۰۴" eyebrow="حوزه فعالیت" title="آنچه هفت طلایی انجام می‌دهد" className="mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {AREAS.map((area, index) => (
                <Reveal key={area.title} delay={index * 90}>
                  <div className="gold-frame panel p-6 rounded-3xl h-full">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--hairline-strong)' }}>
                      <area.icon size={20} style={{ color: 'var(--gold-2)' }} />
                    </div>
                    <h3 className="display-sm mb-3" style={{ color: 'var(--fg)' }}>{area.title}</h3>
                    <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{area.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ProductionCapacity />
        <AwardsSection key={refreshKey} />
      </PullToRefresh>
    </div>
  );
}
