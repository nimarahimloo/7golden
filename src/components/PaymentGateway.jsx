import React, { useState } from 'react';
import { Lock, CreditCard, Check, X, Loader, ShieldCheck } from 'lucide-react';

// Detect Iranian bank from card prefix
function detectBank(num) {
  const p = num.replace(/\s/g, '');
  if (p.length < 4) return null;
  const map = [
    ['603799', 'بانک ملت', '#4338ca'],
    ['589210', 'بانک سپه', '#c2410c'],
    ['627648', 'بانک توسعه صادرات', '#1d4ed8'],
    ['603770', 'بانک کشاورزی', '#15803d'],
    ['628021', 'بانک مسکن', '#475569'],
    ['627961', 'بانک صنعت و معدن', '#0f766e'],
    ['627760', 'پاسارگاد', '#1d4ed8'],
    ['502908', 'بانک توسعه تعاون', '#4d7c0f'],
    ['627349', 'بانک پاسارگاد', '#1d4ed8'],
    ['639607', 'بانک سرمایه', '#0f766e'],
    ['627381', 'بانک انصار', '#166534'],
    ['622106', 'بانک پارسیان', '#1e3a8a'],
    ['627884', 'بانک پارسیان', '#1e3a8a'],
    ['502229', 'بانک پاسارگاد', '#1d4ed8'],
    ['639599', 'بانک قمر', '#6b21a8'],
    ['636949', 'بانک انصار', '#166534'],
  ];
  for (const [prefix, name, color] of map) {
    if (p.startsWith(prefix)) return { name, color };
  }
  return null;
}

export default function PaymentGateway({ amount, lang, onSuccess, onClose }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const bank = detectBank(cardNumber);
  const isValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv2.length >= 3;

  const handlePay = () => {
    if (!isValid || processing) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => onSuccess(), 1800);
    }, 2800);
  };

  const formatAmount = (n) => n.toLocaleString(isFA ? 'fa-IR' : 'en-US');

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'var(--glass-strong)',
          backdropFilter: 'blur(40px) saturate(220%)',
          WebkitBackdropFilter: 'blur(40px) saturate(220%)',
          border: '1px solid var(--border)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${bank?.color || '#1a1a1a'} 0%, rgba(0,0,0,0.6) 100%)`,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <Lock size={16} />
            </div>
            <div>
              <p className="font-heading text-sm font-black" style={{ fontFamily: headingFont }}>
                {isFA ? 'درگاه پرداخت امن' : 'Secure Payment Gateway'}
              </p>
              <p className="font-body text-[10px] text-white/60">
                {isFA ? 'تراکنش رمزنگاری‌شده SSL' : 'SSL Encrypted Transaction'}
              </p>
            </div>
          </div>
          {!processing && !success && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '2px solid #22c55e',
                boxShadow: '0 0 40px rgba(34,197,94,0.3)',
                animation: 'popIn 0.5s ease-out',
              }}
            >
              <Check size={44} style={{ color: '#22c55e' }} strokeWidth={3} />
            </div>
            <h3 className="font-heading text-xl font-black mb-2" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              {isFA ? 'پرداخت موفق بود' : 'Payment Successful'}
            </h3>
            <p className="font-body text-sm text-center" style={{ color: 'var(--fg-muted)' }}>
              {isFA ? 'کد پیگیری: ' : 'Tracking: '}
              <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>
                {Math.floor(Math.random() * 90000000 + 10000000)}
              </span>
            </p>
          </div>
        ) : processing ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{
                background: 'rgba(212,175,55,0.1)',
                border: '2px solid var(--accent)',
              }}
            >
              <Loader size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="font-heading text-lg font-black mb-2" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              {isFA ? 'در حال پردازش پرداخت' : 'Processing Payment'}
            </h3>
            <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
              {isFA ? 'لطفاً صبر کنید، از صفحه خارج نشوید' : 'Please wait, do not close'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Merchant info */}
            <div className="flex items-center justify-between mb-5 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <p className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'پذیرنده' : 'Merchant'}</p>
                <p className="font-heading text-sm font-black" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                  {isFA ? 'خشکبار هفت\u200cطلایی' : '7Golden Dried Fruits'}
                </p>
              </div>
              <div className="text-left">
                <p className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'مبلغ' : 'Amount'}</p>
                <p className="font-heading text-sm font-black" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                  {formatAmount(amount)} {isFA ? 'تومان' : 'IRR'}
                </p>
              </div>
            </div>

            {/* Bank badge */}
            {bank && (
              <div
                className="mb-5 px-4 py-3 rounded-xl flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bank.color }}>
                  <CreditCard size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>{isFA ? 'بانک صادرکننده' : 'Issuing Bank'}</p>
                  <p className="font-body text-sm font-bold" style={{ color: 'var(--fg)' }}>{bank.name}</p>
                </div>
              </div>
            )}

            {/* Card number */}
            <div className="mb-4">
              <label className="font-body text-xs font-semibold block mb-2" style={{ color: 'var(--fg)' }}>
                {isFA ? 'شماره کارت' : 'Card Number'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3.5 rounded-xl text-sm font-mono text-center outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)',
                  letterSpacing: '0.05em',
                }}
              />
            </div>

            {/* Expiry + CVV2 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="font-body text-xs font-semibold block mb-2" style={{ color: 'var(--fg)' }}>
                  {isFA ? 'تاریخ انقضا' : 'Expiry'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono text-center outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    color: 'var(--fg)',
                  }}
                />
              </div>
              <div>
                <label className="font-body text-xs font-semibold block mb-2" style={{ color: 'var(--fg)' }}>CVV2</label>
                <input
                  type="password"
                  inputMode="numeric"
                  dir="ltr"
                  value={cvv2}
                  onChange={e => setCvv2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-mono text-center outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    color: 'var(--fg)',
                  }}
                />
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={!isValid}
              className="w-full py-4 rounded-2xl font-body font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isValid ? 'var(--accent)' : 'var(--border)',
                color: 'hsl(var(--accent-foreground))',
                boxShadow: isValid ? '0 8px 24px rgba(212,175,55,0.25)' : 'none',
              }}
            >
              {isFA ? `پرداخت ${formatAmount(amount)} تومان` : `Pay ${formatAmount(amount)} IRR`}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <ShieldCheck size={12} style={{ color: 'var(--fg-muted)' }} />
              <p className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>
                {isFA ? 'پرداخت از طریق درگاه امن بانکی' : 'Payment via secure banking gateway'}
              </p>
            </div>
          </div>
        )}
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