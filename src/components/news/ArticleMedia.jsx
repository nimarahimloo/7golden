import Reveal from '@/components/story/Reveal';

/**
 * Media blocks used inside a news article. Every photo is shown in a fixed
 * aspect ratio (cover-fit) so the article keeps one consistent rhythm on
 * mobile and desktop; tapping a photo opens the lightbox.
 */
function Photo({ src, ratio, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: ratio, background: 'var(--bg-secondary)', border: '1px solid var(--hairline)' }}
      aria-label="نمایش تصویر"
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </button>
  );
}

export function PhotoGroup({ srcs, onOpen }) {
  if (!srcs.length) return null;
  const n = srcs.length;
  return (
    <Reveal variant="up" className="my-8 md:my-10">
      {n === 1 && <Photo src={srcs[0]} ratio="16 / 9" onOpen={() => onOpen(srcs[0])} />}
      {n === 2 && (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {srcs.map((s) => <Photo key={s} src={s} ratio="4 / 3" onOpen={() => onOpen(s)} />)}
        </div>
      )}
      {n >= 3 && (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="col-span-2">
            <Photo src={srcs[0]} ratio="16 / 9" onOpen={() => onOpen(srcs[0])} />
          </div>
          {srcs.slice(1, 3).map((s) => <Photo key={s} src={s} ratio="4 / 3" onOpen={() => onOpen(s)} />)}
        </div>
      )}
    </Reveal>
  );
}

export function VideoBlock({ video }) {
  if (!video) return null;
  return (
    <Reveal variant="up" className="my-8 md:my-10">
      <figure>
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio: '16 / 9', background: '#000', border: '1px solid var(--hairline)' }}
        >
          <video
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain"
          >
            <source src={video.image} type={video.type} />
          </video>
        </div>
        <figcaption className="font-body text-xs mt-3 text-center" style={{ color: 'var(--fg-muted)' }}>
          {video.title}
        </figcaption>
      </figure>
    </Reveal>
  );
}
