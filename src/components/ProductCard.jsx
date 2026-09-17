import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { Image } from '@/components/ui/image';

export default function ProductCard({ product }) {
  const { lang, addToCart, isStoreMode } = useApp();
  const [adding, setAdding] = useState(false);

  const isFA = lang === 'fa';
  const name = isFA ? product.nameFA : product.nameEN;
  const badge = isFA ? product.badge : product.badgeEN;
  const origin = isFA ? product.originFA : product.originEN;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product, 1, 500);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card-luxury group relative block rounded-2xl overflow-hidden aspect-[3/4]"
      style={{ background: '#0A0A0A' }}
    >
      {/* Full-screen product image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={product.image}
          alt={name}
          className="block w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.08]"
          fittingType="fill"
        />
      </div>

      {/* Soft gold glow — fades in on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 60%)',
        }}
      />

      {/* Shimmer sweep */}
      <div className="product-shimmer-sweep absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div className="shimmer-stripe" />
      </div>

      {/* Gold border ring on hover */}
      <div className="product-gold-ring absolute inset-0 rounded-2xl pointer-events-none" />

      {/* Badge */}
      {badge && (
        <span
          className="absolute top-3 z-10 font-body text-[10px] font-extrabold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(212, 175, 55, 0.95)',
            color: '#0D0D0D',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
            [isFA ? 'right' : 'left']: '0.75rem',
          }}
        >
          {badge}
        </span>
      )}

      {/* Out of stock */}
      {isStoreMode && !product.inStock && (
        <span
          className="absolute top-3 z-10 font-body text-[10px] font-extrabold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            [isFA ? 'left' : 'right']: '0.75rem',
          }}
        >
          {t(lang, 'out_of_stock')}
        </span>
      )}

      {/* Bottom content — name always visible, details on hover */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 p-4"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 60%, transparent 100%)',
        }}
      >
        <h3
          className="font-heading font-extrabold text-white text-sm md:text-base leading-tight"
          style={{ fontFamily: headingFont, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
        >
          {name}
        </h3>
        <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100">
          {origin && <p className="font-body text-[11px] text-white/60 mb-3 mt-1.5">{origin}</p>}
          <div className="flex items-center justify-between gap-2">
            {isStoreMode ? (
              <>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-base" style={{ color: '#D4AF37', fontFamily: headingFont }}>
                    {product.priceDisplay}
                  </span>
                  <span className="font-body text-[10px] text-white/50">
                    {isFA ? 'تومان / کیلو' : 'IRR / kg'}
                  </span>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock || adding}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 flex-shrink-0"
                  style={{ background: '#D4AF37', color: '#0D0D0D', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}
                  aria-label={t(lang, 'add_to_cart')}
                >
                  <ShoppingBag size={16} />
                </button>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 font-body text-xs font-semibold" style={{ color: '#D4AF37' }}>
                {isFA ? 'مشاهده جزئیات' : 'View Details'}
                <ChevronLeft size={12} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}