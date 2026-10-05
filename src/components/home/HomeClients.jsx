import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ClientLogo from '@/components/home/ClientLogo';
import { CLIENTS } from '@/lib/clients';

/**
 * HomeClients — social proof for B2B buyers. A logo wall of the industrial
 * brands that buy from 7Golden drifts slowly across a pinned parallax
 * backdrop (pure CSS animation — no per-frame React work). Hover pauses it.
 * The brand list lives in lib/clients.js, where real logo files can be
 * swapped in.
 */
export default function HomeClients() {
  const isFA = true;
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  // Parallax on the backdrop
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !bgRef.current) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      bgRef.current.style.transform = `translate3d(0, ${(p - 0.5) * 60}px, 0) scale(1.15)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Two identical halves → the -50% keyframe loops seamlessly.
  const loop = [...CLIENTS, ...CLIENTS];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '420px' }}
      dir="rtl"
    >
      {/* Pinned parallax background image */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <img
          ref={bgRef}
          src="/gallery/AQ8A1683AQ8A1683.webp"
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
            className="mb-10"
          />
        </div>

        {/* Logo wall */}
        <div className="logo-marquee" aria-label="برندهای مشتری هفت‌طلایی">
          <div className="logo-marquee-track">
            {loop.map((client, i) => (
              <ClientLogo key={`${client.id}-${i}`} client={client} />
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
