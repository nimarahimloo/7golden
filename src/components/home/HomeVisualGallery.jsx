import { useEffect, useState } from 'react';
import { ArrowUpLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';

const PHOTOS = [
  { src: '/gallery/AQ8A1495AQ8A1495.webp', alt: 'تصویر ثبت‌شده از مجموعه هفت طلایی', shape: 'feature' },
  { src: '/gallery/AQ8A1505AQ8A1505.webp', alt: 'جزئیاتی از محصولات هفت طلایی', shape: 'portrait' },
  { src: '/gallery/AQ8A1520AQ8A1520.webp', alt: 'تصویری از محصولات و فضای کاری هفت طلایی', shape: 'portrait' },
  { src: '/gallery/AQ8A1579AQ8A1579.webp', alt: 'تصویر ثبت‌شده برای معرفی محصولات هفت طلایی', shape: 'wide' },
  { src: '/gallery/AQ8A1618AQ8A1618.webp', alt: 'نمایی دیگر از محصولات هفت طلایی', shape: 'wide' },
  { src: '/gallery/AQ8A1702AQ8A1702.webp', alt: 'جزئیاتی از مجموعه هفت طلایی', shape: 'wide' },
];

export default function HomeVisualGallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;
  const activePhoto = isOpen ? PHOTOS[activeIndex] : null;

  const close = () => setActiveIndex(null);
  const previous = () => setActiveIndex((index) => (index - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setActiveIndex((index) => (index + 1) % PHOTOS.length);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLightboxKeyDown = (event) => {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') next();
    if (event.key === 'ArrowRight') previous();
  };

  return (
    <section className="chapter relative overflow-hidden" aria-label="گالری تصاویر هفت طلایی">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 12% 40%, rgba(190,151,62,.055), transparent 45%)' }} />
      <div className="chapter-shell relative">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <StoryChapter
              index="06"
              eyebrow="گالری تصویری"
              title="زیبایی در جزئیات است"
              lead="نگاهی نزدیک‌تر به تصاویر ثبت‌شده برای معرفی محصولات و فضای هفت طلایی؛ هر قاب بخشی از روایت بصری مجموعه است."
            />
          </div>
          <p className="hidden max-w-[14rem] pb-1 text-xs leading-7 text-white/45 md:block">
            برای دیدن جزئیات، هر تصویر را انتخاب کنید.
          </p>
        </div>

        <div className="visual-gallery-grid">
          {PHOTOS.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 65} variant="scale" className={'visual-gallery-item visual-gallery-' + photo.shape}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="visual-gallery-trigger group"
                aria-label={'نمایش تصویر ' + (index + 1) + ' از ' + PHOTOS.length}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                <span className="visual-gallery-shade" aria-hidden="true" />
                <span className="visual-gallery-meta">
                  <span className="text-[10px] tracking-[.18em] text-white/65">7GOLDEN · {String(index + 1).padStart(2, '0')}</span>
                  <span className="visual-gallery-open"><ArrowUpLeft size={18} /></span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5" style={{ borderColor: 'var(--hairline)' }}>
          <span className="text-xs text-white/45">هفت طلایی · قزوین</span>
          <span className="text-xs tracking-[.12em] text-[#c7a75b]">PRODUCT · PROCESS · DETAIL</span>
        </div>
      </div>

      {isOpen && activePhoto && (
        <div
          className="visual-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="نمایش بزرگ تصویر"
          tabIndex={-1}
          onKeyDown={handleLightboxKeyDown}
          onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
        >
          <button type="button" className="visual-lightbox-close" onClick={close} aria-label="بستن تصویر"><X size={21} /></button>
          <button type="button" className="visual-lightbox-nav visual-lightbox-prev" onClick={previous} aria-label="تصویر قبلی"><ChevronRight size={24} /></button>
          <figure className="visual-lightbox-figure">
            <img src={activePhoto.src} alt={activePhoto.alt} />
            <figcaption>
              <span>{activePhoto.alt}</span>
              <span dir="ltr">{String(activeIndex + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>
          <button type="button" className="visual-lightbox-nav visual-lightbox-next" onClick={next} aria-label="تصویر بعدی"><ChevronLeft size={24} /></button>
        </div>
      )}
    </section>
  );
}
