import React from 'react';
import StoryChapter from '@/components/story/StoryChapter';

const FILMS = [
  { id: 'facility', eyebrow: 'فضای مجموعه', title: 'نگاهی به فضای کار', src: '/video/facility-1.mp4', poster: '/banner/about-real.webp', featured: true },
  { id: 'processing', eyebrow: 'فرآوری', title: 'جزئیات آماده‌سازی محصول', src: '/video/processing-1.mp4', poster: '/banner/hero-chopped-scoop.webp' },
  { id: 'showroom', eyebrow: 'محصولات', title: 'محصولات از نزدیک', src: '/video/showroom-1.mp4', poster: '/banner/tray-pistachio-almond.webp' },
];

function FilmCard({ film, featured = false }) {
  return (
    <article
      className={'group overflow-hidden rounded-[1.4rem] border ' + (featured ? 'lg:col-span-7' : '')}
      style={{ borderColor: 'var(--hairline)', background: 'linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012))' }}
    >
      <div className="relative overflow-hidden bg-black">
        <video controls playsInline preload="none" poster={film.poster} aria-label={film.title}
          className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]">
          <source src={film.src} type="video/mp4" />
          مرورگر شما از پخش این ویدیو پشتیبانی نمی‌کند.
        </video>
        <span className="absolute right-4 top-4 rounded-full border px-3 py-1.5 text-[11px] text-white/90 backdrop-blur-md"
          style={{ borderColor: 'rgba(255,255,255,.22)', background: 'rgba(8,7,5,.44)' }}>
          {film.eyebrow}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="text-sm font-semibold leading-7 text-white sm:text-base">{film.title}</h3>
        <span className="h-px w-8 shrink-0" style={{ background: 'var(--gold-2)' }} aria-hidden="true" />
      </div>
    </article>
  );
}

export default function HomeVideoShowcase() {
  const [featured, ...secondary] = FILMS;

  return (
    <section className="chapter relative overflow-hidden" aria-labelledby="home-video-heading">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(190,151,62,.09), transparent 70%)' }} />
      <div className="chapter-shell relative">
        <div className="mb-10 md:mb-14">
          <StoryChapter index="05" eyebrow="تصاویر واقعی از مجموعه" title="هفت طلایی، از نزدیک"
            lead="نگاهی تصویری به فضای مجموعه، محصولات و بخشی از فرایند فرآوری؛ برای آشنایی بهتر پیش از گفت‌وگو درباره سفارش."
            align="center" />
        </div>
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-5">
          <FilmCard film={featured} featured />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {secondary.map((film) => <FilmCard key={film.id} film={film} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
