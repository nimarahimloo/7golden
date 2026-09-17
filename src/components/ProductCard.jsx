import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { Image } from '@/components/ui/image';
import { useParallax } from '@/components/useParallax';

export default function ProductCard({ product }) {
  const { addToCart, isStoreMode } = useApp();
  const [adding, setAdding] = useState(false);
  const { ref: parallaxRef, offset } = useParallax(0.12);

  const isFA = true;
  const name = isFA ? product.nameFA : product.nameEN;
  // const badge = isFA ? product.badge : product.badgeEN;
  // const origin = isFA ? product.originFA : product.originEN;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    // addToCart(product, 1, 500);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card-luxury group relative block rounded-2xl overflow-hidden aspect-[3/4]"
      style={{ background: '#0A0A0A' }}
    >
      {/* Full-screen product image with parallax */}
      <div className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform' }}>
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${offset}px) scale(1.12)`,
            transition: 'transform 0.1s linear',
          }}
        >
          <Image
            src={product.image}
            alt={name}
            className="block w-full h-full transition-transform ease-out group-hover:scale-[1.08] object-contain"
            fittingType="fill"
          />
        </div>
      </div>

      {/* Soft gold glow — fades in on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(232,197,71,0.2) 0%, transparent 60%)',
        }}
      />

      {/* Shimmer sweep */}
      <div className="product-shimmer-sweep absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div className="shimmer-stripe" />
      </div>

      {/* Gold border ring on hover */}
      <div className="product-gold-ring absolute inset-0 rounded-2xl pointer-events-none" />

      {/* Badge */}
      {/* {badge && (
        <span
          className="absolute top-3 z-10 font-body text-sm font-extrabold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(232, 197, 71, 0.95)',
            color: '#0D0D0D',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(232,197,71,0.3)',
            [isFA ? 'right' : 'left']: '0.75rem',
          }}
        >
          {badge}
        </span>
      )} */}

      {/* Out of stock */}
      {isStoreMode && !product.inStock && (
        <span
          className="absolute top-3 z-10 font-body text-sm font-extrabold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            [isFA ? 'left' : 'right']: '0.75rem',
          }}
        >
          {t('out_of_stock')}
        </span>
      )}

      {/* Bottom content — frosted glass panel with depth */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 p-4"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 55%, transparent 100%)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        }}
      >
        <h3
          className="font-heading font-extrabold text-white text-sm md:text-base leading-tight"
          style={{ fontFamily: headingFont, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
        >
          {name}
        </h3>
        <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100">
          <div className="flex items-center justify-between gap-2">
            {isStoreMode ? (
              <>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-base" style={{ color: '#F0CE5A', fontFamily: headingFont }}>
                    {product.priceDisplay}
                  </span>
                  <span className="font-body text-sm text-white/50">
                    {isFA ? 'تومان / کیلو' : 'IRR / kg'}
                  </span>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock || adding}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 flex-shrink-0"
                  style={{ background: '#F0CE5A', color: '#0D0D0D', boxShadow: '0 4px 16px rgba(232,197,71,0.3)' }}
                  aria-label={t('add_to_cart')}
                >
                  <ShoppingBag size={16} />
                </button>
              </>
            ) : (
             <></>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}