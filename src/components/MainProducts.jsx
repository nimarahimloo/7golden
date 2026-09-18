import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MAIN_PRODUCTS } from '@/lib/corporate-content';
import { Image } from '@/components/ui/image';
import { useScrollAnimation } from '@/components/useScrollAnimation';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * The three flagship products (pistachio, almond, hazelnut) presented as
 * alternating full-width sections with technical specifications.
 * Images come from the matching Category entity, so they stay editable in the CMS.
 */
export default function MainProducts({ categories = [], products = [] }) {
  const isFA = true;
  const headingFont = 'Peyda, serif';

  const imageFor = (slug) => categories.find(c => c.slug === slug)?.image || null;
  // Link each flagship section to the first real product of that category.
  const linkFor = (slug) => {
    const first = products.find(p => p.category === slug);
    return first ? `/product/${first.id}` : '/shop';
  };

  return (
    <section className="py-14 md:py-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-8 md:mb-12">
          <span className="eyebrow block mb-3">MAIN PRODUCTS</span>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
            سه ستون تولید هفت‌طلایی
          </h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            تمرکز ما بر سه محصول راهبردی است: پسته، بادام و فندق. هر سه با گریدبندی مشخص،
            بسته‌بندی صنعتی و ظرفیت تأمین مستمر برای صنایع شکلات، قنادی و بستنی عرضه می‌شوند.
          </p>
          <hr className="hairline mt-8" />
        </div>

        {/* Wide, image-led product bands — the picture carries the section,
            the caption card stays down to a label, a name and one short line.
            Full specifications live on the product page. */}
        <div className="flex flex-col gap-6 md:gap-10">
          {MAIN_PRODUCTS.map((product, i) => {
            const image = imageFor(product.category);
            const reversed = i % 2 === 1;
            return (
              <AnimatedSection key={product.category} delay={i * 80}>
                <Link
                  to={linkFor(product.category)}
                  className="group grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden"
                  style={{ background: '#fff', boxShadow: '0 18px 50px rgba(28,26,23,0.07)' }}
                >
                  <div
                    className={`relative lg:col-span-8 min-h-[220px] lg:min-h-[300px] overflow-hidden ${reversed ? 'lg:order-2' : ''}`}
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    {image && (
                      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                        <Image
                          src={image}
                          alt={product.nameFA}
                          className="w-full h-full"
                          fittingType="fill"
                        />
                      </div>
                    )}
                  </div>

                  <div className={`lg:col-span-4 flex flex-col justify-center p-6 md:p-9 ${reversed ? 'lg:order-1' : ''}`}>
                    <span className="eyebrow block mb-3">{product.category}</span>
                    <h3 className="font-heading text-xl md:text-2xl font-extrabold" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
                      {product.nameFA}
                    </h3>
                    <hr className="hairline my-4" />
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      {product.tagline}
                    </p>

                    <span
                      className="inline-flex items-center gap-2 font-body text-sm font-semibold mt-6 transition-all group-hover:gap-3"
                      style={{ color: 'var(--brass)' }}
                    >
                      مشاهده مشخصات کامل
                      <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
