import { Link } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Play } from 'lucide-react';

const FALLBACK_IMAGE = '/banner/banner-four-bowls.webp';

/** Shared editorial card used by both the blog and news grids. */
export default function EditorialCard({
  to,
  image,
  alt,
  title,
  category,
  categoryTone,
  date,
  excerpt,
  readMore = 'ادامه مطلب',
  photoCount = 0,
  videoCount = 0,
  className = '',
}) {
  return (
    <Link to={to} className={`editorial-card group ${className}`}>
      <div className="editorial-card-media">
        <img
          src={image || FALLBACK_IMAGE}
          alt={alt || title || ''}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {category && (
          <span className="editorial-card-category" style={{ color: categoryTone || 'var(--gold-1)' }}>
            {category}
          </span>
        )}
      </div>
      <div className="editorial-card-copy">
        {date && <span className="editorial-card-date">{date}</span>}
        <h3 className="editorial-card-title" title={title}>{title}</h3>
        {excerpt && <p className="editorial-card-excerpt">{excerpt}</p>}
        <div className="editorial-card-footer">
          <span className="editorial-card-readmore">{readMore}<ChevronLeft size={15} /></span>
          {(photoCount > 0 || videoCount > 0) && (
            <span className="editorial-card-counts">
              {photoCount > 0 && <span><ImageIcon size={13} />{photoCount.toLocaleString('fa-IR')}</span>}
              {videoCount > 0 && <span><Play size={13} />{videoCount.toLocaleString('fa-IR')}</span>}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
