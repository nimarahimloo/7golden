import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Cake, Candy, Cookie, IceCreamCone } from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import { APPLICATIONS } from '@/lib/clients';

const ICONS = { Cake, Candy, Cookie, IceCreamCone };

export default function HomeClients({ section = {} }) {
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
        background.style.transform = `translate3d(0, ${(progress - 0.5) * 36}px, 0) scale(1.1)`;
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
          src={section.image || '/gallery/AQ8A1683AQ8A1683.webp'}
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
              'linear-gradient(to bottom, var(--bg) 0%, rgba(242, 236, 223, 0.96) 40%, rgba(242, 236, 223, 0.96) 60%, var(--bg) 100%)',
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        <div className="chapter-shell pt-16 md:pt-20">
          <StoryChapter
            index="۰۳"
            eyebrow={section.badge_fa || 'نمونه کاربردها'}
            title={section.title_fa || 'کاربرد محصولات در صنایع غذایی'}
            lead={section.subtitle_fa || 'این موارد، نمونه‌هایی از کاربرد رایج فرآورده‌های فندق، پسته و بادام هستند؛ استفاده دقیق هر محصول به مشخصات آن و فرمول تولیدکننده بستگی دارد.'}
            className="mb-10"
          />
        </div>

        <div className="chapter-shell pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {APPLICATIONS.map((application, index) => {
              const Icon = ICONS[application.icon] || Cookie;
              return (
                <Reveal key={application.id} delay={index * 80}>
                  <article className="fact-card h-full p-6 rounded-3xl">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--hairline-strong)' }}
                    >
                      <Icon size={21} style={{ color: 'var(--gold-2)' }} aria-hidden="true" />
                    </div>
                    <h3 className="display-sm mb-3" style={{ color: 'var(--fg)' }}>{application.titleFA}</h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{application.textFA}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="chapter-shell pb-16 md:pb-20">
          <Reveal delay={160} className="mt-8 text-center">
            <Link to="/contact" className="btn-ghost">
              درباره محصول و سفارش استعلام بگیرید
              <ChevronLeft size={16} style={{ transform: 'scaleX(-1)' }} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
