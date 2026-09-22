import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { useParallaxZoom } from '@/components/useParallaxZoom';

/**
 * Image-first product tile used by the home page's product grid —
 * a circular photo with the product name underneath, on the dark & gold
 * palette. The taller `ProductCard` remains the tile for the shop and
 * product pages.
 */
export default function ProductCardRound({ product }) {
  const name = product.nameFA;
  const zoomRef = useParallaxZoom({ speed: 0, maxZoom: 1.14, baseScale: 1.0 });

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className="relative w-full aspect-square rounded-full overflow-hidden mb-4 transition-all duration-500 group-hover:-translate-y-1"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--hairline)',
          boxShadow: 'var(--soft-shadow)',
        }}
      >
        <div ref={zoomRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
          <Image
            src={product.image}
            alt={name}
            className="block w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            fittingType="fill"
          />
        </div>
        {/* Gold ring — fades in on hover */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: 'inset 0 0 0 2px rgba(240,206,90,0.5), 0 0 40px rgba(240,206,90,0.15)' }}
        />
      </div>
      <h3
        className="font-heading font-bold text-center text-xs md:text-sm leading-snug"
        style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}
      >
        {name}
      </h3>
    </Link>
  );
}
