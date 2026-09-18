import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';

/**
 * Light, image-first product tile used by the home page's product grid —
 * a circular photo with the product name underneath.
 * The dark `ProductCard` remains the tile for the shop and product pages.
 */
export default function ProductCardLight({ product }) {
  const name = product.nameFA;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className="relative w-full aspect-square rounded-full overflow-hidden mb-4 transition-all duration-500 group-hover:-translate-y-1"
        style={{ background: '#fff', boxShadow: '0 16px 40px rgba(28,26,23,0.08)' }}
      >
        <Image
          src={product.image}
          alt={name}
          className="block w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          fittingType="fill"
        />
      </div>
      <h3
        className="font-heading font-bold text-center text-xs md:text-sm leading-snug"
        style={{ color: 'var(--ink)', fontFamily: 'Peyda, serif' }}
      >
        {name}
      </h3>
    </Link>
  );
}
