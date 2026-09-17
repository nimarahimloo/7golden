import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { getAwards } from '@/lib/api/content';
import { Image } from '@/components/ui/image';
import { useScrollAnimation } from '@/components/useScrollAnimation';

export default function AwardsSection() {
  const isFA = true;
  const headingFont = 'Peyda, serif';
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await getAwards();
        if (active) setAwards(items);
      } catch (e) {
        // graceful
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading || awards.length === 0) return null;

  return (
    <section dir="rtl" className="section-padding relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-glow" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-body text-xs font-semibold mb-4" style={{ color: 'var(--accent)' }}>
            <Award size={13} />
            {isFA ? 'اعتبار و افتخارات' : 'Certifications & Awards'}
          </span>
          <h2 className="font-heading font-black text-2xl md:text-4xl leading-tight" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'مجوزها و جوایز' : 'Licenses & Awards'}
          </h2>
          <p className="font-body text-sm mt-4 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {isFA
              ? 'کیفیت و استانداردهای بین‌المللی محصولات هفت‌طلایی با مجوزها و گواهینامه‌های معتبر تأیید می‌شود.'
              : 'The quality and international standards of 7Golden products are certified by accredited licenses and awards.'}
          </p>
          <div className="gold-divider" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((item, i) => (
            <AwardCard key={item.id} item={item} delay={i * 100} isFA={isFA} headingFont={headingFont} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardCard({ item, delay = 0, isFA, headingFont }) {
  const { ref, visible } = useScrollAnimation();
  const title = isFA ? item.titleFA : item.titleEN;
  const desc = isFA ? item.descFA : item.descEN;

  return (
    <div
      ref={ref}
      className={`fade-up ${visible ? 'visible' : ''} group relative rounded-3xl overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="rounded-3xl p-6 transition-all duration-500 h-full"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <Image
            src={item.image}
            alt={title}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
          {/* Gold ring on hover */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500 group-hover:shadow-[inset_0_0_0_2px_rgba(212,175,55,0.45),0_0_24px_rgba(212,175,55,0.2)]" />
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