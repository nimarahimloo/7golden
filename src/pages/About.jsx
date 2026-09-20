import React, { useState } from 'react';
import { t } from '@/lib/i18n';
import AwardsSection from '@/components/AwardsSection';
import ProductionCapacity from '@/components/ProductionCapacity';
import PageHero from '@/components/PageHero';
import { Award, Leaf, Globe, Users } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import DepthParallax from '@/components/story/DepthParallax';
import Marquee from '@/components/story/Marquee';

export default function About() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey(k => k + 1);
  };

  const milestones = [
    { year: '۱۳۷۷', label: 'تأسیس در قزوین' },
    { year: '۱۳۸۵', label: 'اولین صادرات' },
    { year: '۱۳۹۰', label: 'گسترش به تهران' },
    { year: '۱۳۹۶', label: 'ثبت شرکت رسمی' },
    { year: '۱۴۰۰', label: 'صادرات به ۱۵ کشور' },
  ];

  const values = [
    { icon: Leaf, title: 'کیفیت ارگانیک', desc: 'محصولاتمان را مستقیم از کشاورزان متعهد تأمین می‌کنیم.' },
    { icon: Award, title: 'استانداردهای بین‌المللی', desc: 'تمام محصولات صادراتی مطابق با الزامات اتحادیه اروپا.' },
    { icon: Globe, title: 'دسترس جهانی', desc: 'ارسال به امارات، قطر، عمان، عراق و کشورهای اروپایی.' },
    { icon: Users, title: 'تیم متعهد', desc: 'بیش از ۵۰ متخصص جوان و متعهد.' },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={`درباره ${SITE_SEO.siteNameFA} — تولیدکننده و صادرکننده فندق، پسته و بادام`}
        description="از سال ۱۳۷۷، تولیدکننده و صادرکننده مغز فندق، خلال پسته و مغز بادام برای صنایع شکلات، قنادی و بستنی — تأمین مستقیم از باغستان‌های قزوین."
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/about`}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        {/* Hero */}
        <div className="relative">
          <PageHero
            image="/banner/Hero-main.jpg"
            title={t('about_title')}
            subtitle={t('about_sub')}
            badge="داستان ما"
          />
          <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
            <BackButton to="/" className="text-white/80 hover:text-white" />
          </div>
        </div>

        {/* ===== CHAPTER 01 — the story ===== */}
        <section className="chapter">
          <div className="chapter-shell grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <StoryChapter
                index="01"
                eyebrow="OUR STORY"
                title="از کارگاهی کوچک تا رهبر صنعت"
              />
              <Reveal delay={140}>
                <p className="font-body text-sm leading-relaxed mt-6 mb-4" style={{ color: 'var(--fg-muted)' }}>
                  این مجموعه فعالیت جدی خود را در سال ۱۳۷۷ در کارگاهی بسیار کوچک آغاز نمود و به تدریج با کسب تجربیات بیشتر و بهره‌گیری از دانش و توانمندی نیروهای جوان و متعهد و پس از عبور از فراز و نشیب‌های فراوان موفق به کسب جایگاه قابل توجهی در زمینه تولید و فرآوری فندق و پسته و خشکبار شد.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  در حال حاضر با کشورهای امارات، قطر، عمان، عراق، افغانستان و بصورت واسطه‌ای برخی از کشورهای اروپایی همکاری دارد. بالای ۵ درصد سود به کشاورز می‌رسد و با حذف واسطه می‌توانیم محصول با کیفیت و قیمت مناسب‌تری عرضه کنیم.
                </p>
              </Reveal>
            </div>

            <ParallaxMedia
              src="/gallery/AQ8A1499AQ8A1499.JPG"
              alt="7Golden facility"
              ratio="aspect-[4/3]"
              className="rounded-3xl"
            />
          </div>
        </section>

        {/* ===== CHAPTER 02 — timeline ===== */}
        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter
              index="02"
              eyebrow="JOURNEY"
              title="خط زمانی هفت‌طلایی"
              className="mb-14"
            />

            <div className="relative">
              {/* gold rail */}
              <div
                className="absolute top-0 bottom-0 w-px hidden md:block"
                style={{ right: '6.5rem', background: 'linear-gradient(to bottom, transparent, var(--hairline-strong) 12%, var(--hairline-strong) 88%, transparent)' }}
              />
              <div className="flex flex-col gap-10 md:gap-14">
                {milestones.map((m, i) => (
                  <Reveal key={m.year} delay={i * 90} variant="left">
                    <div className="flex items-center gap-6 md:gap-10">
                      <span className="outline-num text-3xl md:text-5xl leading-none flex-shrink-0" style={{ minWidth: '5rem', textAlign: 'left' }}>
                        {m.year}
                      </span>
                      <span className="hidden md:block w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--gold-2)', boxShadow: '0 0 14px rgba(227,194,99,0.7)' }} />
                      <span className="font-body text-sm md:text-base" style={{ color: 'var(--fg)' }}>{m.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 03 — gallery (cinematic depth parallax) ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <DepthParallax
              src="/gallery/AQ8A1505AQ8A1505.JPG"
              alt="7Golden production line"
              ratio="aspect-[4/3] md:aspect-[21/9]"
              className="rounded-3xl"
            >
              <div>
                <span className="eyebrow block mb-2">PRODUCTION</span>
                <span className="display-md" style={{ color: 'var(--ink)' }}>خطوط فرآوری صنعتی</span>
              </div>
            </DepthParallax>
          </div>
        </section>

        <section className="chapter pt-0">
          <div className="chapter-shell grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <ParallaxMedia src="/gallery/AQ8A1524AQ8A1524.JPG" alt="7Golden packaging" ratio="aspect-[4/3]" className="rounded-3xl" speed={0.2} />
            <ParallaxMedia src="/gallery/AQ8A1516AQ8A1516.JPG" alt="7Golden processing" ratio="aspect-[4/3]" className="rounded-3xl" speed={0.18} />
          </div>
        </section>

        {/* ===== CHAPTER 04 — values ===== */}
        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter
              index="03"
              eyebrow="VALUES"
              title="چرا هفت‌طلایی؟"
              className="mb-12"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 90}>
                  <div className="gold-frame panel p-6 rounded-3xl h-full">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
                    >
                      <v.icon size={20} style={{ color: 'var(--gold-2)' }} />
                    </div>
                    <h3 className="display-sm mb-2" style={{ color: 'var(--fg)' }}>{v.title}</h3>
                    <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{v.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Export markets band — synced with home page */}
        <Marquee items={['امارات', 'قطر', 'عمان', 'عراق', 'افغانستان', 'ترکیه', 'آلمان', 'هلند']} />

        {/* Production & processing capacity — scale for business buyers */}
        <ProductionCapacity />

        {/* Licenses & Awards — dynamic */}
        <AwardsSection key={refreshKey} />
      </PullToRefresh>
    </div>
  );
}
