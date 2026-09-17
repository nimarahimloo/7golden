import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, ChevronLeft, Tag } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { categoryLabel } from '@/lib/i18n';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/api/content';
import { Image } from '@/components/ui/image';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import Seo from '@/components/Seo';
import LogoLoader from '@/components/LogoLoader';
import BackButton from '@/components/BackButton';
import PullToRefresh from '@/components/PullToRefresh';
import { SITE_SEO, articleJsonLd } from '@/lib/seo';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const isFA = true;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const ArrowIcon = isFA ? ArrowLeft : ArrowRight;

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const p = await getBlogPostBySlug(slug);
      setPost(p);
      if (p) {
        const all = await getBlogPosts();
        setRelated(all.filter(x => x.slug !== p.slug).slice(0, 3));
      }
    } catch (e) {
      // graceful
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    (async () => {
      await loadData();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return <LogoLoader />;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--bg)' }} dir="rtl">
        <div className="text-center">
          <p className="font-body text-lg mb-4" style={{ color: 'var(--fg-muted)' }}>
            {isFA ? 'مقاله یافت نشد' : 'Article not found'}
          </p>
          <Link to="/blog" className="font-body text-sm" style={{ color: 'var(--accent)' }}>
            {isFA ? 'بازگشت به مجله' : 'Back to blog'}
          </Link>
        </div>
      </div>
    );
  }

  const title = isFA ? post.titleFA : post.titleEN;
  const excerpt = isFA ? post.excerptFA : post.excerptEN;
  const date = isFA ? post.date : post.dateEN;
  const category = categoryLabel(post.category);

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={`${title} | ${isFA ? SITE_SEO.siteNameFA : SITE_SEO.siteNameEN}`}
        description={excerpt}
        image={post.image}
        type="article"
        canonical={`${SITE_SEO.baseUrl}/blog/${post.slug}`}
        jsonLd={articleJsonLd(post)}
      />

      <PullToRefresh onRefresh={loadData}>
      {/* ===== CINEMATIC HERO ===== */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {/* Back button overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
          <BackButton to="/blog" className="text-white/80 hover:text-white" />
        </div>
        <img
          src={post.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'kenBurns 20s ease-out forwards', filter: 'brightness(0.6)' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.5) 0%, rgba(13,13,13,0.3) 40%, rgba(13,13,13,0.95) 100%)',
        }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-12 w-full text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="glass-pill inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-body text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                <Tag size={11} />
                {category}
              </span>
              <span className="glass-pill inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                <Calendar size={11} />
                {date}
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl md:text-4xl lg:text-5xl leading-tight gold-text-glow" style={{ color: '#fff', fontFamily: headingFont }}>
              {title}
            </h1>
            {excerpt && (
              <p className="font-body text-sm md:text-base mt-5 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== ARTICLE BODY ===== */}
      <article className="max-w-3xl mx-auto px-4 sm:px-8 py-14 md:py-20 -mt-10 relative z-10">
        <div className="rounded-3xl p-8 md:p-14" style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-body text-sm mb-8" style={{ color: 'var(--fg-muted)' }}>
            <Link to="/" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'خانه' : 'Home'}</Link>
            <ChevronLeft size={12} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            <Link to="/blog" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'مجله' : 'Blog'}</Link>
            <ChevronLeft size={12} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            <span className="truncate" style={{ color: 'var(--fg)' }}>{title}</span>
          </div>

          {/* Gold divider */}
          <div className="gold-divider mb-10" style={{ marginLeft: 0 }} />

          {/* Markdown content */}
          <div className="prose-content font-body text-[15px] leading-[2]">
            <ReactMarkdown
              components={{
                h1: ({node, ...p}) => <h2 className="font-heading font-black text-xl md:text-2xl mt-10 mb-5 leading-snug" style={{ color: 'var(--fg)', fontFamily: headingFont }} {...p} />,
                h2: ({node, ...p}) => <h2 className="font-heading font-black text-xl md:text-2xl mt-10 mb-5 leading-snug" style={{ color: 'var(--fg)', fontFamily: headingFont }} {...p} />,
                h3: ({node, ...p}) => <h3 className="font-heading font-extrabold text-lg mt-8 mb-4" style={{ color: 'var(--fg)', fontFamily: headingFont }} {...p} />,
                p: ({node, ...p}) => <p className="mb-5" style={{ color: 'var(--fg-muted)' }} {...p} />,
                ul: ({node, ...p}) => <ul className="mb-5 space-y-2.5" style={{ color: 'var(--fg-muted)' }} {...p} />,
                ol: ({node, ...p}) => <ol className="mb-5 space-y-2.5 list-decimal ms-6" style={{ color: 'var(--fg-muted)' }} {...p} />,
                li: ({node, ...p}) => <li className="flex gap-2.5 items-start" {...p}><span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} /><span>{p.children}</span></li>,
                strong: ({node, ...p}) => <strong className="font-bold" style={{ color: 'var(--fg)' }} {...p} />,
                blockquote: ({node, ...p}) => <blockquote className="my-7 px-6 py-4 rounded-2xl" style={{ background: 'rgba(212,175,55,0.06)', borderInlineStart: '3px solid var(--accent)', color: 'var(--fg)' }} {...p} />,
                a: ({node, ...p}) => <a className="transition-colors underline" style={{ color: 'var(--accent)' }} {...p} />,
                img: ({node, ...p}) => <img className="rounded-2xl my-6 w-full" {...p} />,
              }}
            >
              {post.content || ''}
            </ReactMarkdown>
          </div>

          {/* Footer of article */}
          <div className="mt-10 pt-6 flex items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
            <Link to="/blog" className="inline-flex items-center gap-2 font-body text-sm font-semibold transition-all hover:gap-3" style={{ color: 'var(--accent)' }}>
              <ArrowIcon size={14} />
              {isFA ? 'بازگشت به مجله' : 'Back to blog'}
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span className="font-heading font-black text-sm" style={{ color: 'hsl(var(--accent-foreground))' }}>7G</span>
              </div>
              <div>
                <div className="font-body text-sm font-semibold" style={{ color: 'var(--fg)' }}>{isFA ? 'هفت‌طلایی' : '7Golden'}</div>
                <div className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'تحریریه مجله' : 'Editorial'}</div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ===== RELATED POSTS ===== */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-20">
          <h2 className="font-heading font-black text-xl md:text-2xl mb-8 text-center" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'مطالب مرتبط' : 'Related Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rp, i) => (
              <BlogCard key={rp.id} post={rp} delay={i * 100} isFA={isFA} headingFont={headingFont} ArrowIcon={ArrowIcon} />
            ))}
          </div>
        </section>
      )}
      </PullToRefresh>
    </div>
  );
}

function BlogCard({ post, delay = 0, isFA, headingFont, ArrowIcon }) {
  const { ref, visible } = useScrollAnimation();
  const title = isFA ? post.titleFA : post.titleEN;
  const excerpt = isFA ? post.excerptFA : post.excerptEN;
  const date = isFA ? post.date : post.dateEN;

  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <Link to={`/blog/${post.slug}`} className="group block rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="aspect-[4/3] overflow-hidden">
          <Image src={post.image} alt={title} className="w-full h-full" fittingType="fill" style={{ transition: 'transform 0.8s ease' }} />
        </div>
        <div className="p-6">
          <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{date}</span>
          <h3 className="font-body font-extrabold text-base mt-2 mb-3 leading-snug" style={{ color: 'var(--fg)', fontFamily: headingFont }}>{title}</h3>
          <p className="font-body text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--fg-muted)' }}>{excerpt}</p>
          <span className="flex items-center gap-2 font-body text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            {isFA ? 'ادامه مطلب' : 'Read more'}
            <ArrowIcon size={12} />
          </span>
        </div>
      </Link>
    </div>
  );
}