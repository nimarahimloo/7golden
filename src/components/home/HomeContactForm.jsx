import { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import { createContactMessage } from '@/lib/api/content';
import { CONTACT_INFO } from '@/lib/contact-info';

const FIELDS = [
  { key: 'name', type: 'text', label: 'نام و نام خانوادگی', required: true, autoComplete: 'name' },
  { key: 'phone', type: 'tel', label: 'شماره تماس', required: false, autoComplete: 'tel' },
  { key: 'email', type: 'email', label: 'آدرس ایمیل', required: false, autoComplete: 'email' },
];

export default function HomeContactForm({ section = {} }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim() || status === 'sending') return;

    setStatus('sending');
    try {
      await createContactMessage({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--hairline)',
    color: 'var(--fg)',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
  };

  return (
    <section className="chapter" dir="rtl">
      <div className="chapter-shell">
        <StoryChapter
          index="۰۸"
          eyebrow={section.badge_fa || 'ارتباط با هفت طلایی'}
          title={section.title_fa || 'استعلام قیمت محصولات'}
          lead={section.subtitle_fa || 'برای اطلاع از قیمت مغز فندق، خمیر فندق، مغز و خلال پسته یا فرآورده‌های بادام، درخواست خود را ثبت کنید یا با دفتر هفت طلایی تماس بگیرید.'}
          className="mb-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          <Reveal variant="left" className="lg:col-span-2">
            <div className="flex flex-col gap-3">
              <a href={CONTACT_INFO.mobileLink} className="p-5 rounded-2xl panel gold-frame flex items-center gap-4 transition-all hover:scale-[1.01]">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--hairline-strong)' }}>
                  <Phone size={18} style={{ color: 'var(--accent)' }} />
                </span>
                <span>
                  <span className="font-body text-xs block mb-1" style={{ color: 'var(--fg-muted)' }}>تماس مستقیم</span>
                  <span className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', direction: 'ltr', display: 'block' }}>
                    {CONTACT_INFO.mobile}
                  </span>
                </span>
              </a>

              <a href={CONTACT_INFO.emailLink} className="p-5 rounded-2xl panel gold-frame flex items-center gap-4 transition-all hover:scale-[1.01]">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--hairline-strong)' }}>
                  <Mail size={18} style={{ color: 'var(--accent)' }} />
                </span>
                <span>
                  <span className="font-body text-xs block mb-1" style={{ color: 'var(--fg-muted)' }}>ایمیل</span>
                  <span className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', direction: 'ltr', display: 'block' }}>
                    {CONTACT_INFO.email}
                  </span>
                </span>
              </a>

              <div className="p-5 rounded-2xl liquid-glass-strong flex items-start gap-4">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--hairline-strong)' }}>
                  <MessageCircle size={18} style={{ color: 'var(--accent)' }} />
                </span>
                <span>
                  <span className="font-body text-sm font-semibold block mb-2" style={{ color: 'var(--fg)' }}>جزئیات محصول را بنویسید</span>
                  <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                    نام محصول، شکل فرآوری و مقدار موردنیاز را درج کنید؛ برای مثال مغز فندق، خمیر فندق یا خلال پسته.
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delay={120} className="lg:col-span-3">
            <div className="p-5 md:p-8 rounded-3xl panel-strong">
              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center py-14 text-center" role="status" aria-live="polite">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <CheckCircle size={36} style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="font-heading text-xl font-black mb-3" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                    پیام شما ثبت شد.
                  </h3>
                  <p className="font-body text-sm leading-relaxed max-w-sm" style={{ color: 'var(--fg-muted)' }}>
                    درخواست شما برای پیگیری ثبت شده است.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="home-contact-form flex flex-col gap-4">
                  <div className="mb-2">
                    <h3 className="font-heading font-black text-lg mb-2" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                      فرم استعلام محصول
                    </h3>
                    <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      نام، راه تماس و جزئیات محصول را وارد کنید.
                    </p>
                  </div>

                  {FIELDS.map((field) => (
                    <div key={field.key}>
                      <label htmlFor={`contact-${field.key}`} className="font-body text-xs font-semibold block mb-2" style={{ color: 'var(--fg)' }}>
                        {field.label}
                        {field.required && <span style={{ color: 'var(--accent)' }}> *</span>}
                      </label>
                      <input
                        id={`contact-${field.key}`}
                        name={field.key}
                        type={field.type}
                        value={form[field.key]}
                        onChange={(event) => setField(field.key, event.target.value)}
                        required={field.required}
                        autoComplete={field.autoComplete}
                        dir={field.key === 'phone' || field.key === 'email' ? 'ltr' : 'rtl'}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="contact-message" className="font-body text-xs font-semibold block mb-2" style={{ color: 'var(--fg)' }}>
                      محصول و جزئیات سفارش <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={(event) => setField('message', event.target.value)}
                      required
                      placeholder="نام محصول، شکل فرآوری و مقدار موردنیاز را بنویسید."
                      className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-y transition-all"
                      style={inputStyle}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="font-body text-xs leading-relaxed" style={{ color: '#f87171' }} role="alert">
                      ارسال درخواست ناموفق بود. دوباره تلاش کنید یا با دفتر تماس بگیرید.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--accent)',
                      color: 'hsl(var(--accent-foreground))',
                      boxShadow: '0 8px 32px rgba(212,175,55,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
                    }}
                  >
                    <Send size={16} />
                    {status === 'sending' ? 'در حال ارسال…' : 'ثبت درخواست'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
