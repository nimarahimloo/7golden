import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Quote, ChevronLeft, Star } from 'lucide-react';
import { getTestimonials } from '@/lib/api/content';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';

/**
 * HomeClients — a "featured buyers" band for the home page that showcases
 * the industrial partners who buy from 7Golden (ice-cream makers, confectioners,
 * chocolate factories, export groups). Reads testimonials from the API and
 * degrades to a curated fallback list so the section always renders.
 */
const FALLBACK_CLIENTS = [
  {
    nameFA: 'بستنی گلستان',
    roleFA: 'خریدار صادراتی',
    textFA:
      'خلال پسته قزوین هفت طلایی بهترین کیفیت را در بین تأمین‌کنندگان دارد. رنگ سبز مطلوب و برش یکنواخت.',
    rating: 5,
  },
  {
    nameFA: 'قنادی برتر',
    roleFA: 'خریدار عمده',
    textFA:
      'پرک بادام درختی با کیفیت عالی و تحویل به‌موقع. همکاری با هفت طلایی را به همه صنعت‌گران توصیه می‌کنیم.',
    rating: 5,
  },
  {
    nameFA: 'شکلات‌سازی آریا',
    roleFA: 'مدیر تأمین',
    textFA:
      'خمیر و پودر فندق هفت طلایی پایه محصول نهایی ماست. ثبات کیفیت و انطباق با استانداردهای بهداشتی، همکاری طولانی‌مدت را ممکن کرده است.',
    rating: 5,
  },
];

export default function HomeClients() {
  const isFA = true;
  const [clients, setClients] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await getTestimonials();
        if (active && items.length > 0) setClients(items);
        else if (active) setClients(FALLBACK_CLIENTS);
      } catch {
        if (active) setClients(FALLBACK_CLIENTS);
      }
    })();
    return () => { active = false; };
  }, []);

  const list = clients.length > 0 ? clients : FALLBACK_CLIENTS;

  return (
    <section className="chapter">
      <div className="chapter-shell">
        <StoryChapter
          index="۰۸"
          eyebrow="CLIENTS"
          title="کسانی که با هفت‌طلایی خرید می‌کنند"
          lead={isFA
            ? 'از کارخانجات بستنی و شکلات تا قنادی‌ها و گروه‌های صادراتی — مشتریان ما کیفیت و تحویل ما را تأیید می‌کنند.'
            : 'From ice-cream and chocolate factories to confectioners and export groups — our clients vouch for our quality and delivery.'}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {list.map((c, i) => (
            <Reveal key={c.nameFA + i} delay={(i % 3) * 90} variant="up">
              <article
                className="group relative h-full rounded-3xl p-6 md:p-7 overflow-hidden transition-all duration-500"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--hairline)' }}
              >
                {/* gold corner accent */}
                <span
                  className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at top right, var(--gold-2), transparent 70%)' }}
                />

                <Quote size={28} className="mb-4" style={{ color: 'var(--gold-2)', opacity: 0.55 }} />

                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.92 }}>
                  {c.textFA}
                </p>

                <div className="flex items-center gap-1 mt-5">
                  {Array.from({ length: c.rating || 5 }).map((_, s) => (
                    <Star key={s} size={13} fill="currentColor" style={{ color: 'var(--gold-2)' }} />
                  ))}
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
                  <div className="display-sm" style={{ color: 'var(--gold-2)' }}>{c.nameFA}</div>
                  <div className="font-body text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>{c.roleFA}</div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-12 text-center">
          <Link to="/contact" className="btn-ghost">
            {isFA ? 'پیوستن به مشتریان ما' : 'Join our clients'}
            <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
