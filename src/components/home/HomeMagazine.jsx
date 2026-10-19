import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { getBlogPosts } from '@/lib/api/content';

export default function HomeMagazine({ section = {} }) {
  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getBlogPosts({ limit: 3, skip: 0 })
      .then((rows) => { if (active) { setPosts(Array.isArray(rows) ? rows : []); setLoadError(false); } })
      .catch(() => { if (active) { setPosts([]); setLoadError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="chapter home-magazine-section" aria-label="مجله هفت طلایی">
      <div className="chapter-shell">
        <div className="home-magazine-heading">
          <StoryChapter index="08" eyebrow={section.badge_fa || 'MAGAZINE · مجله'} title={section.title_fa || 'دانش کاربردی برای انتخاب بهتر'} lead={section.subtitle_fa || 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگزینی محتوای ثابت در نبود دادهٔ CMS.'} />
          <Link to="/blog" className="home-news-all">ورود به مجله <ArrowLeft size={16} /></Link>
        </div>
        {loading ? <p className="home-content-status" role="status">در حال بارگذاری مقاله‌ها…</p> : posts.length > 0 ? (
          <div className="home-magazine-grid">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 90} variant="up">
                <Link to={`/blog/${post.slug}`} className="home-magazine-card group">
                  <div className="home-magazine-image">
                    <img src={post.image || '/banner/banner-four-bowls.webp'} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/banner/banner-four-bowls.webp'; }} />
                    <span className="home-magazine-number">۰{index + 1}</span>
                  </div>
                  <div className="home-magazine-copy">
                    <span>{post.category || 'راهنمای محصول'}</span>
                    <h3>{post.titleFA || post.titleEN || post.slug}</h3>
                    <p>{post.excerptFA || post.excerptEN || ''}</p>
                    <strong>مطالعه مقاله <ArrowLeft size={14} /></strong>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="home-content-status" role="status">{loadError ? 'مقاله‌ها از پایگاه داده دریافت نشدند.' : 'در حال حاضر مقالهٔ منتشرشده‌ای برای نمایش نیست.'}</p>
        )}
      </div>
    </section>
  );
}
