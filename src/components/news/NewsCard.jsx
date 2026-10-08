import { Link } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Play } from 'lucide-react';
import { NEWS_CATEGORIES } from '@/lib/news-content';

/**
 * One announcement tile — shared by the /news grid and the "related news"
 * strip on an article. The whole tile links to the article page.
 */
export default function NewsCard({ item }) {
  const cat = NEWS_CATEGORIES[item.category];
  const photoCount = item.photos?.length || 0;
  const videoCount = item.videos?.length || 0;

  return (
    <Link
      to={`/news/${item.id}`}
      className="group relative rounded-3xl overflow-hidden gold-frame h-full flex flex-col"
      style={{ background: 'var(--surface-subtle, rgba(255,255,255,0.03))' }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className="absolute top-3 right-3 px-3 py-1 rounded-full font-body text-xs"
          style={{ background: 'rgba(7,6,4,0.72)', border: '1px solid var(--hairline-strong)', color: cat?.tone, backdropFilter: 'blur(8px)' }}
        >
          {cat?.label}
        </span>
      </div>
      <div className="p-5 text-right flex flex-col gap-2 flex-1">
        <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{item.date}</span>
        <h3 className="font-heading font-bold text-base md:text-lg leading-snug" style={{ color: 'var(--ink)' }}>
          {item.title}
        </h3>
        <p className="font-body text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--fg-muted)' }}>
          {item.excerpt}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <span className="font-body text-xs inline-flex items-center gap-1" style={{ color: 'var(--gold-2)' }}>
            خواندن خبر <ChevronLeft size={14} />
          </span>
          <span className="font-body text-xs inline-flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
            {photoCount > 0 && (
              <span className="inline-flex items-center gap-1"><ImageIcon size={13} />{photoCount.toLocaleString('fa-IR')}</span>
            )}
            {videoCount > 0 && (
              <span className="inline-flex items-center gap-1"><Play size={13} />{videoCount.toLocaleString('fa-IR')}</span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
