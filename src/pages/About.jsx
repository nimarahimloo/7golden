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
  subtitle:
    'فعالیت خانوادگی در بازار قزوین از سال ۱۳۳۵؛ آغاز فرآوری خشکبار در سال ۱۳۷۷ و ثبت رسمی شرکت در سال ۱۳۹۶.',
  badge: 'درباره هفت طلایی',
};

// const MILESTONES = [
//   { year: '۱۳۳۵', label: 'آغاز فعالیت خانوادگی خشکبار محمدی در بازار قزوین' },
//   { year: '۱۳۷۷', label: 'شروع فرآوری خشکبار در کارگاهی کوچک در قزوین' },
//   { year: '۱۳۹۶', label: 'ثبت رسمی شرکت خشکبار و بسته‌بندی هفت طلایی' },
//   { year: 'امروز', label: 'فرآوری محصولات فندق، پسته و بادام برای صنایع غذایی' },
// ];

const AREAS = [
  {
    icon: History,
    title: 'پیشینه در بازار قزوین',
    desc: 'داستان هفت طلایی به فعالیت خانوادگی خشکبار محمدی برمی‌گردد؛ فعالیتی که از سال ۱۳۳۵ در بازار قزوین آغاز شد.',
  },
  {
    icon: Factory,
    title: 'تجربه در فرآوری خشکبار',
    desc: 'فرآوری خشکبار از سال ۱۳۷۷، با یک کارگاه کوچک در قزوین شروع شد و به بخش اصلی فعالیت مجموعه تبدیل شد.',
  },
  {
    icon: PackageCheck,
    title: 'محصولات فندق، پسته و بادام',
    desc: 'از مغز این محصولات تا شکل‌های فرآوری‌شده‌ای مثل خلال، پرک، گرانول، خمیر و پودر را عرضه می‌کنیم.',
  },
  {
    icon: Utensils,
    title: 'برای تولیدکنندگان صنایع غذایی',
    desc: 'محصولات ما در تهیه شکلات، کرم‌های مغزی، بستنی، شیرینی، کیک و دیگر فرآورده‌های غذایی استفاده می‌شوند.',
  },
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
        description="هفت طلایی، مجموعه فرآوری خشکبار در قزوین، با پیشینه خانوادگی خشکبار محمدی از سال ۱۳۳۵، آغاز فرآوری در سال ۱۳۷۷ و ثبت رسمی شرکت در سال ۱۳۹۶ است. فعالیت مجموعه بر فرآوری فندق، پسته و بادام برای صنایع غذایی متمرکز است."
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
              <StoryChapter
                index="۰۱"
                eyebrow="تاریخچه هفت طلایی"
                title="از بازار خشکبار قزوین تا فرآوری تخصصی"
              />

              <Reveal delay={140}>
                <p
                  className="font-body text-sm leading-relaxed mt-6 mb-4"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  داستان هفت طلایی از فعالیت خانوادگی خشکبار محمدی در بازار قزوین شروع می‌شود؛
                  فعالیتی که از سال ۱۳۳۵ ادامه داشته است. سال‌ها بعد، در سال ۱۳۷۷، فرآوری
                  خشکبار هم با یک کارگاه کوچک در قزوین آغاز شد و تجربه مجموعه در این زمینه
                  گسترش پیدا کرد.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  شرکت خشکبار و بسته‌بندی هفت طلایی در سال ۱۳۹۶ به‌صورت رسمی ثبت شد.
                  امروز تمرکز ما بر فرآوری فندق، پسته و بادام و آماده‌سازی این محصولات
                  در شکل‌های مختلف برای استفاده تولیدکنندگان صنایع غذایی است.
                </p>
              </Reveal>
            </div>

            <ParallaxMedia
              src="/hazelnut-bowl.webp"
              alt="مغز فندق؛ یکی از محصولات فرآوری‌شده هفت طلایی"
              ratio="aspect-[4/3]"
              className="rounded-3xl"
            />
          </div>
        </section>

        {/* <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
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
        </section> */}

        <section className="chapter">
          <div className="chapter-shell max-w-4xl">
            <StoryChapter
              index="۰۳"
              eyebrow="محصولات"
              title="فندق، پسته و بادام برای تولیدکنندگان صنایع غذایی"
            />

            <div className="flex flex-col gap-7 mt-9">
              <p
                className="font-body text-base md:text-lg leading-loose"
                style={{ color: 'var(--fg-white)' }}
              >
                فندق، پسته و بادام از مواد اولیه پرکاربرد در صنایع غذایی هستند. البته
                هر تولیدکننده با توجه به محصولی که می‌سازد، به شکل متفاوتی از این مغزها
                نیاز دارد؛ گاهی مغز کامل، گاهی خلال و پرک و گاهی هم پودر، گرانول یا خمیر.
                به همین دلیل، ما این محصولات را در شکل‌های مختلف فرآوری و عرضه می‌کنیم.

              </p>

              <p
                className="font-body text-base md:text-lg leading-loose"
                style={{ color: 'var(--fg-white)' }}
              >
                در گروه فندق، محصولاتی مثل مغز فندق خام و رست‌شده، خمیر فندق، گرانول و
                پودر فندق قرار دارند. این فرآورده‌ها در تولید شکلات، کرم فندق، انواع کیک
                و شیرینی، بستنی و دیگر محصولات قنادی به کار می‌روند. نوع محصول موردنیاز
                به روش تولید و بافت و طعم موردنظر در محصول نهایی بستگی دارد.
              </p>

              <p
                className="font-body text-base md:text-lg leading-loose"
                style={{ color: 'var(--fg-white)' }}
              >
                محصولات پسته نیز شامل مغز پسته، مغز پسته پوست‌گرفته، خلال پسته و پودر
                پسته می‌شوند. خلال و پودر پسته برای تهیه و تزئین شیرینی، کیک و دسر کاربرد
                دارند و مغز پسته هم در تولید شکلات، بستنی و دیگر فرآورده‌های غذایی استفاده
                می‌شود. انتخاب هرکدام به نوع مصرف و مشخصات موردنیاز تولیدکننده بستگی دارد.
              </p>

              <p
                className="font-body text-base md:text-lg leading-loose"
                style={{ color: 'var(--fg-white)' }}
              >
                در گروه بادام، مغز بادام درختی، خلال بادام، پرک بادام و پودر بادام را
                عرضه می‌کنیم. این محصولات در شیرینی‌پزی، تولید کیک و بیسکویت، شکلات و
                آماده‌سازی انواع دسر استفاده می‌شوند. شکل و اندازه برش بادام می‌تواند
                بسته به کاربرد آن در فرایند تولید اهمیت داشته باشد.
              </p>

              <p
                className="font-body text-base md:text-lg leading-loose"
                style={{ color: 'var(--fg-white)' }}
              >
                هدف ما این است که تولیدکنندگان صنایع غذایی بتوانند مواد اولیه موردنیاز
                خود را در شکل مناسب تهیه کنند. شناخت کاربرد هر محصول و انتخاب نوع فرآوری
                متناسب با فرایند تولید، به آماده‌سازی محصول نهایی کمک می‌کند.
              </p>
            </div>
          </div>
        </section>

        <MaskText
          image="/product/Untitled-10.webp"
          text="7Golden"
          eyebrow="هفت طلایی · قزوین"
        />

        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter
              index="۰۴"
              eyebrow="حوزه فعالیت"
              title="آنچه هفت طلایی انجام می‌دهد"
              className="mb-12"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {AREAS.map((area, index) => (
                <Reveal key={area.title} delay={index * 90}>
                  <div className="gold-frame panel p-6 rounded-3xl h-full">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{
                        background: 'rgba(212,175,55,0.1)',
                        border: '1px solid var(--hairline-strong)',
                      }}
                    >
                      <area.icon size={20} style={{ color: 'var(--gold-2)' }} />
                    </div>

                    <h3 className="display-sm mb-3" style={{ color: 'var(--fg)' }}>
                      {area.title}
                    </h3>

                    <p
                      className="font-body text-xs leading-relaxed"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {area.desc}
                    </p>
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
