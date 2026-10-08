import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Full-screen photo viewer for a news article. Keyboard (←/→/Esc), tap on the
 * arrows and touch swipe all work; the page behind is scroll-locked while open.
 * RTL: swiping / pressing "left" moves to the next photo.
 */
export default function MediaLightbox({ photos, index, onClose, onIndex }) {
  const touch = useRef({ x: 0, y: 0 });
  const n = photos.length;
  const go = (dir) => onIndex((index + dir + n) % n);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndex((index + 1) % n);
      if (e.key === 'ArrowRight') onIndex((index - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, n, onClose, onIndex]);

  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? -1 : 1);
  };

  const btn = 'absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 z-10';
  const btnStyle = { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      <button className={`${btn} top-4 right-4`} style={btnStyle} onClick={onClose} aria-label="بستن">
        <X size={20} />
      </button>
      <span className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {(index + 1).toLocaleString('fa-IR')} / {n.toLocaleString('fa-IR')}
      </span>
      <button className={`${btn} left-2 sm:left-4 top-1/2 -translate-y-1/2`} style={btnStyle} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="بعدی">
        <ChevronLeft size={20} />
      </button>
      <button className={`${btn} right-2 sm:right-4 top-1/2 -translate-y-1/2`} style={btnStyle} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="قبلی">
        <ChevronRight size={20} />
      </button>
      <img
        src={photos[index]}
        alt=""
        className="max-w-full max-h-[86vh] w-auto h-auto object-contain rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
