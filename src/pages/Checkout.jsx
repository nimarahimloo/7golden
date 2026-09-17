import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CreditCard, Truck, MapPin, User, Package, ShieldCheck, ChevronLeft, ChevronRight, Zap, Wallet, RotateCcw } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { Image } from '@/components/ui/image';
import PaymentGateway from '@/components/PaymentGateway';
import CheckoutCard from '@/components/CheckoutCard';
import BackButton from '@/components/BackButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createOrder } from '@/lib/api/content';
import { toast } from '@/components/ui/use-toast';

const IRAN_PROVINCES_FA = [
  'تهران', 'قزوین', 'البرز', 'گیلان', 'مازندران', 'گلستان', 'اردبیل', 'آذربایجان شرقی', 'آذربایجان غربی',
  'کرمانشاه', 'همدان', 'لرستان', 'کردستان', 'ایلام', 'خوزستان', 'بوشهر', 'فارس', 'هرمزگان',
  'کرمان', 'یزد', 'اصفهان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'سیستان و بلوچستان',
  'خراسان رضوی', 'خراسان شمالی', 'خراسان جنوبی', 'سمنان', 'قم', 'مرکزی', 'زنجان',
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useApp();
  const [showGateway, setShowGateway] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [form, setForm] = useState({
    full_name: '', phone: '', province: '', address: '', postal_code: '',
    shipping: 'standard', payment: 'online',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const isFA = true;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const shippingCost = cartTotal >= 500000 ? 0 : (form.shipping === 'express' ? 95000 : 45000);
  const grandTotal = cartTotal + shippingCost;
  const fmt = (n) => n.toLocaleString(isFA ? 'fa-IR' : 'en-US');

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = true;
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = true;
    if (!form.province) e.province = true;
    if (!form.address.trim()) e.address = true;
    if (!form.postal_code.trim()) e.postal_code = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    if (form.payment === 'online') setShowGateway(true);
    else completeOrder();
  };

  const completeOrder = async () => {
    setSubmitting(true);
    setOrderError(null);
    try {
      const orderData = {
        order_number: '7G-' + Date.now().toString().slice(-6),
        tracking_code: Date.now().toString().slice(-8),
        items: cart.map(item => ({
          name: isFA ? item.nameFA : item.nameEN,
          price: item.price,
          qty: item.qty,
          weight: item.weight,
          image: item.image,
        })),
        subtotal: cartTotal,
        shipping_cost: shippingCost,
        shipping_method: form.shipping,
        grand_total: grandTotal,
        payment_method: form.payment,
        status: 'pending',
        full_name: form.full_name,
        phone: form.phone,
        province: form.province,
        address: form.address,
        postal_code: form.postal_code,
      };
      const created = await createOrder(orderData);
      setOrderNumber(created.order_number || orderData.order_number);
      setTrackingCode(created.tracking_code || orderData.tracking_code);
      setShowGateway(false);
      clearCart();
      setOrdered(true);
      window.scrollTo(0, 0);
    } catch (e) {
      setOrderError(e?.message || (isFA ? 'خطا در ثبت سفارش' : 'Failed to place order'));
      toast({ title: isFA ? 'خطا در ثبت سفارش' : 'Order failed', description: isFA ? 'لطفاً دوباره تلاش کنید' : 'Please try again', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const BackIcon = isFA ? ChevronLeft : ChevronRight;

  // ===== ORDER SUCCESS PAGE =====
  if (ordered) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-lg w-full text-center">
          {/* Success orb */}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 relative"
            style={{
              background: 'rgba(34,197,94,0.08)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '2px solid rgba(34,197,94,0.3)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 0 80px rgba(34,197,94,0.25)',
              animation: 'popIn 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <Check size={52} style={{ color: '#22c55e' }} strokeWidth={3} />
          </div>

          <span className="font-subheading text-sm uppercase block mb-3" style={{ color: 'var(--accent)', fontFamily: subFont }}>
            {isFA ? 'سفارش ثبت شد' : 'Order Confirmed'}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'سفارش شما با موفقیت ثبت شد' : 'Your Order is Placed'}
          </h1>
          <p className="font-body text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'var(--fg-muted)' }}>
            {isFA
              ? 'به‌زودی با شما تماس خواهیم گرفت و سفارش شما را ارسال می‌کنیم. از خرید شما سپاسگزاریم.'
              : 'We will contact you soon to deliver your order. Thank you for your purchase.'}
          </p>

          {/* Order info — liquid glass card */}
          <div
            className="p-6 rounded-3xl mb-6 text-right"
            style={{
              background: 'rgba(18,18,18,0.38)',
              backdropFilter: 'blur(48px) saturate(240%)',
              WebkitBackdropFilter: 'blur(48px) saturate(240%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('order_number')}</span>
              <span className="font-heading font-black text-sm" style={{ color: 'var(--accent)', fontFamily: headingFont }}>{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('tracking_code')}</span>
              <span className="font-mono font-bold text-sm" style={{ color: 'var(--fg)' }}>{trackingCode}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('estimated_delivery')}</span>
              <span className="font-body font-bold text-sm" style={{ color: 'var(--fg)' }}>
                {isFA ? '۳ تا ۵ روز کاری' : '3–5 business days'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{t('cart_total')}</span>
              <span className="font-heading font-black text-lg" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                {fmt(grandTotal)} {isFA ? 'تومان' : 'IRR'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              to="/shop"
              className="flex-1 max-w-[200px] px-8 py-3.5 rounded-full font-body font-semibold text-sm transition-all hover:scale-105"
              style={{
                background: 'var(--accent)',
                color: 'hsl(var(--accent-foreground))',
                boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
              }}
            >
              {t('continue_shopping')}
            </Link>
            <Link
              to="/account"
              className="px-8 py-3.5 rounded-full font-body text-sm transition-all hover:scale-105 glass-pill"
              style={{ color: 'var(--fg)' }}
            >
              {isFA ? 'سفارش‌های من' : 'My Orders'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== EMPTY CART =====
  if (cart.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)',
            }}
          >
            <Package size={40} style={{ color: 'var(--fg-muted)' }} />
          </div>
          <h2 className="font-heading text-xl font-black mb-2" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'سبد خرید شما خالی است' : 'Your Cart is Empty'}
          </h2>
          <p className="font-body text-sm mb-6" style={{ color: 'var(--fg-muted)' }}>
            {isFA ? 'ابتدا محصولات مورد نظر را به سبد اضافه کنید' : 'Add products to your cart first'}
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 rounded-full font-body font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: 'hsl(var(--accent-foreground))',
              boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
            }}
          >
            {t('shop')}
          </Link>
        </div>
      </div>
    );
  }

  // ===== CHECKOUT FORM =====
  return (
    <div dir="rtl" className="min-h-screen pb-16" style={{ background: 'var(--bg)' }}>
      {showGateway && <PaymentGateway amount={grandTotal} onSuccess={completeOrder} onClose={() => setShowGateway(false)} />}

      {/* Premium header */}
      <div className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5">
            <BackButton to="/shop" />
          </div>
          <div className="flex flex-col items-center text-center mb-8">
            <span className="font-subheading text-sm uppercase block mb-2" style={{ color: 'var(--accent)', fontFamily: subFont }}>
              {isFA ? 'تسویه حساب' : 'Checkout'}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-black" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              {t('checkout_title')}
            </h1>
          </div>

          {/* Step indicator — liquid glass orbs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
            {[
              { label: t('step_info'), icon: User },
              { label: t('step_shipping'), icon: Truck },
              { label: t('step_payment'), icon: CreditCard },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(212,175,55,0.08)',
                      backdropFilter: 'blur(20px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      color: 'var(--accent)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 4px 16px rgba(212,175,55,0.1)',
                    }}
                  >
                    <step.icon size={16} />
                  </div>
                  <span className="font-body text-sm font-semibold hidden sm:inline" style={{ color: 'var(--fg)' }}>{step.label}</span>
                </div>
                {i < 2 && (
                  <div className="w-8 sm:w-16 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), rgba(255,255,255,0.06))' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Form */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Contact info */}
            <CheckoutCard icon={User} title={t('step_info')} headingFont={headingFont}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-semibold block mb-2" style={{ color: 'var(--fg)' }}>{t('full_name')}</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                    placeholder={isFA ? 'نام و نام خانوادگی' : 'Full name'}
                    className="glass-input w-full px-4 py-3.5 rounded-xl font-body text-sm outline-none"
                    style={{ border: `1px solid ${errors.full_name ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, color: 'var(--fg)' }}
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-2" style={{ color: 'var(--fg)' }}>{t('phone')}</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="09xxxxxxxxx"
                    className="glass-input w-full px-4 py-3.5 rounded-xl font-body text-sm outline-none text-right"
                    style={{ border: `1px solid ${errors.phone ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, color: 'var(--fg)' }}
                  />
                </div>
              </div>
            </CheckoutCard>

            {/* Shipping address */}
            <CheckoutCard icon={MapPin} title={t('step_shipping')} headingFont={headingFont}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-semibold block mb-2" style={{ color: 'var(--fg)' }}>{t('province')}</label>
                  <Select value={form.province || undefined} onValueChange={(v) => set('province', v)}>
                    <SelectTrigger
                      className="glass-input w-full px-4 py-3.5 rounded-xl font-body text-sm outline-none cursor-pointer"
                      style={{ border: `1px solid ${errors.province ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, color: 'var(--fg)' }}
                    >
                      <SelectValue placeholder={isFA ? 'انتخاب استان' : 'Select province'} />
                    </SelectTrigger>
                    <SelectContent>
                      {IRAN_PROVINCES_FA.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-body text-sm font-semibold block mb-2" style={{ color: 'var(--fg)' }}>{t('postal_code')}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.postal_code}
                    onChange={e => set('postal_code', e.target.value)}
                    placeholder={isFA ? 'کد پستی ۱۰ رقمی' : 'Postal code'}
                    className="glass-input w-full px-4 py-3.5 rounded-xl font-body text-sm outline-none text-right"
                    style={{ border: `1px solid ${errors.postal_code ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, color: 'var(--fg)' }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-sm font-semibold block mb-2" style={{ color: 'var(--fg)' }}>{t('address')}</label>
                  <textarea
                    rows="3"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder={isFA ? 'نشانی کامل را وارد کنید' : 'Enter full address'}
                    className="glass-input w-full px-4 py-3.5 rounded-xl font-body text-sm outline-none resize-none"
                    style={{ border: `1px solid ${errors.address ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, color: 'var(--fg)' }}
                  />
                </div>
              </div>

              {/* Shipping method */}
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <label className="font-body text-sm font-semibold block mb-3" style={{ color: 'var(--fg)' }}>
                  {isFA ? 'روش ارسال' : 'Shipping Method'}
                </label>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      val: 'standard', icon: Truck,
                      label: isFA ? 'ارسال عادی' : 'Standard Shipping',
                      sub: isFA ? '۳–۵ روز کاری' : '3–5 business days',
                      price: shippingCost === 0 && form.shipping === 'standard' ? t('free') : `${fmt(45000)} ${isFA ? 'ت' : 'IRR'}`,
                      free: shippingCost === 0 && form.shipping === 'standard',
                    },
                    {
                      val: 'express', icon: Zap,
                      label: isFA ? 'ارسال اکسپرس' : 'Express Shipping',
                      sub: isFA ? '۱–۲ روز' : '1–2 days',
                      price: `${fmt(95000)} ${isFA ? 'ت' : 'IRR'}`,
                      free: false,
                    },
                  ].map(opt => (
                    <label
                      key={opt.val}
                      className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all"
                      style={{
                        background: form.shipping === opt.val ? 'rgba(212,175,55,0.06)' : 'rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: `1px solid ${form.shipping === opt.val ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: form.shipping === opt.val ? 'inset 0 1px 1px rgba(255,255,255,0.08), 0 0 24px rgba(212,175,55,0.08)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                          style={{
                            background: form.shipping === opt.val ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                            color: form.shipping === opt.val ? 'hsl(var(--accent-foreground))' : 'var(--fg-muted)',
                            boxShadow: form.shipping === opt.val ? 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 16px rgba(212,175,55,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                          }}
                        >
                          <opt.icon size={18} />
                        </div>
                        <div>
                          <span className="font-body text-sm font-semibold block" style={{ color: 'var(--fg)' }}>{opt.label}</span>
                          <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{opt.sub}</span>
                        </div>
                      </div>
                      <span className="font-heading text-sm font-black" style={{ color: opt.free ? '#22c55e' : 'var(--accent)', fontFamily: headingFont }}>
                        {opt.price}
                      </span>
                      <input type="radio" name="shipping" value={opt.val} checked={form.shipping === opt.val} onChange={() => set('shipping', opt.val)} className="sr-only" />
                    </label>
                  ))}
                </div>
              </div>
            </CheckoutCard>

            {/* Payment method */}
            <CheckoutCard icon={CreditCard} title={t('step_payment')} headingFont={headingFont}>
              <div className="flex flex-col gap-3">
                <label
                  className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: form.payment === 'online' ? 'rgba(212,175,55,0.06)' : 'rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${form.payment === 'online' ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: form.payment === 'online' ? 'inset 0 1px 1px rgba(255,255,255,0.08), 0 0 24px rgba(212,175,55,0.08)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        background: form.payment === 'online' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                        color: form.payment === 'online' ? 'hsl(var(--accent-foreground))' : 'var(--fg-muted)',
                        boxShadow: form.payment === 'online' ? 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 16px rgba(212,175,55,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                      }}
                    >
                      <Wallet size={18} />
                    </div>
                    <div>
                      <span className="font-body text-sm font-semibold block" style={{ color: 'var(--fg)' }}>{isFA ? 'پرداخت آنلاین' : 'Online Payment'}</span>
                      <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'درگاه پرداخت امن (شبکه شتاب)' : 'Secure payment gateway'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {['ملت', 'سامان', 'زرین‌پال'].map(b => (
                      <span key={b} className="glass-pill text-sm px-2 py-1 rounded font-extrabold" style={{ color: 'var(--fg-muted)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                  <input type="radio" name="payment" value="online" checked={form.payment === 'online'} onChange={() => set('payment', 'online')} className="sr-only" />
                </label>

                <label
                  className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: form.payment === 'cod' ? 'rgba(212,175,55,0.06)' : 'rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${form.payment === 'cod' ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: form.payment === 'cod' ? 'inset 0 1px 1px rgba(255,255,255,0.08), 0 0 24px rgba(212,175,55,0.08)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        background: form.payment === 'cod' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                        color: form.payment === 'cod' ? 'hsl(var(--accent-foreground))' : 'var(--fg-muted)',
                        boxShadow: form.payment === 'cod' ? 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 16px rgba(212,175,55,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                      }}
                    >
                      <Truck size={18} />
                    </div>
                    <div>
                      <span className="font-body text-sm font-semibold block" style={{ color: 'var(--fg)' }}>{isFA ? 'پرداخت در محل' : 'Cash on Delivery'}</span>
                      <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'پرداخت هنگام تحویل' : 'Pay when you receive'}</span>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => set('payment', 'cod')} className="sr-only" />
                </label>
              </div>
            </CheckoutCard>
          </div>

          {/* Right: Order Summary — liquid glass */}
          <div className="lg:col-span-2">
            <div
              className="rounded-3xl p-6 sticky top-24"
              style={{
                background: 'rgba(13,13,13,0.52)',
                backdropFilter: 'blur(56px) saturate(260%)',
                WebkitBackdropFilter: 'blur(56px) saturate(260%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.15), 0 24px 64px rgba(0,0,0,0.4)',
              }}
            >
              <h3 className="font-heading text-lg font-black mb-5" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {t('order_summary')}
              </h3>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div
                      className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: 'rgba(0,0,0,0.2)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
                    >
                      <Image src={item.image} alt={isFA ? item.nameFA : item.nameEN} className="w-full h-full" fittingType="fill" />
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-body text-sm font-extrabold"
                        style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 2px 8px rgba(212,175,55,0.3)' }}
                      >
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{isFA ? item.nameFA : item.nameEN}</p>
                      <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                        {item.weight >= 1000 ? `${item.weight / 1000} ${t('kg')}` : `${item.weight} ${t('gr')}`}
                      </p>
                    </div>
                    <span className="font-heading text-sm font-black" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                      {fmt(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Price breakdown */}
              <div className="flex flex-col gap-2.5 mb-4">
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
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 mb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-body text-sm font-semibold" style={{ color: 'var(--fg)' }}>{t('cart_total')}</span>
                <span className="font-heading text-xl font-black" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                  {fmt(grandTotal)} {isFA ? 'تومان' : 'IRR'}
                </span>
              </div>

              {/* Error / retry state */}
              {orderError && (
                <div className="mb-4 p-4 rounded-2xl flex items-center justify-between gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="font-body text-sm" style={{ color: '#ef4444' }}>{orderError}</span>
                  <button
                    onClick={completeOrder}
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-full font-body text-sm font-semibold transition-all hover:scale-105 flex-shrink-0"
                    style={{ background: '#ef4444', color: '#fff', minHeight: '44px' }}
                  >
                    {isFA ? 'تلاش مجدد' : 'Retry'}
                  </button>
                </div>
              )}

              {/* CTA — liquid glass button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{
                  background: 'var(--accent)',
                  color: 'hsl(var(--accent-foreground))',
                  boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                }}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                    {isFA ? 'در حال ثبت...' : 'Submitting...'}
                  </>
                ) : (
                  form.payment === 'online'
                    ? (isFA ? `پرداخت ${fmt(grandTotal)} تومان` : `Pay ${fmt(grandTotal)} IRR`)
                    : t('place_order')
                )}
              </button>

              {/* Trust badges — glass pills */}
              <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                <span className="glass-pill flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full" style={{ color: 'var(--fg-muted)' }}>
                  <ShieldCheck size={12} style={{ color: 'var(--accent)' }} /> {isFA ? 'پرداخت امن' : 'Secure'}
                </span>
                <span className="glass-pill flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full" style={{ color: 'var(--fg-muted)' }}>
                  <Truck size={12} style={{ color: 'var(--accent)' }} /> {isFA ? 'ارسال سریع' : 'Fast delivery'}
                </span>
                <span className="glass-pill flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full" style={{ color: 'var(--fg-muted)' }}>
                  <RotateCcw size={12} style={{ color: 'var(--accent)' }} /> {isFA ? 'ضمانت بازگشت' : 'Return'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}