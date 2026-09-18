import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import SectionHeader from '@/components/SectionHeader';
import AwardsSection from '@/components/AwardsSection';
import ProductionCapacity from '@/components/ProductionCapacity';
import PageHero from '@/components/PageHero';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import { Image } from '@/components/ui/image';
import { Award, Leaf, Globe, Users } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function About() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey(k => k + 1);
  };

  const milestones = [
    { year: true ? '۱۳۷۷' : '1998', label: true ? 'تأسیس در قزوین' : 'Founded in Qazvin' },
    { year: true ? '۱۳۸۵' : '2006', label: true ? 'اولین صادرات' : 'First Export' },
    { year: true ? '۱۳۹۰' : '2011', label: true ? 'گسترش به تهران' : 'Expansion to Tehran' },
    { year: true ? '۱۳۹۶' : '2017', label: true ? 'ثبت شرکت رسمی' : 'Official Incorporation' },
    { year: true ? '۱۴۰۰' : '2021', label: true ? 'صادرات به ۱۵ کشور' : 'Exports to 15 Countries' },
  ];

  const values = [
    { icon: Leaf, title: true ? 'کیفیت ارگانیک' : 'Organic Quality', desc: true ? 'محصولاتمان را مستقیم از کشاورزان متعهد تأمین می‌کنیم.' : 'We source directly from committed farmers.' },
    { icon: Award, title: true ? 'استانداردهای بین‌المللی' : 'International Standards', desc: true ? 'تمام محصولات صادراتی مطابق با الزامات اتحادیه اروپا.' : 'All export products meet EU requirements.' },
    { icon: Globe, title: true ? 'دسترس جهانی' : 'Global Reach', desc: true ? 'ارسال به امارات، قطر، عمان، عراق و کشورهای اروپایی.' : 'Shipping to UAE, Qatar, Oman, Iraq and European countries.' },
    { icon: Users, title: true ? 'تیم متعهد' : 'Committed Team', desc: true ? 'بیش از ۵۰ متخصص جوان و متعهد.' : 'Over 50 young and dedicated professionals.' },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={true ? `درباره ${SITE_SEO.siteNameFA} — تولیدکننده و صادرکننده فندق، پسته و بادام` : `About ${SITE_SEO.siteNameEN} — Producer & Exporter`}
        description={true ? 'از سال ۱۳۷۷، تولیدکننده و صادرکننده مغز فندق، خلال پسته و مغز بادام برای صنایع شکلات، قنادی و بستنی — تأمین مستقیم از باغستان‌های قزوین.' : 'Since 1998, producer and exporter of hazelnut kernels, pistachio slices and almond kernels — sourced directly from Qazvin orchards.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/about`}
      />

      <PullToRefresh onRefresh={handleRefresh}>
      {/* Hero */}
      <div className="relative">
        <PageHero
          image="https://7golden.co/wp-content/uploads/2022/09/about-p-2.png"
          title={t('about_title')}
          subtitle={t('about_sub')}
          badge={true ? 'داستان ما' : 'Our Story'}
        />
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
          <BackButton to="/" className="text-white/80 hover:text-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

        {/* Story */}
        <section className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="font-subheading text-xs uppercase block mb-3" style={{ color: 'var(--accent)', fontFamily: true ? 'Kalameh, serif' : 'Georgia, serif' }}>
              {true ? 'داستان ما' : 'Our Story'}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--fg)', fontFamily: true ? 'Peyda, serif' : 'Georgia, serif' }}>
              {true ? 'از کارگاهی کوچک تا رهبر صنعت' : 'From Small Workshop to Industry Leader'}
            </h2>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>
              {true
                ? 'این مجموعه فعالیت جدی خود را در سال ۱۳۷۷ در کارگاهی بسیار کوچک آغاز نمود و به تدریج با کسب تجربیات بیشتر و بهره‌گیری از دانش و توانمندی نیروهای جوان و متعهد و پس از عبور از فراز و نشیب‌های فراوان موفق به کسب جایگاه قابل توجهی در زمینه تولید و فرآوری فندق و پسته و خشکبار شد.'
                : '7Golden began its journey in 1998 in a small workshop in Qazvin. Over the years, through accumulated expertise and the dedication of young, committed professionals, the company overcame numerous challenges to become a prominent name in hazelnut, pistachio, and dried fruit processing.'}
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {true
                ? 'در حال حاضر با کشورهای امارات، قطر، عمان، عراق، افغانستان و بصورت واسطه‌ای برخی از کشورهای اروپایی همکاری دارد. بالای ۵ درصد سود به کشاورز می‌رسد و با حذف واسطه می‌توانیم محصول با کیفیت و قیمت مناسب‌تری عرضه کنیم.'
                : 'Today, 7Golden exports to the UAE, Qatar, Oman, Iraq, Afghanistan, and indirectly to several European markets. By eliminating middlemen, we ensure farmers receive fair value while customers enjoy premium quality at competitive prices.'}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <Image
                src="https://7golden.co/wp-content/uploads/2022/09/about-p-3.png"
                alt="Our facility"
                className="w-full h-full object-cover"
                fittingType="fill"
              />
            </div>
          </AnimatedSection>
        </section>

        {/* Gallery */}
        <section className="pb-16">
          <div className="grid grid-cols-2 gap-4">
            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <Image src="https://7golden.co/wp-content/uploads/2022/09/about-p-1.png" alt="7Golden facility" className="w-full h-full object-cover" fittingType="fill" />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <Image src="https://7golden.co/wp-content/uploads/2022/09/about-p-4.png" alt="7Golden production" className="w-full h-full object-cover" fittingType="fill" />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Timeline */}
        <section className="pb-16">
          <AnimatedSection>
            <SectionHeader title={true ? 'خط زمانی ما' : 'Our Timeline'} subtitle={true ? 'سفر هفت‌طلایی' : '7Golden Journey'} />
          </AnimatedSection>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="absolute top-5 left-0 right-0 h-px hidden md:block" style={{ background: 'var(--border)' }} />
            {milestones.map((m, i) => (
              <AnimatedSection key={i} delay={i * 100} className="relative flex flex-col items-center text-center z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-body font-extrabold text-xs mb-3"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {i + 1}
                </div>
                <span className="font-heading font-extrabold text-sm block" style={{ color: 'var(--accent)', fontFamily: true ? 'Peyda, serif' : 'Georgia, serif' }}>{m.year}</span>
                <span className="font-body text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>{m.label}</span>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="pb-20">
          <AnimatedSection>
            <SectionHeader title={true ? 'ارزش‌های ما' : 'Our Values'} subtitle={true ? 'چرا هفت‌طلایی؟' : 'Why 7Golden?'} />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="p-6 rounded-3xl h-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--accent)', color: '#fff' }}>
                    <v.icon size={20} />
                  </div>
                  <h3 className="font-body font-extrabold text-sm mb-2" style={{ color: 'var(--fg)', fontFamily: true ? 'Peyda, serif' : 'Georgia, serif' }}>{v.title}</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </div>

      {/* Production & processing capacity — scale for business buyers */}
      <ProductionCapacity />

      {/* Licenses & Awards — dynamic */}
      <AwardsSection key={refreshKey} />
      </PullToRefresh>
    </div>
  );
}