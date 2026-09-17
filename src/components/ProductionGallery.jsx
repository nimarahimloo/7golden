import { useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useScrollAnimation } from '@/components/useScrollAnimation';

export default function ProductionGallery({ images }) {
  const { lang } = useApp();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const [lightbox, setLightbox] = useState(null);
  const containerRef = useRef(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <section className="section-glow py-12 md:py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full float-orb" style={{ background: 'var(--accent)' }} />
              <span className="font-subheading text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                {isFA ? 'فرآیند تولید' : 'Production Process'}
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl font-black mb-3" style={{ fontFamily: headingFont }}>
              <span className="gold-shimmer">
                {isFA ? 'کیفیت در هر مرحله' : 'Quality at Every Step'}
              </span>
            </h2>
            <p className="font-body text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--fg-muted)' }}>
              {isFA
                ? 'از باغستان تا بسته‌بندی — هر دانه با دقت و وسواس انتخاب می‌شود'
                : 'From orchard to packaging — every kernel chosen with meticulous care'}
            </p>
            <div className="gold-divider" />
          </div>

          {/* Asymmetric mosaic — no overlap, staggered heights */}
          <div className="gallery-mosaic" ref={containerRef}>
            {images.map((img, i) => (
              <GalleryTile
                key={img.id || i}
                image={img}
                index={i}
                isFA={isFA}
                headingFont={headingFont}
                onOpen={() => setLightbox(img)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            aria-label="Close"
          >
            <span style={{ fontSize: '1.25rem' }}>×</span>
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.image}
              alt={isFA ? lightbox.titleFA : lightbox.titleEN}
              className="w-full h-auto rounded-2xl"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
            <div className="text-center mt-4">
              <h3 className="font-heading font-extrabold text-white text-lg mb-1" style={{ fontFamily: headingFont }}>
                {isFA ? lightbox.titleFA : lightbox.titleEN}
              </h3>
              {lightbox.descFA && (
                <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {isFA ? lightbox.descFA : (lightbox.descEN || lightbox.descFA)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryTile({ image, index, isFA, headingFont, onOpen }) {
  const { ref, visible } = useScrollAnimation();
  const title = isFA ? image.titleFA : image.titleEN;
  const desc = isFA ? (image.descFA || '') : (image.descEN || image.descFA || '');

  return (
    <div
      ref={ref}
      className={`gallery-item span-${image.span || 'normal'} fade-up ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
      onClick={onOpen}
    >
      <img
        src={image.image}
        alt={title}
        loading="lazy"
      />
      <div className="gallery-gold-ring" />
      <div className="gallery-overlay">
        <div>
          <span className="font-subheading text-[10px] uppercase tracking-wider block mb-1" style={{ color: '#E8C547' }}>
            {isFA ? 'هفت‌طلایی' : '7Golden'}
          </span>
          <h3 className="font-heading font-extrabold text-white text-sm md:text-base leading-tight" style={{ fontFamily: headingFont }}>
            {title}
          </h3>
          {desc && (
            <p className="font-body text-[11px] mt-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}