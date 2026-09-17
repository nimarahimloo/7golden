import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ChevronLeft } from 'lucide-react';

/**
 * Closing call-to-action for business buyers.
 * Replaces the retail "order today" banner.
 */
export default function BusinessCTA() {
  const headingFont = 'Peyda, serif';

  return (
    <section className="relative overflow-hidden">
      <img
        src="https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/4e88900f9_generated_image.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: 'kenBurns 10s ease-out forwards' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.92) 100%)' }} />

      <div className="relative z-10 py-14 md:py-20 text-center px-4">
        <span className="font-subheading text-sm uppercase block mb-3 tracking-wider" style={{ color: '#F0CE5A', fontFamily: 'Kalameh, serif' }}>
          همکاری تجاری
        </span>
        <h2 className="font-heading text-2xl md:text-4xl font-black text-white mb-4 gold-text-glow" style={{ fontFamily: headingFont }}>
          درخواست پیش‌فاکتور و نمونه
        </h2>
        <p className="font-body text-white/70 text-sm mb-7 max-w-lg mx-auto leading-relaxed">
          برای دریافت لیست قیمت عمده، نمونه محصول و شرایط قرارداد بلندمدت با واحد بازرگانی ما در تماس باشید.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:+989121823438"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-semibold text-sm transition-all duration-300 hover:scale-105 gold-border-luxury"
            style={{ background: 'linear-gradient(135deg, rgba(240,206,90,0.95), rgba(184,148,42,0.95))', color: '#0D0D0D' }}
          >
            <Phone size={16} />
            تماس با واحد بازرگانی
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-semibold text-sm transition-all duration-300 hover:scale-105"
            style={{ border: '1.5px solid rgba(240,206,90,0.6)', color: '#F0CE5A' }}
          >
            ارسال درخواست همکاری
            <ChevronLeft size={16} style={{ transform: 'scaleX(-1)' }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
