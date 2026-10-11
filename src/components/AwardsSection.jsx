import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { getAwards } from '@/lib/api/content';
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
  const title = item.title_fa || item.titleFA || item.title || '';
  const desc = item.desc_fa || item.descFA || item.desc || '';
  const img = item.image;
  return (
    <div
      ref={ref}
      className={`fade-up ${visible ? 'visible' : ''} group relative rounded-3xl overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="rounded-3xl overflow-hidden transition-all duration-500 h-full"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={title || 'گواهی هفت طلایی'}
            className="w-full h-auto object-contain bg-[#faf9f6]"
            loading="lazy" width={800} height={1100} style={{ aspectRatio: "4 / 5", width: "100%", height: "auto" }}
          />
        ) : null}
        {(title || desc) ? (
          <div className="p-5 text-center">
            {title ? (
              <h3 className="font-heading font-bold text-sm mb-2" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {title}
              </h3>
            ) : null}
            {desc ? (
              <div
                className="font-body text-xs leading-relaxed"
                style={{ color: 'var(--fg-muted)' }}
                dangerouslySetInnerHTML={{ __html: desc }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
