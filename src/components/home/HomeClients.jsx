import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';

/**
 * HomeClients — a fixed parallax brand marquee band for the home page.
 * Shows the industrial partners who buy from 7Golden as an auto-moving
 * horizontal slider with a pinned parallax backdrop. Brand names are
 * rendered as elegant gold text cards — no testimonials, just brands.
 */
const CLIENT_BRANDS = [
  { nameFA: 'بستنی گلستان', roleFA: 'صنایع بستنی‌سازی' },
  { nameFA: 'قنادی برتر', roleFA: 'صنایع قنادی' },
  { nameFA: 'شکلات‌سازی آریا', roleFA: 'صنایع شکلات' },
  { nameFA: 'هلدینگ پارس', roleFA: 'خواروبار عمده' },
  { nameFA: 'گروه سرو', roleFA: 'صنایع غذایی' },
  { nameFA: 'نخبگان غذا', roleFA: 'فرآورده غذایی' },
  { nameFA: 'گلستان طلایی', roleFA: 'صادرات خشکبار' },
  { nameFA: 'آریا فود', roleFA: 'تأمین مواد اولیه' },
];

export default function HomeClients() {
  const isFA = true;
  const trackRef = useRef(null);
  const bgRef = useRef(null);
  const [offset, setOffset] = useState(0);

  // Auto-scroll the brand strip
  useEffect(() => {
    let raf = 0;
    let pos = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      pos += 0.5;
      if (pos > 50) pos = 0;
      setOffset(pos);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Parallax on the fixed background
  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${(p - 0.5) * 60}px, 0) scale(1.15)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Duplicate brands for seamless loop
  const doubled = [...CLIENT_BRANDS, ...CLIENT_BRANDS];

  return (
    <section
      ref={trackRef}
      className="relative overflow-hidden"
      style={{ minHeight: '420px' }}
      dir="rtl"
    >
      {/* Pinned parallax background image */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <img
          ref={bgRef}
          src="/gallery/AQ8A1683AQ8A1683.JPG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform', opacity: 0.18 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, var(--bg) 0%, rgba(7,6,4,0.92) 40%, rgba(7,6,4,0.92) 60%, var(--bg) 100%)',
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        <div className="chapter-shell pt-16 md:pt-20">
          <StoryChapter
            index="۰۸"
            eyebrow="CLIENTS"
            title="کسانی که با هفت‌طلایی خرید می‌کنند"
            lead={isFA
              ? 'از کارخانجات بستنی و شکلات تا قنادی‌ها و گروه‌های صادراتی — برندهایی که به کیفیت هفت‌طلایی اعتماد کرده‌اند.'
              : 'From ice-cream and chocolate factories to confectioners and export groups.'}
            className="mb-12"
          />
        </div>

        {/* Auto-moving brand slider */}
        <div
          className="relative overflow-hidden py-8"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div
            className="flex gap-4 md:gap-6 w-max"
            style={{ transform: `translateX(${offset}%)` }}
          >
            {doubled.map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-2 px-8 py-6 rounded-2xl"
                style={{
                  minWidth: '220px',
                  background: 'rgba(12, 10, 6, 0.6)',
                  border: '1px solid var(--hairline)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <span
                  className="font-heading font-extrabold text-lg md:text-xl"
                  style={{ color: 'var(--gold-2)', fontFamily: 'Peyda, serif', fontWeight: 700 }}
                >
                  {brand.nameFA}
                </span>
                <span className="font-body text-xs" style={{ color: 'var(--fg-muted)', fontFamily: 'Kalameh, serif', fontWeight: 400 }}>
                  {brand.roleFA}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chapter-shell pb-16 md:pb-20">
          <Reveal delay={160} className="mt-12 text-center">
            <Link to="/contact" className="btn-ghost">
              {isFA ? 'پیوستن به مشتریان ما' : 'Join our clients'}
              <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
