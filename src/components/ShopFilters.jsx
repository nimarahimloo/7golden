import React from 'react';
import { Check } from 'lucide-react';

export default function ShopFilters({ filters, setFilters, categories = [], activeCategory = 'all', onCategoryChange }) {
  const isFA = true;

  const priceRanges = [
    { id: 'under-500', label: isFA ? 'زیر ۵۰۰ هزار' : 'Under 500K', min: 0, max: 500000 },
    { id: '500-1m', label: isFA ? '۵۰۰ هزار تا ۱ میلیون' : '500K – 1M', min: 500000, max: 1000000 },
    { id: 'over-1m', label: isFA ? 'بالای ۱ میلیون' : 'Over 1M', min: 1000000, max: Infinity },
  ];

  const togglePriceRange = (range) => {
    const exists = filters.priceRanges.find(r => r.id === range.id);
    if (exists) {
      setFilters({ ...filters, priceRanges: filters.priceRanges.filter(r => r.id !== range.id) });
    } else {
      setFilters({ ...filters, priceRanges: [...filters.priceRanges, range] });
    }
  };

  const Checkbox = ({ checked, onClick, label }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 font-body text-sm py-1 transition-all text-start"
      style={{ color: 'var(--fg)' }}
    >
      <div
        className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: checked ? 'var(--accent)' : 'transparent',
          border: checked ? 'none' : '1px solid var(--border)',
        }}
      >
        {checked && <Check size={12} style={{ color: 'hsl(var(--accent-foreground))' }} />}
      </div>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-body font-semibold text-sm mb-3" style={{ color: 'var(--fg)' }}>
            {isFA ? 'دسته‌بندی محصولات' : 'Categories'}
          </h3>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => onCategoryChange?.('all')}
              className="flex items-center justify-between font-body text-sm py-2 px-2 rounded-lg transition-all text-start"
              style={{
                color: activeCategory === 'all' ? 'var(--accent)' : 'var(--fg)',
                background: activeCategory === 'all' ? 'rgba(212,175,55,0.1)' : 'transparent',
              }}
            >
              <span className="font-semibold">{isFA ? 'همه محصولات' : 'All Products'}</span>
              <span className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>
                {categories.reduce((sum, c) => sum + (c.count || 0), 0)}
              </span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange?.(cat.id)}
                className="flex items-center justify-between font-body text-sm py-2 px-2 rounded-lg transition-all text-start"
                style={{
                  color: activeCategory === cat.id ? 'var(--accent)' : 'var(--fg)',
                  background: activeCategory === cat.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                }}
              >
                <span className="font-semibold">{isFA ? cat.nameFA : cat.nameEN}</span>
                <span className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>
                  {cat.count || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <h3 className="font-body font-semibold text-sm mb-3" style={{ color: 'var(--fg)' }}>
          {isFA ? 'محدوده قیمت' : 'Price Range'}
        </h3>
        <div className="flex flex-col gap-1">
          {priceRanges.map(range => (
            <Checkbox
              key={range.id}
              checked={!!filters.priceRanges.find(r => r.id === range.id)}
              onClick={() => togglePriceRange(range)}
              label={range.label}
            />
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div>
        <h3 className="font-body font-semibold text-sm mb-3" style={{ color: 'var(--fg)' }}>
          {isFA ? 'وضعیت' : 'Availability'}
        </h3>
        <div className="flex flex-col gap-1">
          <Checkbox
            checked={filters.inStock}
            onClick={() => setFilters({ ...filters, inStock: !filters.inStock })}
            label={isFA ? 'فقط موجود در انبار' : 'In stock only'}
          />
          <Checkbox
            checked={filters.featured}
            onClick={() => setFilters({ ...filters, featured: !filters.featured })}
            label={isFA ? 'محصولات ویژه' : 'Featured only'}
          />
        </div>
      </div>

      {/* Reset */}
      {(filters.priceRanges.length > 0 || filters.inStock || filters.featured) && (
        <button
          onClick={() => setFilters({ priceRanges: [], inStock: false, featured: false })}
          className="font-body text-xs font-semibold py-2 px-3 rounded-lg transition-all"
          style={{ color: 'var(--accent)', border: '1px solid var(--border)' }}
        >
          {isFA ? 'پاک کردن فیلترها' : 'Clear filters'}
        </button>
      )}
    </div>
  );
}