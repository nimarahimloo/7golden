import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useParallax } from '@/components/useParallax';

export default function PromoBanner({ image, badge, title, subtitle, cta, to = '/shop' }) {
  const { ref: parallaxRef, offset } = useParallax(0.15);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to={to}
          className="group relative block rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>

          {/* Background with parallax */}
          <div ref={parallaxRef} className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform' }}>
            <div
              className="absolute inset-0"
              style={{
                transform: `translateY(${offset}px) scale(1.12)`,
                transition: 'transform 0.1s linear',
              }}
            >
              <Image src={image} alt={title} className="w-full h-full" fittingType="fill" />
            </div>
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.2) 100%)' }} />
          <div
            className="relative z-10 p-7 md:p-12 flex flex-col justify-center min-h-[170px] md:min-h-[210px]"
            style={{
              backdropFilter: 'blur(4px) saturate(120%)',
              WebkitBackdropFilter: 'blur(4px) saturate(120%)',
            }}
          >
        
            <h3 className="font-heading text-lg md:text-3xl font-black mb-3 leading-tight gold-text-glow" style={{ color: '#fff', fontFamily: 'Peyda, serif' }}>
              {title}
            </h3>
            {subtitle &&
            <p className="font-body text-xs md:text-sm mb-4 max-w-md" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {subtitle}
              </p>
            }
            {cta &&
            <span className="inline-flex items-center gap-2 font-body text-sm font-bold w-fit px-5 py-2 rounded-full transition-all" style={{ color: '#F0CE5A', border: '1px solid rgba(232,197,71,0.3)' }}>
                {cta}
                <ChevronLeft size={14} style={{ transform: 'scaleX(-1)' }} className="transition-transform group-hover:-translate-x-1 lucide-chevron-right" />
              </span>
            }
          </div>
        </Link>
      </div>
    </section>);
}