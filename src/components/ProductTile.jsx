import { Link } from 'react-router-dom';

/**
 * Shared product card (home rows, shop grid, related):
 * photo on a plain surface — no border or crop — Persian name below.
 * Square image, always shown whole (`object-contain`).
 */
export default function ProductTile({ product, className = '', style, loading = 'lazy' }) {
  const id = product.slug || product.id;
  const name = product.nameFA || product.name_fa || '';
  return (
    <Link
      to={`/product/${id}`}
      className={`group block text-center ${className}`}
      style={style}
      draggable={false}
    >
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={product.image || '/logo-symbol.webp'}
          alt={name}
          loading={loading}
          decoding="async"
          draggable={false}
          className="block w-full aspect-square object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <span
        className="block mt-3.5 text-sm md:text-[0.9375rem] font-medium leading-snug transition-colors duration-300"
        style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}
      >
        {name}
      </span>
    </Link>
  );
}
