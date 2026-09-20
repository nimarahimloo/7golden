import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/lib/AppContext';
import { t, categoryLabel } from '@/lib/i18n';
import { getBlogPosts } from '@/lib/api/content';
import { Image } from '@/components/ui/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import LogoLoader from '@/components/LogoLoader';
import PageHero from '@/components/PageHero';
import BackButton from '@/components/BackButton';
import PullToRefresh from '@/components/PullToRefresh';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';

import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import DepthParallax from '@/components/story/DepthParallax';
import Marquee from '@/components/story/Marquee';

export default function Blog() {
  const isFA = true;
  const ArrowIcon = isFA ? ArrowLeft : ArrowRight;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const loadData = async () => {
    try {
      const items = await getBlogPosts();
      setPosts(items);
    } catch (e) {
      // graceful
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await loadData();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={isFA ? `مجله ${SITE_SEO.siteNameFA} — اخبار و آموزش` : `${SITE_SEO.siteNameEN} Blog — News & Education`}
        description={isFA ? 'آخرین اخبار، مقالات و آموزش‌های دنیای خشکبار و آجیل در مجله هفت‌طلایی.' : 'Latest news, articles, and education about dried fruits and nuts from 7Golden blog.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/blog`}
      />

      <PullToRefresh onRefresh={loadData}>
      {/* Hero */}
      <div className="relative">
        <PageHero
          image="/gallery/AQ8A1530AQ8A1530.JPG"
          title={t('blog_title')}
          subtitle={isFA ? 'اخبار و آموزش' : 'News & Education'}
          badge={isFA ? 'وبلاگ' : 'Blog'}
        />
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
          <BackButton to="/" className="text-white/80 hover:text-white" />
        </div>
      </div>

      {/* ===== Featured post — cinematic depth parallax ===== */}
      {!loading && posts.length > 0 && featured && (
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="01"
              eyebrow="FEATURED"
              title={isFA ? 'مطلب ویژه' : 'Featured'}
              className="mb-10"
            />
            <Reveal variant="up">
            <Link to={`/blog/${featured.slug}`} className="group block">
              <DepthParallax
                src={featured.image}
                alt={isFA ? featured.titleFA : featured.titleEN}
                ratio="aspect-[4/3] md:aspect-[21/9]"
                className="rounded-3xl"
              >
                <div>
                  <span className="eyebrow block mb-3">{isFA ? 'ویژه' : 'Featured'}</span>
                  <h2 className="display-md mb-3" style={{ color: 'var(--ink)' }}>
                    {isFA ? featured.titleFA : featured.titleEN}
                  </h2>
                  <p className="font-body text-sm leading-relaxed max-w-xl" style={{ color: 'var(--fg-muted)' }}>
                    {isFA ? featured.excerptFA : featured.excerptEN}
                  </p>
                  <div className="flex items-center gap-2 mt-5">
                    <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                      {isFA ? featured.date : featured.dateEN}
                    </span>
                    <span className="flex items-center gap-1.5 font-body text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {t('read_more')}
                      <ArrowIcon size={14} />
                    </span>
                  </div>
                </div>
              </DepthParallax>
            </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Category filter ===== */}
      {!loading && posts.length > 0 && categories.length > 1 && (
        <div className="chapter-shell pb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-full font-body text-sm font-semibold transition-all"
              style={{
                background: activeCategory === 'all' ? 'var(--accent)' : 'transparent',
                color: activeCategory === 'all' ? 'hsl(var(--accent-foreground))' : 'var(--fg)',
                border: `1px solid ${activeCategory === 'all' ? 'var(--accent)' : 'var(--hairline)'}`,
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
                  border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--hairline)'}`,
                }}
              >
                {categoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Grid — cinematic cards ===== */}
      <div className="chapter pt-8">
        <div className="chapter-shell">
          {loading ? (
            <LogoLoader fullScreen={false} />
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                {isFA ? 'به‌زودی مطالب جدید منتشر خواهد شد.' : 'New articles coming soon.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 100} variant="up">
                  <Link to={`/blog/${post.slug}`} className="group block blog-cine-card" style={{ aspectRatio: '3 / 4' }}>
                    <div className="blog-cine-card-image absolute inset-0">
                      <Image
                        src={post.image}
                        alt={isFA ? post.titleFA : post.titleEN}
                        className="w-full h-full"
                        fittingType="fill"
                      />
                    </div>
                    <div className="blog-cine-overlay" />
                    <div className="blog-cine-content">
                      <span className="font-body text-xs block mb-2" style={{ color: 'var(--fg-muted)' }}>
                        {isFA ? post.date : post.dateEN}
                      </span>
                      <h3 className="display-sm mb-2" style={{ color: 'var(--ink)' }}>
                        {isFA ? post.titleFA : post.titleEN}
                      </h3>
                      <p className="font-body text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--fg-muted)' }}>
                        {isFA ? post.excerptFA : post.excerptEN}
                      </p>
                      <span className="flex items-center gap-1.5 font-body text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                        {t('read_more')}
                        <ArrowIcon size={12} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Closing parallax band ===== */}
      {!loading && posts.length > 0 && (
        <section className="closing-band" style={{ minHeight: '40vh' }}>
          <div className="closing-band-bg">
            <img src="/gallery/AQ8A1542AQ8A1542.JPG" alt="" />
          </div>
          <div className="relative z-10 chapter-shell py-20 text-center">
            <Reveal variant="up">
              <span className="eyebrow block mb-5">EXPLORE</span>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <h2 className="display-lg" style={{ color: 'var(--ink)' }}>
                <span className="gold-text">دنیای خشکبار</span>
              </h2>
            </Reveal>
            <Reveal variant="up" delay={160} className="mt-8">
              <Link to="/shop" className="btn-gold inline-flex">
                {isFA ? 'مشاهده محصولات' : 'View products'}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <Marquee items={['پسته', 'بادام', 'فندق', 'صادرات', 'کیفیت', 'صنایع غذایی']} />
      </PullToRefresh>
    </div>
  );
}
