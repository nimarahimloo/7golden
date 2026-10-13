import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { EDITORIAL_BLOG_POSTS } from '@/lib/editorial-blog-content';

export default function HomeMagazine() {
  const posts = EDITORIAL_BLOG_POSTS.slice(0, 3);

  return (
    <section className="chapter home-magazine-section" aria-label="مجله هفت طلایی">
      <div className="chapter-shell">
        <div className="home-magazine-heading">
          <StoryChapter
            index="08"
            eyebrow="MAGAZINE · مجله"
            title="دانش کاربردی برای انتخاب بهتر"
            lead="راهنماهای تخصصی برای انتخاب فرم مناسب فندق، پسته و بادام در فرمولاسیون صنایع غذایی؛ جدا از خبرها و اطلاعیه‌های مجموعه."
          />
          <Link to="/blog" className="home-news-all">
            ورود به مجله <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="home-magazine-grid">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 90} variant="up">
              <Link to={`/blog/${post.slug}`} className="home-magazine-card group">
                <div className="home-magazine-image">
                  <img src={post.image} alt="" loading="lazy" decoding="async" />
                  <span className="home-magazine-number">۰{index + 1}</span>
                </div>
                <div className="home-magazine-copy">
                  <span>{post.category === 'industry' ? 'نگاه صنعتی' : 'راهنمای محصول'}</span>
                  <h3>{post.titleFA}</h3>
                  <p>{post.excerptFA}</p>
                  <strong>مطالعه مقاله <ArrowLeft size={14} /></strong>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
