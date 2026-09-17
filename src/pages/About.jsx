import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import SectionHeader from '@/components/SectionHeader';
import AwardsSection from '@/components/AwardsSection';
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
  const { lang, dir } = useApp();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey(k => k + 1);
  };

  const milestones = [
    { year: lang === 'fa' ? '۱۳۷۷' : '1998', label: lang === 'fa' ? 'تأسیس در قزوین' : 'Founded in Qazvin' },
    { year: lang === 'fa' ? '۱۳۸۵' : '2006', label: lang === 'fa' ? 'اولین صادرات' : 'First Export' },
    { year: lang === 'fa' ? '۱۳۹۰' : '2011', label: lang === 'fa' ? 'گسترش به تهران' : 'Expansion to Tehran' },
    { year: lang === 'fa' ? '۱۳۹۶' : '2017', label: lang === 'fa' ? 'ثبت شرکت رسمی' : 'Official Incorporation' },
    { year: lang === 'fa' ? '۱۴۰۰' : '2021', label: lang === 'fa' ? 'صادرات به ۱۵ کشور' : 'Exports to 15 Countries' },
  ];

  const values = [
    { icon: Leaf, title: lang === 'fa' ? 'کیفیت ارگانیک' : 'Organic Quality', desc: lang === 'fa' ? 'محصولاتمان را مستقیم از کشاورزان متعهد تأمین می‌کنیم.' : 'We source directly from committed farmers.' },
    { icon: Award, title: lang === 'fa' ? 'استانداردهای بین‌المللی' : 'International Standards', desc: lang === 'fa' ? 'تمام محصولات صادراتی مطابق با الزامات اتحادیه اروپا.' : 'All export products meet EU requirements.' },
    { icon: Globe, title: lang === 'fa' ? 'دسترس جهانی' : 'Global Reach', desc: lang === 'fa' ? 'ارسال به امارات، قطر، عمان، عراق و کشورهای اروپایی.' : 'Shipping to UAE, Qatar, Oman, Iraq and European countries.' },
    { icon: Users, title: lang === 'fa' ? 'تیم متعهد' : 'Committed Team', desc: lang === 'fa' ? 'بیش از ۵۰ متخصص جوان و متعهد.' : 'Over 50 young and dedicated professionals.' },
  ];

  return (
    <div dir={dir} style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={lang === 'fa' ? `درباره ${SITE_SEO.siteNameFA} — خشکبار برتر ایران` : `About ${SITE_SEO.siteNameEN} — Iran's Finest`}
        description={lang === 'fa' ? 'از سال ۱۳۷۷، پیشرو در تولید و فرآوری خشکبار ایران — مستقیم از باغستان‌های قزوین و کرمان.' : 'Since 1998, leading the way in Iranian dried fruit processing — direct from Gazvin and Kerman orchards.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/about`}
      />

      <PullToRefresh onRefresh={handleRefresh}>
      {/* Hero */}
      <div className="relative">
        <PageHero
          image="https://7golden.co/wp-content/uploads/2022/09/about-p-2.png"
          title={t(lang, 'about_title')}
          subtitle={t(lang, 'about_sub')}
          badge={lang === 'fa' ? 'داستان ما' : 'Our Story'}
        />
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
          <BackButton to="/" className="text-white/80 hover:text-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

        {/* Story */}
        <section className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="font-subheading text-xs uppercase block mb-3" style={{ color: 'var(--accent)', fontFamily: lang === 'fa' ? 'Kalameh, serif' : 'Georgia, serif' }}>
              {lang === 'fa' ? 'داستان ما' : 'Our Story'}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--fg)', fontFamily: lang === 'fa' ? 'Peyda, serif' : 'Georgia, serif' }}>
              {lang === 'fa' ? 'از کارگاهی کوچک تا رهبر صنعت' : 'From Small Workshop to Industry Leader'}
            </h2>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>
              {lang === 'fa'
                ? 'این مجموعه فعالیت جدی خود را در سال ۱۳۷۷ در کارگاهی بسیار کوچک آغاز نمود و به تدریج با کسب تجربیات بیشتر و بهره‌گیری از دانش و توانمندی نیروهای جوان و متعهد و پس از عبور از فراز و نشیب‌های فراوان موفق به کسب جایگاه قابل توجهی در زمینه تولید و فرآوری فندق و پسته و خشکبار شد.'
                : '7Golden began its journey in 1998 in a small workshop in Qazvin. Over the years, through accumulated expertise and the dedication of young, committed professionals, the company overcame numerous challenges to become a prominent name in hazelnut, pistachio, and dried fruit processing.'}
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {lang === 'fa'
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
            <SectionHeader title={lang === 'fa' ? 'خط زمانی ما' : 'Our Timeline'} subtitle={lang === 'fa' ? 'سفر هفت‌طلایی' : '7Golden Journey'} />
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
                <span className="font-heading font-extrabold text-sm block" style={{ color: 'var(--accent)', fontFamily: lang === 'fa' ? 'Peyda, serif' : 'Georgia, serif' }}>{m.year}</span>
                <span className="font-body text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>{m.label}</span>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="pb-20">
          <AnimatedSection>
            <SectionHeader title={lang === 'fa' ? 'ارزش‌های ما' : 'Our Values'} subtitle={lang === 'fa' ? 'چرا هفت‌طلایی؟' : 'Why 7Golden?'} />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="p-6 rounded-3xl h-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--accent)', color: '#fff' }}>
                    <v.icon size={20} />
                  </div>
                  <h3 className="font-body font-extrabold text-sm mb-2" style={{ color: 'var(--fg)', fontFamily: lang === 'fa' ? 'Peyda, serif' : 'Georgia, serif' }}>{v.title}</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </div>

      {/* Licenses & Awards — dynamic */}
      <AwardsSection key={refreshKey} />
      </PullToRefresh>
    </div>
  );
}