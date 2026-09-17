import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Truck, Tag, Trash2, ShieldCheck, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { Image } from '@/components/ui/image';

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useApp();
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!cartOpen) return null;

  const isFA = true;
  const headingFont = 'Peyda, serif';
  const ArrowIcon = ArrowLeft;

  const shippingCost = cartTotal === 0 || cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 45000;
  const discount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const grandTotal = cartTotal + shippingCost - discount;
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;
  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const freeShippingUnlocked = cartTotal >= FREE_SHIPPING_THRESHOLD;

  const fmt = (n) => n.toLocaleString(isFA ? 'fa-IR' : 'en-US');

  const applyPromo = () => {
    if (promo.trim().length >= 3) setPromoApplied(true);
  };

  return (
    <div className="fixed inset-0 z-[100]" dir="rtl">
      {/* Overlay with depth blur */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer panel — iOS 26 liquid glass */}
      <div
        className={`absolute top-0 bottom-0 w-full max-w-md flex flex-col ${isFA ? 'right-0' : 'left-0'}`}
        style={{
          background: 'var(--liquid-glass-strong-bg)',
          backdropFilter: 'blur(56px) saturate(260%)',
          WebkitBackdropFilter: 'blur(56px) saturate(260%)',
          borderLeft: isFA ? 'none' : '1px solid var(--surface-border)',
          borderRight: isFA ? '1px solid var(--surface-border)' : 'none',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.15), -24px 0 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header with specular highlight */}
        <div
          className="flex items-center justify-between px-6 py-5 relative"
          style={{ borderBottom: '1px solid var(--surface-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(212,175,55,0.12)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(212,175,55,0.25)',
                color: 'var(--accent)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 4px 16px rgba(212,175,55,0.15)',
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black leading-tight" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {t('cart_title')}
              </h2>
              <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                {isFA ? `${cart.length} کالا در سبد` : `${cart.length} items in cart`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 glass-pill"
            style={{ color: 'var(--fg)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Free shipping progress — glass track */}
        {cart.length > 0 && (
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: freeShippingUnlocked ? 'rgba(34,197,94,0.12)' : 'rgba(212,175,55,0.12)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${freeShippingUnlocked ? 'rgba(34,197,94,0.25)' : 'rgba(212,175,55,0.25)'}`,
                }}
              >
                <Truck size={14} style={{ color: freeShippingUnlocked ? '#22c55e' : 'var(--accent)' }} />
              </div>
              <p className="font-body text-sm flex-1" style={{ color: 'var(--fg-muted)' }}>
                {freeShippingUnlocked
                  ? (isFA ? 'ارسال رایگان شما فعال شد' : 'Free shipping unlocked')
                  : (isFA ? `${fmt(remaining)} تومان تا ارسال رایگان` : `${fmt(remaining)} IRR to free shipping`)}
              </p>
              {freeShippingUnlocked && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  <Check size={12} style={{ color: '#22c55e' }} strokeWidth={3} />
                </div>
              )}
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'var(--track-bg)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: freeShippingUnlocked
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'linear-gradient(90deg, #E8C547, #C09B25)',
                  boxShadow: freeShippingUnlocked ? '0 0 16px rgba(34,197,94,0.5)' : '0 0 16px rgba(212,175,55,0.5)',
                }}
              />
            </div>
          </div>
        )}

        {/* Items — floating glass tiles */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'var(--surface-subtle)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--surface-border)',
                  boxShadow: 'inset 0 1px 1px var(--surface-border)',
                }}
              >
                <ShoppingBag size={36} style={{ color: 'var(--fg-muted)' }} />
              </div>
              <div className="text-center">
                <p className="font-heading text-base font-black mb-1" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                  {isFA ? 'سبد خرید خالی است' : 'Your cart is empty'}
                </p>
                <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                  {isFA ? 'محصولات مورد علاقه را به سبد اضافه کنید' : 'Add your favorite products to cart'}
                </p>
              </div>
              <Link
                to="/shop"
                onClick={() => setCartOpen(false)}
                className="px-8 py-3.5 rounded-full font-body text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: 'var(--accent)',
                  color: 'hsl(var(--accent-foreground))',
                  boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                }}
              >
                {t('shop')}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item, idx) => (
                <div
                  key={item.key}
                  className="flex gap-3 p-3 rounded-2xl transition-all hover:scale-[1.01]"
                  style={{
                    background: 'var(--surface-subtle)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid var(--surface-border)',
                    boxShadow: 'inset 0 1px 1px var(--surface-border), 0 4px 16px var(--glass-input-bg)',
                    animation: `slideIn 0.4s cubic-bezier(0.16,1,0.3,1) ${idx * 0.06}s both`,
                  }}
                >
                  {/* Image with glass frame */}
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                    style={{
                      background: 'var(--glass-input-bg)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                    }}
                  >
                    <Image src={item.image} alt={item.nameFA} className="block w-full h-full p-1.5" fittingType="fit" />
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-sm truncate" style={{ color: 'var(--fg)' }}>
                          {isFA ? item.nameFA : item.nameEN}
                        </p>
                        <p className="font-body text-sm mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                          {item.weight >= 1000 ? `${item.weight / 1000} ${t('kg')}` : `${item.weight} ${t('gr')}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-all"
                        style={{ color: 'var(--fg-muted)', background: 'var(--surface-subtle)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {/* Quantity stepper — glass */}
                      <div
                        className="flex items-center rounded-full"
                        style={{
                          background: 'var(--glass-input-bg)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid var(--surface-border)',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      >
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
                          style={{ color: 'var(--fg)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm w-7 text-center font-extrabold" style={{ color: 'var(--fg)' }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
                          style={{ color: 'var(--accent)' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      {/* Price */}
                      <span className="font-heading text-sm font-black" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                        {fmt(item.price * item.qty)}
                        <span className="text-sm ms-1 font-body" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'ت' : 'IRR'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — layered glass */}
        {cart.length > 0 && (
          <div
            className="px-6 py-5"
            style={{
              borderTop: '1px solid var(--surface-border)',
              background: 'var(--overlay-footer-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Promo code — glass input */}
            <div className="flex gap-2 mb-4">
              <div
                className="flex-1 flex items-center gap-2 px-3.5 py-3 rounded-xl"
                style={{
                  background: 'var(--glass-input-bg)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--surface-border)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                <Tag size={14} style={{ color: 'var(--fg-muted)' }} />
                <input
                  type="text"
                  value={promo}
                  onChange={e => { setPromo(e.target.value); setPromoApplied(false); }}
                  placeholder={t('promo_code')}
                  disabled={promoApplied}
                  className="flex-1 bg-transparent outline-none font-body text-sm"
                  style={{ color: 'var(--fg)' }}
                />
              </div>
              <button
                onClick={applyPromo}
                disabled={promoApplied || promo.trim().length < 3}
                className="px-5 py-3 rounded-xl font-body text-sm font-semibold transition-all disabled:opacity-40"
                style={{
                  background: promoApplied ? 'rgba(34,197,94,0.12)' : 'var(--accent)',
                  color: promoApplied ? '#22c55e' : 'hsl(var(--accent-foreground))',
                  border: promoApplied ? '1px solid rgba(34,197,94,0.3)' : 'none',
                  boxShadow: promoApplied ? 'none' : '0 4px 16px rgba(212,175,55,0.2)',
                }}
              >
                {promoApplied ? (isFA ? 'اعمال شد ✓' : 'Applied ✓') : t('apply_code')}
              </button>
            </div>

            {/* Price breakdown */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('subtotal')}</span>
                <span className="font-body text-sm font-semibold" style={{ color: 'var(--fg)' }}>{fmt(cartTotal)} {isFA ? 'ت' : 'IRR'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('shipping_cost')}</span>
                <span className="font-body text-sm font-semibold" style={{ color: shippingCost === 0 ? '#22c55e' : 'var(--fg)' }}>
                  {shippingCost === 0 ? t('free') : `${fmt(shippingCost)} ${isFA ? 'ت' : 'IRR'}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('discount')}</span>
                  <span className="font-body text-sm font-semibold" style={{ color: '#22c55e' }}>-{fmt(discount)} {isFA ? 'ت' : 'IRR'}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-5 pt-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
              <span className="font-body text-sm font-semibold" style={{ color: 'var(--fg)' }}>{t('cart_total')}</span>
              <span className="font-heading text-xl font-black" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                {fmt(grandTotal)} {isFA ? 'تومان' : 'IRR'}
              </span>
            </div>

            {/* CTA — liquid glass button */}
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full text-center py-4 rounded-2xl font-body font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{
                background: 'var(--accent)',
                color: 'hsl(var(--accent-foreground))',
                boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
              }}
            >
              {t('checkout')}
              <ArrowIcon size={16} />
            </Link>

            {/* Trust badges — glass pills */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="glass-pill flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full" style={{ color: 'var(--fg-muted)' }}>
                <ShieldCheck size={12} style={{ color: 'var(--accent)' }} /> {isFA ? 'پرداخت امن' : 'Secure'}
              </span>
              <span className="glass-pill flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full" style={{ color: 'var(--fg-muted)' }}>
                <Truck size={12} style={{ color: 'var(--accent)' }} /> {isFA ? 'ارسال سریع' : 'Fast delivery'}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(${isFA ? '20px' : '-20px'}) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}