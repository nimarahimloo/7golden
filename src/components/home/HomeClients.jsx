import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ClientLogo from '@/components/home/ClientLogo';
import { CLIENTS } from '@/lib/clients';

export default function HomeClients() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const background = bgRef.current;
    if (!section || !background) return;

    let frameId = 0;
    const updateParallax = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(
          1,
          (viewportHeight - rect.top) / (viewportHeight + rect.height),
        ));
        background.style.transform =
          `translate3d(0, ${(progress - 0.5) * 60}px, 0) scale(1.15)`;
      });
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const loop = [...CLIENTS, ...CLIENTS];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '420px' }}
      dir="rtl"
    >
      <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
        <img
          ref={bgRef}
          src="/gallery/AQ8A1683AQ8A1683.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform', opacity: 0.18 }}
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--bg) 0%, rgba(7,6,4,0.92) 40%, rgba(7,6,4,0.92) 60%, var(--bg) 100%)',
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        <div className="chapter-shell pt-16 md:pt-20">
          <StoryChapter
            index="۰۷"
            eyebrow="حوزه‌های کاربرد"
            title="خشکبار در صنایع غذایی"
            lead="مغز فندق، خمیر فندق، مغز و خلال پسته و فرآورده‌های بادام در تهیه شکلات، بستنی، شیرینی، کیک و دیگر محصولات غذایی کاربرد دارند."
            className="mb-10"
          />
        </div>

        <div className="logo-marquee" aria-label="حوزه‌های کاربرد محصولات هفت طلایی">
          <div className="logo-marquee-track">
            {loop.map((sector, index) => (
              <div
                key={`${sector.id}-${index}`}
                aria-hidden={index >= CLIENTS.length ? true : undefined}
              >
                <ClientLogo client={sector} />
              </div>
            ))}
          </div>
        </div>

        <div className="chapter-shell pb-16 md:pb-20">
          <Reveal delay={160} className="mt-12 text-center">
            <Link to="/contact" className="btn-ghost">
              استعلام برای کسب‌وکار شما
              <ChevronLeft size={16} style={{ transform: 'scaleX(-1)' }} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
