
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ClientLogo from '@/components/home/ClientLogo';
import { CLIENTS } from '@/lib/clients';

export default function HomeClients() {
  const sectionRef = useRef < HTMLElement | null > (null);
  const bgRef = useRef < HTMLImageElement | null > (null);

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

        const progress = Math.max(
          0,
          Math.min(
            1,
            (viewportHeight - rect.top) /
            (viewportHeight + rect.height),
          ),
        );

        background.style.transform =
          `translate3d(0, ${(progress - 0.5) * 60}px, 0) scale(1.15)`;
      });
    };

    window.addEventListener('scroll', updateParallax, {
      passive: true,
    });

    window.addEventListener('resize', updateParallax, {
      passive: true,
    });

    updateParallax();

    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Duplicate the logo sequence for a seamless CSS marquee.
  const loop = [...CLIENTS, ...CLIENTS];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '420px' }}
      dir="rtl"
    >
      {/* Cinematic background */}

      <div
        className="absolute inset-0"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <img
          ref={bgRef}
          src="/gallery/AQ8A1683AQ8A1683.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            willChange: 'transform',
            opacity: 0.18,
          }}
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

      <div
        className="relative"
        style={{ zIndex: 2 }}
      >
        {/* Section introduction */}

        <div className="chapter-shell pt-16 md:pt-20">
          <StoryChapter
            index="۰۷"
            eyebrow="همکاری‌های تجاری"
            title="همراهان تجاری ۷ گلدن"
            lead="نیاز هر مجموعه به خشکبار، با نوع محصول و کاربرد آن تعریف می‌شود. در همکاری با فعالان صنایع غذایی و قنادی، شناخت مشخصات محصول و توجه به جزئیات سفارش، مبنای کار ۷ گلدن است."
            className="mb-10"
          />
        </div>

        {/* Client logo wall */}

        <div
          className="logo-marquee"
          aria-label="مجموعه‌های همکار ۷ گلدن"
        >
          <div className="logo-marquee-track">
            {loop.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                aria-hidden={
                  index >= CLIENTS.length ? true : undefined
                }
              >
                <ClientLogo client={client} />
              </div>
            ))}
          </div>
        </div>

        {/* Business inquiry */}

        <div className="chapter-shell pb-16 md:pb-20">
          <Reveal
            delay={160}
            className="mt-12 text-center"
          >
            <Link
              to="/contact"
              className="btn-ghost"
            >
              درخواست همکاری تجاری
              <ChevronLeft
                size={16}
                style={{ transform: 'scaleX(-1)' }}
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
