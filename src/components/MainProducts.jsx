import React from 'react';
import { Link } from 'react-router-dom';
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
 * full-width image bands. The picture carries the section — only the product
 * name sits on it; the technical specifications live on the product page.
 * Images come from the matching Category entity, so they stay editable in the CMS.
 */
export default function MainProducts({ categories = [], products = [] }) {
  const headingFont = 'Peyda, serif';

  const imageFor = (slug) => categories.find(c => c.slug === slug)?.image || null;
  // Link each flagship section to the first real product of that category.
  const linkFor = (slug) => {
    const first = products.find(p => p.category === slug);
    return first ? `/product/${first.id}` : '/shop';
  };

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header — heading kept for structure and SEO */}
        <div className="max-w-2xl mb-8 md:mb-12">
          <span className="eyebrow block mb-3">MAIN PRODUCTS</span>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
            سه ستون تولید هفت‌طلایی
          </h2>
          <hr className="hairline mt-8" />
        </div>

        {/* Image-led product bands — the picture fills the frame, the caption
            stays down to a label and the product name. */}
        <div className="flex flex-col gap-5 md:gap-8">
          {MAIN_PRODUCTS.map((product, i) => {
            const image = imageFor(product.category);
            return (
              <AnimatedSection key={product.category} delay={i * 80}>
                <Link
                  to={linkFor(product.category)}
                  className="group relative block rounded-3xl overflow-hidden"
                  style={{ border: '1px solid var(--hairline)' }}
                >
                  <div
                    className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden"
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

                    {/* Dark base so the name stays readable over any photo */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(2,1,0,0.92) 0%, rgba(2,1,0,0.4) 45%, rgba(2,1,0,0.05) 100%)',
                      }}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                      <span className="eyebrow block mb-2">{product.category}</span>
                      <h3
                        className="font-heading text-2xl md:text-4xl font-black"
                        style={{ color: 'var(--ink)', fontFamily: headingFont }}
                      >
                        {product.nameFA}
                      </h3>
                    </div>
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
