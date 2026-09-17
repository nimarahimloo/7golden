import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { t, categoryLabel } from '@/lib/i18n';
import { getBlogPosts } from '@/lib/api/content';
import SectionHeader from '@/components/SectionHeader';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import { Image } from '@/components/ui/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import LogoLoader from '@/components/LogoLoader';
import PageHero from '@/components/PageHero';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Blog() {
  const { lang, dir } = useApp();
  const isFA = lang === 'fa';
  const ArrowIcon = isFA ? ArrowLeft : ArrowRight;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await getBlogPosts();
        if (active) setPosts(items);
      } catch (e) {
        // graceful
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div dir={dir} style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={isFA ? `مجله ${SITE_SEO.siteNameFA} — اخبار و آموزش` : `${SITE_SEO.siteNameEN} Blog — News & Education`}
        description={isFA ? 'آخرین اخبار، مقالات و آموزش‌های دنیای خشکبار و آجیل در مجله هفت‌طلایی.' : 'Latest news, articles, and education about dried fruits and nuts from 7Golden blog.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/blog`}
      />

      {/* Hero */}
      <PageHero
        image="https://7golden.co/wp-content/uploads/2022/09/blog-new-3-min.jpg"
        title={t(lang, 'blog_title')}
        subtitle={isFA ? 'اخبار و آموزش' : 'News & Education'}
        badge={isFA ? 'وبلاگ' : 'Blog'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16">

        {loading ? (
          <LogoLoader fullScreen={false} />
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
              {isFA ? 'به‌زودی مطالب جدید منتشر خواهد شد.' : 'New articles coming soon.'}
            </p>
          </div>
        ) : (
          <>
            {/* Category filter */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 rounded-full font-body text-sm font-semibold transition-all"
                  style={{
                    background: activeCategory === 'all' ? 'var(--accent)' : 'transparent',
                    color: activeCategory === 'all' ? 'hsl(var(--accent-foreground))' : 'var(--fg)',
                    border: `1px solid ${activeCategory === 'all' ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {isFA ? 'همه' : 'All'}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-4 py-2 rounded-full font-body text-sm font-semibold transition-all"
                    style={{
                      background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                      color: activeCategory === cat ? 'hsl(var(--accent-foreground))' : 'var(--fg)',
                      border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {categoryLabel(lang, cat)}
                  </button>
                ))}
              </div>
            )}

            {/* Featured post */}
            <AnimatedSection className="mb-12">
              <Link to={`/blog/${featured.slug}`} className="group block rounded-3xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[360px] overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={isFA ? featured.titleFA : featured.titleEN}
                      className="w-full h-full"
                      fittingType="fill"
                      style={{ transition: 'transform 0.8s ease', transform: 'scale(1)' }}
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center" style={{ background: 'var(--card-bg)' }}>
                    <span className="font-subheading text-xs uppercase tracking-wider mb-3 block" style={{ color: 'var(--accent)', fontFamily: isFA ? 'Kalameh, serif' : 'Georgia, serif' }}>
                      {isFA ? 'ویژه' : 'Featured'}
                    </span>
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-4 leading-tight" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                      {isFA ? featured.titleFA : featured.titleEN}
                    </h2>
                    <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--fg-muted)' }}>
                      {isFA ? featured.excerptFA : featured.excerptEN}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                        {isFA ? featured.date : featured.dateEN}
                      </span>
                      <span className="flex items-center gap-2 font-body text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                        {t(lang, 'read_more')}
                        <ArrowIcon size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 100}>
                  <Link to={`/blog/${post.slug}`} className="group block rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={isFA ? post.titleFA : post.titleEN}
                        className="w-full h-full"
                        fittingType="fill"
                        style={{ transition: 'transform 0.8s ease' }}
                      />
                    </div>
                    <div className="p-6">
                      <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                        {isFA ? post.date : post.dateEN}
                      </span>
                      <h3 className="font-body font-extrabold text-base mt-2 mb-3 leading-snug" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                        {isFA ? post.titleFA : post.titleEN}
                      </h3>
                      <p className="font-body text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--fg-muted)' }}>
                        {isFA ? post.excerptFA : post.excerptEN}
                      </p>
                      <span className="flex items-center gap-2 font-body text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                        {t(lang, 'read_more')}
                        <ArrowIcon size={12} />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}