import React, { useState } from 'react';
import { t } from '@/lib/i18n';
import AwardsSection from '@/components/AwardsSection';
import ProductionCapacity from '@/components/ProductionCapacity';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import { usePageHero } from '@/lib/usePageHero';
import { Award, Leaf, Globe, Users } from 'lucide-react';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import DepthParallax from '@/components/story/DepthParallax';
import MaskText from '@/components/story/MaskText';

export default function About() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey(k => k + 1);
  };

  const { hero } = usePageHero('about', {
    image: '/banner/pistachio-dishes-teal.webp',
    title: t('about_title'),
    subtitle: t('about_sub'),
    badge: 'داستان ما',
  });

  const milestones = [
    { year: '۱۳۷۷', label: 'آغاز کار در کارگاهی کوچک در قزوین' },
    { year: '۱۳۹۶', label: 'ثبت رسمی شرکت خشکبار و بسته‌بندی هفت طلایی' },
    { year: '۱۳۹۶', label: 'تأمین مستقیم از کشاورز از طریق بنکداری خشکبار محمدی' },
    { year: 'امروز', label: 'صادرات به امارات، قطر، عمان، عراق و افغانستان' },
  ];

  const values = [
    { icon: Leaf, title: 'تأمین مستقیم از باغ', desc: 'از سال ۱۳۹۶ مواد اولیه را از طریق بنکداری خانوادگی خودمان — خشکبار محمدی با بیش از صد سال قدمت — بدون واسطه از کشاورز می‌خریم.' },
    { icon: Award, title: 'کنترل کیفی پیش از ارسال', desc: 'رطوبت، رنگ و سلامت هر محموله را می‌سنجیم و اسناد آزمایشگاهی را همراه بار می‌فرستیم.' },
    { icon: Globe, title: 'بازارهای صادراتی', desc: 'محصول ما به امارات، قطر، عمان، عراق و افغانستان می‌رود و از طریق بازرگانان به برخی کشورهای اروپایی هم می‌رسد.' },
    { icon: Users, title: 'سود بیشتر برای کشاورز', desc: 'با حذف واسطه، بیش از ۵٪ بیشتر به سود کشاورز می‌رسد و شما محصول تازه‌تر و قیمت منصفانه‌تری می‌گیرید.' },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={`درباره ${SITE_SEO.siteNameFA} — تولیدکننده و صادرکننده فندق، پسته و بادام`}
        description="خشکبار هفت طلایی، تولیدکننده و فرآوری‌کننده مغز فندق، خلال پسته و بادام — از سال ۱۳۷۷ در قزوین؛ تأمین مستقیم از کشاورز و صادرات به امارات، قطر، عمان، عراق و افغانستان."
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/about`}
      />

      <PullToRefresh onRefresh={handleRefresh}>
        {/* Hero */}
        <div className="relative">
          <DynamicHeroSlider pageKey="about" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
        </div>

        {/* ===== CHAPTER 01 — the story ===== */}
        <section className="chapter">
          <div className="chapter-shell grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <StoryChapter
                index="01"
                eyebrow="داستان ما"
                title="از یک کارگاه کوچک تا یکی از پیشروان صنعت"
              />
              <Reveal delay={140}>
                <p className="font-body text-sm leading-relaxed mt-6 mb-4" style={{ color: 'var(--fg-muted)' }}>
                  فعالیت جدی ما از سال ۱۳۷۷ در کارگاهی کوچک در قزوین شروع شد. کم‌کم تجربه جمع کردیم، به نیروهای جوان و متعهد تکیه کردیم و پس از فراز و نشیب‌های زیاد، جایگاه قابل توجهی در تولید و فرآوری فندق، پسته و خشکبار به دست آوردیم. در سال ۱۳۹۶ شرکت خشکبار و بسته‌بندی هفت طلایی را ثبت کردیم و کار را صنعتی‌تر ادامه دادیم.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  از سال ۱۳۹۶ مواد اولیه را از طریق بنکداری خانوادگی خودمان — خشکبار محمدی با بیش از صد سال قدمت — مستقیم و بدون واسطه از کشاورز می‌خریم. حذف واسطه یعنی سود بیشتر برای کشاورز و محصول تازه‌تر با قیمت منصفانه‌تر برای شما. امروز محصول ما به امارات، قطر، عمان، عراق و افغانستان صادر می‌شود.
                </p>
              </Reveal>
            </div>

            <ParallaxMedia
              src="/gallery/AQ8A1499AQ8A1499.webp"
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
              eyebrow="مسیر ما"
              title="از کجا شروع کردیم و کجا رسیدیم"
              className="mb-14"
            />

            <div className="relative">
              {/* gold rail — aligned with the dot column */}
              <div
                className="absolute top-0 bottom-0 w-px hidden md:block"
                style={{ right: '8.75rem', background: 'linear-gradient(to bottom, transparent, var(--hairline-strong) 12%, var(--hairline-strong) 88%, transparent)' }}
              />
              <div className="flex flex-col gap-10 md:gap-14">
                {milestones.map((m, i) => (
                  <Reveal key={m.year} delay={i * 90} variant="left">
                    <div className="flex items-center gap-6 md:gap-10">
                      <span className="outline-num text-3xl md:text-4xl leading-none flex-shrink-0" style={{ width: '6rem', textAlign: 'left', overflow: 'visible' }}>
                        {m.year}
                      </span>
                      <span className="hidden md:block w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--gold-2)', boxShadow: '0 0 14px rgba(212,175,55,0.7)' }} />
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
              src="/gallery/AQ8A1640AQ8A1640.webp"
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
            <ParallaxMedia src="/gallery/AQ8A1748AQ8A1748.webp" alt="7Golden packaging" ratio="aspect-[4/3]" className="rounded-3xl" speed={0.2} />
            <ParallaxMedia src="/gallery/AQ8A1665AQ8A1665.webp" alt="7Golden processing" ratio="aspect-[4/3]" className="rounded-3xl" speed={0.18} />
          </div>
        </section>

        {/* ===== SIGNATURE BAND — image-filled word ===== */}
        <MaskText
          image="/gallery/AQ8A1628AQ8A1628.webp"
          text="QAZVIN"
          eyebrow="EST. ۱۳۷۷ · قزوین"
        />

        {/* ===== CHAPTER 04 — values ===== */}
        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter
              index="03"
              eyebrow="ارزش‌های ما"
              title="چرا کارخانه‌ها به هفت‌طلایی اعتماد می‌کنند؟"
              className="mb-12"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 90}>
                  <div className="gold-frame panel p-6 rounded-3xl h-full">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--hairline-strong)' }}
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

        {/* Production & processing capacity — scale for business buyers */}
        <ProductionCapacity />

        {/* Licenses & Awards — dynamic */}
        <AwardsSection key={refreshKey} />
      </PullToRefresh>
    </div>
  );
}
