import { Link } from 'react-router-dom';

/**
 * The one product card used everywhere (home rows, shop grid, related
 * products): the product photo on a plain surface — no background, border or
 * crop — with the Persian name underneath. The photo is always a square shown
 * whole (`object-contain`) so every card looks identical.
 */
export default function ProductTile({ product, className = '', style }) {
  const id = product.slug || product.id;
  const name = product.nameFA || product.name_fa || '';
  return (
    <Link
      to={`/product/${id}`}
      className={`group block text-center ${className}`}
      style={style}
      draggable={false}
    >
      <img
        src={product.image || '/logo.webp'}
        alt={name}
        loading="lazy"
        draggable={false}
        className="block w-full aspect-square object-contain transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span
        className="block mt-3 text-sm md:text-base font-semibold leading-snug"
        style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}
      >
        {name}
      </span>
    </Link>
  );
}
