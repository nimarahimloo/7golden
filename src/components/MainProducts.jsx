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
    <section className="py-12 md:py-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="font-subheading text-sm uppercase block mb-2" style={{ color: 'var(--accent)', fontFamily: 'Kalameh, serif' }}>
            محصولات اصلی
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            سه ستون تولید هفت‌طلایی
          </h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            تمرکز ما بر سه محصول راهبردی است: پسته، بادام و فندق. هر سه با گریدبندی مشخص،
            بسته‌بندی صنعتی و ظرفیت تأمین مستمر برای صنایع شکلات، قنادی و بستنی عرضه می‌شوند.
          </p>
        </div>

        {/* Alternating product sections */}
        <div className="flex flex-col gap-10 md:gap-16">
          {MAIN_PRODUCTS.map((product, i) => {
            const image = imageFor(product.category);
            const reversed = i % 2 === 1;
            return (
              <AnimatedSection key={product.category} delay={i * 100}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center`}>
                  <div className={reversed ? 'lg:order-2' : ''}>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] relative" style={{ border: '1px solid var(--border)' }}>
                      {image ? (
                        <Image src={image} alt={product.nameFA} className="w-full h-full object-cover" fittingType="fill" />
                      ) : (
                        <div className="w-full h-full" style={{ background: 'hsl(var(--muted))' }} />
                      )}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                      <span className="absolute bottom-4 font-heading font-black text-2xl md:text-3xl text-white" style={{ fontFamily: headingFont, right: '1rem' }}>
                        {product.nameFA}
                      </span>
                    </div>
                  </div>

                  <div className={reversed ? 'lg:order-1' : ''}>
                    <span className="font-subheading text-sm uppercase block mb-2" style={{ color: 'var(--accent)', fontFamily: 'Kalameh, serif' }}>
                      {product.tagline}
                    </span>
                    <h3 className="font-heading text-xl md:text-2xl font-extrabold mb-3" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                      {product.nameFA}
                    </h3>
                    <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-muted)' }}>
                      {product.descFA}
                    </p>

                    {/* Spec table */}
                    <dl className="rounded-2xl overflow-hidden mb-5" style={{ border: '1px solid var(--border)' }}>
                      {product.specs.map((spec, si) => (
                        <div
                          key={spec.label}
                          className="flex items-start gap-3 px-4 py-3"
                          style={{ borderTop: si === 0 ? 'none' : '1px solid var(--border)', background: si % 2 ? 'hsl(var(--card))' : 'transparent' }}
                        >
                          <dt className="font-body text-xs font-semibold flex-shrink-0 w-28" style={{ color: 'var(--accent)' }}>
                            {spec.label}
                          </dt>
                          <dd className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <Link
                      to={linkFor(product.category)}
                      className="inline-flex items-center gap-2 font-body text-sm font-semibold transition-all hover:gap-3"
                      style={{ color: 'var(--accent)' }}
                    >
                      مشاهده مشخصات کامل
                      <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
