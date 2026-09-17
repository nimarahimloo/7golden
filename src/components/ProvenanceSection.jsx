import React from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { PatternDivider } from '@/components/IranianPattern';
import { useScrollAnimation } from '@/components/useScrollAnimation';

const REGIONS = [
  { nameFA: 'قزوین', nameEN: 'Qazvin', specialtyFA: 'پسته و فندق', specialtyEN: 'Pistachios & Hazelnuts', coord: '۳۵٫۸°N' },
  { nameFA: 'اشنویه', nameEN: 'Oshnavieh', specialtyFA: 'فندق خندان', specialtyEN: 'Cracked Hazelnuts', coord: '۳۷٫۰°N' },
  { nameFA: 'هرمزگان', nameEN: 'Hormozgan', specialtyFA: 'خرما پیارم', specialtyEN: 'Piarom Dates', coord: '۲۷٫۲°N' },
  { nameFA: 'تبریز', nameEN: 'Tabriz', specialtyFA: 'زردآلو خشک', specialtyEN: 'Dried Apricots', coord: '۳۸٫۱°N' },
  { nameFA: 'گلستان', nameEN: 'Golestan', specialtyFA: 'انجیر خشک', specialtyEN: 'Dried Figs', coord: '۳۶٫۸°N' },
  { nameFA: 'بیرجند', nameEN: 'Birjand', specialtyFA: 'کشمش طلایی', specialtyEN: 'Golden Raisins', coord: '۳۲٫۹°N' },
];

function RegionCard({ region, index, lang }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className="fade-up group relative p-6 md:p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <span
          className="font-heading text-3xl font-bold opacity-15"
          style={{ color: 'var(--accent)', fontFamily: lang === 'fa' ? 'Peyda, serif' : 'Georgia, serif' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <MapPin size={18} style={{ color: 'var(--accent)' }} />
      </div>
      <h3
        className="font-heading text-xl md:text-2xl font-bold mb-1"
        style={{ color: 'var(--fg)', fontFamily: lang === 'fa' ? 'Peyda, serif' : 'Georgia, serif' }}
      >
        {lang === 'fa' ? region.nameFA : region.nameEN}
      </h3>
      <p className="font-body text-sm mb-4" style={{ color: 'var(--accent)' }}>
        {lang === 'fa' ? region.specialtyFA : region.specialtyEN}
      </p>
      <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
          {lang === 'fa' ? region.coord : region.coord.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))}
        </span>
      </div>
    </div>
  );
}

export default function ProvenanceSection() {
  const { lang } = useApp();
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="font-subheading text-xs uppercase block mb-3"
            style={{ color: 'var(--accent)', fontFamily: lang === 'fa' ? 'Kalameh, serif' : 'Georgia, serif' }}
          >
            {t(lang, 'provenance_sub')}
          </span>
          <h2
            className="font-heading text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--fg)', fontFamily: lang === 'fa' ? 'Peyda, serif' : 'Georgia, serif' }}
          >
            {t(lang, 'provenance_title')}
          </h2>
          <p className="font-body text-base max-w-xl mx-auto" style={{ color: 'var(--fg-muted)' }}>
            {t(lang, 'provenance_desc')}
          </p>
          <div className="mt-6"><PatternDivider /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {REGIONS.map((region, i) => (
            <RegionCard key={i} region={region} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}