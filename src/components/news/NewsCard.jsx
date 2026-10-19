import { NEWS_CATEGORIES } from '@/lib/news-content';
import EditorialCard from '@/components/EditorialCard';

export default function NewsCard({ item, className = '' }) {
  const cat = NEWS_CATEGORIES[item.category];
  const categoryLabel = cat?.label || item.categoryLabel || item.category || 'خبر';

  return (
    <EditorialCard
      to={`/news/${item.slug || item.id}`}
      image={item.image || '/banner/banner-four-bowls.webp'}
      alt={item.title}
      title={item.title}
      category={categoryLabel}
      categoryTone={cat?.tone || 'var(--gold-1)'}
      date={item.date}
      excerpt={item.excerpt}
      readMore="خواندن خبر"
      photoCount={item.photos?.length || 0}
      videoCount={item.videos?.length || 0}
      className={className}
    />
  );
}
