import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, Maximize2 } from 'lucide-react';
import { getAwards } from '@/lib/api/content';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';

/**
 * HomeAwardsSlider — a homepage awards/prizes showcase rendered as a slider so
 * each award image is seen fully and clearly. The active award fills the frame
 * (portrait certificate shown large and unobstructed) with prev/next controls
 * and an index counter. Degrades to a curated fallback when the API is empty.
 */
const FALLBACK_AWARDS = [
  {
    id: 'award-01',
    titleFA:
      'حضور در نخستین نمایشگاه شیرینی و شکلات تبریز ۱۴۰۲',
    descFA:
      'لوح تقدیر از معاونت غذا و داروی دانشگاه علوم پزشکی تبریز به پاس مشارکت در نخستین نمایشگاه صنایع شیرینی، شکلات و بیسکوییت.',
    image: '/awards/award-01-tabriz-exhibition.webp',
  },
  {
    id: 'award-02',
    titleFA:
      'لوح تقدیر نمایشگاه فروش بهاره و ضیافت رمضان ۱۴۰۳',
    descFA:
      'تقدیر از شرکت نمایشگاه‌های بین‌المللی استان قزوین به دلیل حضور مؤثر و پررنگ در نمایشگاه فروش بهاره و ضیافت رمضان.',
    image: '/awards/award-02-qazvin-appreciation.webp',
  },
];

export default function HomeAwardsSlider() {
  const isFA = true;
  const [awards, setAwards] = useState([]);
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await getAwards();
        if (active) setAwards(items.length > 0 ? items : FALLBACK_AWARDS);
        else setAwards(FALLBACK_AWARDS);
      } catch {
        if (active) setAwards(FALLBACK_AWARDS);
      }
    })();
    return () => { active = false; };
  }, []);

  const list = awards.length > 0 ? awards : FALLBACK_AWARDS;
  const total = list.length;

  const go = (dir) => setIndex((i) => (i + dir + total) % total);
  const select = (i) => setIndex(i);

  // Auto-advance every 6s when there is more than one award.
  useEffect(() => {
    if (total <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(timer.current);
  }, [total]);

  // RTL: the "previous" arrow visually points right.
  const active = list[Math.min(index, total - 1)] || list[0];

  return (
    <section className="chapter relative overflow-hidden" style={{ background: 'rgba(7, 6, 4, 0.55)' }}>
      <div className="chapter-shell">
        <StoryChapter
          index="۰۷"
          eyebrow="جوایز و گواهینامه‌ها"
          title="کیفیتی که مراجع معتبر تأیید کرده‌اند"

          lead={isFA
            ? 'هر گواهی و لوح تقدیری که داریم، تعهد ما به کیفیت و استانداردهای بین‌المللی را نشان می‌دهد — از نمایشگاه‌های تخصصی تا گواهینامه‌های ایمنی مواد غذایی.'
            : 'Every certificate and plaque reflects our commitment to quality and international standards.'}
          className="mb-10"
        />

        {total > 0 && active && (
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
              {/* Image — large, centered, full and clear */}
              <Reveal variant="scale" key={active.id}>
                <div className="relative rounded-3xl overflow-hidden gold-frame h-full min-h-[420px] md:min-h-[520px] flex items-center justify-center"
                  style={{ background: '#faf9f6' }}>
                  <img
                    src={active.image}
                    alt={active.titleFA}
                    className="max-w-full max-h-full object-contain"
                    style={{ width: 'auto', height: '100%' }}
                    loading="lazy"
                  />
                  <span
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(7,6,4,0.7)', color: 'var(--gold-2)', backdropFilter: 'blur(6px)' }}
                  >
                    <Maximize2 size={11} />
                    {isFA ? 'تصویر کامل و واضح' : 'Full view'}
                  </span>
                </div>
              </Reveal>

              {/* Caption */}
              <div className="flex flex-col justify-center">
                <span className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-body text-xs font-semibold mb-5 w-fit"
                  style={{ color: 'var(--gold-2)', border: '1px solid var(--hairline-strong)' }}>
                  <Award size={13} />
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>

                <Reveal variant="up" key={active.id + '-c'}>
                  <h3 className="display-md mb-4" style={{ color: 'var(--ink)' }}>{active.titleFA}</h3>
                  <p className="font-body text-sm leading-relaxed max-w-xl" style={{ color: 'var(--fg-muted)' }}>
                    {active.descFA}
                  </p>
                </Reveal>

                {/* Prev / Next */}
                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={() => go(-1)}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--hairline-strong)' }}
                    aria-label="قبلی"
                  >
                    <ChevronRight size={20} style={{ color: 'var(--gold-2)' }} />
                  </button>
                  <button
                    onClick={() => go(1)}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--hairline-strong)' }}
                    aria-label="بعدی"
                  >
                    <ChevronLeft size={20} style={{ color: 'var(--gold-2)' }} />
                  </button>

                  <Link to="/awards" className="link-gold ms-auto hidden md:inline-flex">
                    {isFA ? 'همه جوایز' : 'All awards'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {list.map((a, i) => (
                  <button
                    key={a.id + i}
                    onClick={() => select(i)}
                    aria-label={`جوایز ${i + 1}`}
                    style={{
                      width: i === index ? 26 : 8,
                      height: 8,
                      borderRadius: 999,
                      background: i === index ? 'var(--gold-2)' : 'var(--hairline-strong)',
                      transition: 'all .3s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}