import React, { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  return reduced;
}

/**
 * ExportProcess — the signature B2B differentiator.
 * A pinned, scroll-driven journey through the export workflow:
 * Orchard → Processing → Lab → Packaging → Export.
 * Each step cross-fades its image and steps its copy,
 * with a gold progress rail tracking the visitor through the chain.
 *
 * All scroll-driven transforms use direct DOM manipulation — no React
 * state per frame — so the motion stays buttery-smooth. The active image
 * also drifts with a parallax offset for a more alive, cinematic feel.
 * Degrades to a static stacked layout under prefers-reduced-motion.
 */
const STEPS = [
  {
    key: 'orchard',
    image: '/gallery/AQ8A1499AQ8A1499.JPG',
    eyebrow: 'STEP 01',
    title: 'برداشت از باغستان',
    lead: 'تأمین مستقیم از کشاورزان متعهد در قزوین و اشنویه — بدون واسطه.',
  },
  {
    key: 'processing',
    image: '/gallery/AQ8A1516AQ8A1516.JPG',
    eyebrow: 'STEP 02',
    title: 'فرآوری و تفکیک',
    lead: 'خطوط بوجاری، تفکیک سایز و خلال‌بری با ظرفیت صنعتی پیوسته.',
  },
  {
    key: 'lab',
    image: '/gallery/AQ8A1505AQ8A1505.JPG',
    eyebrow: 'STEP 03',
    title: 'کنترل کیفیت آزمایشگاهی',
    lead: 'پایش رطوبت، آفلاتوکسین و سلامت محصول در هر سری.',
  },
  {
    key: 'packaging',
    image: '/gallery/AQ8A1524AQ8A1524.JPG',
    eyebrow: 'STEP 04',
    title: 'بسته‌بندی صادراتی',
    lead: 'بسته‌بندی مطابق مشخصات سفارش مشتری — کیسه، کارتن و بشکه صنعتی.',
  },
  {
    key: 'export',
    image: '/banner/Hero-main.jpg',
    eyebrow: 'STEP 05',
    title: 'صادرات و تحویل',
    lead: 'تحویل زمان‌بندی‌شده به بازارهای صادراتی بین‌المللی.',
  },
];

export default function ExportProcess({ id }) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const mediaRefs = useRef([]);
  const copyRef = useRef(null);
  const railFillRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let lastActive = -1;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = total > 0 ? Math.max(0, Math.min(0.9999, (-rect.top) / total)) : 0;

        const newActive = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
        if (newActive !== lastActive) {
          lastActive = newActive;
          setActive(newActive);
        }

        const stepProgress = (progress * STEPS.length) - newActive;

        // Copy parallax drift — intensified.
        if (copyRef.current) {
          copyRef.current.style.transform = `translate3d(0, ${stepProgress * -36}px, 0)`;
        }

        // Active image parallax drift.
        const activeMedia = mediaRefs.current[newActive];
        if (activeMedia) {
          const img = activeMedia.querySelector('img');
          if (img) {
            const isMobile = window.innerWidth < 768;
            const drift = (stepProgress - 0.5) * (isMobile ? 30 : 54);
            img.style.transform = `translate3d(0, ${drift}px, 0) scale(1.1)`;
          }
        }

        // Rail fill.
        if (railFillRef.current) {
          railFillRef.current.style.height = `${(progress * 100).toFixed(1)}%`;
        }
      });
    };

    const onScroll = () => update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section id={id} className="chapter" dir="rtl">
        <div className="chapter-shell flex flex-col gap-16">
          {STEPS.map((step) => (
            <article key={step.key} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="media-frame aspect-[4/3]">
                <img src={step.image} alt={step.title} loading="lazy" />
              </div>
              <div>
                <span className="eyebrow block mb-3">{step.eyebrow}</span>
                <h3 className="display-md mb-3" style={{ color: 'var(--ink)' }}>{step.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{step.lead}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const current = STEPS[active];

  return (
    <section id={id} ref={trackRef} className="process-track" style={{ height: `${STEPS.length * 80}svh` }} dir="rtl">
      <div className="process-viewport">
        {/* ---- media cross-fade ---- */}
        {STEPS.map((step, i) => (
          <div
            key={step.key}
            ref={(node) => { mediaRefs.current[i] = node; }}
            className="process-media"
            style={{
              opacity: i === active ? 1 : 0,
              transform: `scale(${i === active ? 1 : 1.08})`,
            }}
            aria-hidden={i !== active}
          >
            <img src={step.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} style={{ willChange: 'transform' }} />
          </div>
        ))}

        {/* ---- scrims ---- */}
        <div className="process-scrim" />
        <div className="process-vignette" />

        {/* ---- copy ---- */}
        <div className="relative z-10 h-full chapter-shell flex items-center">
          <div className="w-full max-w-xl" key={current.key}>
            <div ref={copyRef} className="process-copy">
              <span className="process-step-num">{current.eyebrow}</span>
              <h3 className="display-lg mt-4 mb-5">
                <span className="gold-text">{current.title}</span>
              </h3>
              <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                {current.lead}
              </p>
            </div>
          </div>
        </div>

        {/* ---- vertical progress rail ---- */}
        <div className="process-rail-wrap">
          <div className="process-rail-track">
            <div
              ref={railFillRef}
              className="process-rail-fill"
              style={{ height: '0%' }}
            />
          </div>
          <div className="process-rail-steps">
            {STEPS.map((step, i) => (
              <div key={step.key} className={`process-rail-step ${i <= active ? 'is-active' : ''}`}>
                <span className="process-rail-dot" />
                <span className="process-rail-label">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
