import React, { useState, useEffect } from 'react';
import { Award, Trophy, Globe, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { getAwards } from '@/lib/api/content';
import { Image } from '@/components/ui/image';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import PageHero from '@/components/PageHero';
import LogoLoader from '@/components/LogoLoader';
import BackButton from '@/components/BackButton';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import Reveal from '@/components/story/Reveal';
import CountUp from '@/components/story/CountUp';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Awards() {
  const isFA = true;
  const headingFont = 'Peyda, serif';
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const items = await getAwards();
      setAwards(items);
    } catch (e) {
      // graceful
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await loadData();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const stats = [
    { icon: ShieldCheck, value: isFA ? '۲۵+' : '25+', label: isFA ? 'سال تجربه' : 'Years Experience' },
    { icon: Globe, value: isFA ? '۳۵۰۰' : '3500', label: isFA ? 'تن ظرفیت سالانه' : 'Tons Annual Capacity' },
    { icon: Trophy, value: isFA ? String(awards.length || '—') : String(awards.length || '—'), label: isFA ? 'مجوز و گواهی' : 'Certifications' },
    { icon: Leaf, value: isFA ? '۱۰۰٪' : '100%', label: isFA ? 'کیفیت تضمینی' : 'Quality Guaranteed' },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={isFA ? `جوایز و افتخارات ${SITE_SEO.siteNameFA} — مجوزها و گواهینامه‌ها` : `Awards & Honors — ${SITE_SEO.siteNameEN}`}
        description={isFA ? 'مجوزها، گواهینامه‌ها و افتخارات هفت‌طلایی — تأییدکننده کیفیت و استانداردهای بین‌المللی محصولات.' : 'Licenses, certifications and awards of 7Golden — certifying international quality standards.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/awards`}
      />

      <PullToRefresh onRefresh={loadData}>
      {/* Hero */}
      <div className="relative">
        <PageHero
          image="/banner/Hero-Banner-5.jpg"
          title={isFA ? 'جوایز و افتخارات' : 'Awards & Honors'}
          subtitle={isFA ? 'مجوزها و گواهینامه‌های معتبر هفت‌طلایی' : 'Certified quality, recognized excellence'}
          badge={isFA ? 'اعتبار و افتخارات' : 'Excellence'}
        />
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
          <BackButton to="/" className="text-white/80 hover:text-white" />
        </div>
      </div>

      {/* Stats Bar */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 100} className="text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
                >
                  <s.icon size={20} style={{ color: 'var(--gold-2)' }} />
                </div>
                <CountUp
                  value={s.value}
                  className="display-md block"
                  style={{ color: 'var(--gold-2)' }}
                />
                <div className="font-body text-xs mt-2" style={{ color: 'var(--fg-muted)' }}>
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Intro + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <section className="section-padding">
          {/* Intro */}
          <AnimatedSection className="text-center mb-14">
            <span className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-body text-xs font-semibold mb-4" style={{ color: 'var(--accent)' }}>
              <Award size={13} />
              {isFA ? 'گواهینامه‌ها و مجوزها' : 'Certificates & Licenses'}
            </span>
            <h2 className="display-lg leading-tight mb-4" style={{ color: 'var(--ink)' }}>
              {isFA ? 'کیفیتی که تأیید شده است' : 'Quality That Is Certified'}
            </h2>
            <p className="font-body text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {isFA
                ? 'کیفیت و استانداردهای بین‌المللی محصولات هفت‌طلایی با مجوزها و گواهینامه‌های معتبر از مراجع داخلی و بین‌المللی تأیید می‌شود. هر گواهی، تعهد ما به کیفیت و رضایت مشتریان است.'
                : 'The quality and international standards of 7Golden products are certified by accredited licenses from domestic and international authorities. Each certification reflects our commitment to quality and customer satisfaction.'}
            </p>
            <div className="gold-divider" />
          </AnimatedSection>

          {/* Loading */}
          {loading ? (
            <LogoLoader />
          ) : awards.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glass-orb">
                <Award size={28} style={{ color: 'var(--accent)' }} />
              </div>
              <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                {isFA ? 'به‌زودی جوایز و گواهینامه‌ها در این صفحه نمایش داده می‌شوند.' : 'Awards and certifications will be displayed here soon.'}
              </p>
            </div>
          ) : (
            /* Awards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((item, i) => (
                <AwardCardLarge key={item.id} item={item} delay={i * 100} isFA={isFA} headingFont={headingFont} />
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <AnimatedSection className="pb-20">
          <div className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h3 className="font-heading font-extrabold text-xl md:text-2xl mb-3" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {isFA ? 'کیفیت را خودتان تجربه کنید' : 'Experience the Quality Yourself'}
              </h3>
              <p className="font-body text-sm max-w-xl mx-auto mb-6" style={{ color: 'var(--fg-muted)' }}>
                {isFA ? 'محصولات هفت‌طلایی را کشف کنید — مستقیم از باغستان‌های ایران.' : 'Discover 7Golden products — direct from Iran\'s orchards.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/shop"
                  className="btn-accent inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm"
                >
                  {isFA ? 'مشاهده محصولات' : 'View Products'}
                </Link>
                <Link
                  to="/about"
                  className="btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm"
                >
                  {isFA ? 'درباره ما' : 'About Us'}
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
      </PullToRefresh>
    </div>
  );
}

function AwardCardLarge({ item, delay = 0, isFA, headingFont }) {
  const { ref, visible } = useScrollAnimation();
  const title = isFA ? item.titleFA : item.titleEN;
  const desc = isFA ? item.descFA : item.descEN;

  return (
    <div
      ref={ref}
      className={`reveal reveal-up ${visible ? 'is-visible' : ''} group relative rounded-3xl overflow-hidden gold-frame`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="rounded-3xl p-5 transition-all duration-500 h-full"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--hairline)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {/* Image with gold frame */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 product-gold-ring" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <Image
            src={item.image}
            alt={title}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
          {/* Shimmer sweep */}
          <div className="product-shimmer-sweep absolute inset-0 pointer-events-none">
            <div className="shimmer-stripe" />
          </div>
          {/* Trophy badge */}
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full glass-luxury flex items-center justify-center" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
            <Trophy size={16} style={{ color: 'var(--accent)' }} />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading font-extrabold text-base mb-2 leading-snug" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
          {title}
        </h3>

        {/* Description */}
        {desc && (
          <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}