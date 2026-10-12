import { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import { createContactMessage } from '@/lib/api/content';

/**
 * HomeContactForm — a short product-question form on the home page.
 * Submits straight to the backend (`POST /api/contact`) so every message
 * lands in the admin panel inbox as a ContactMessage.
 */

const FIELDS = [
  { key: 'name', type: 'text', label: 'نام و نام خانوادگی', required: true },
  { key: 'phone', type: 'tel', label: 'شماره تماس', required: false },
  { key: 'email', type: 'email', label: 'ایمیل', required: false },
];

export default function HomeContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      await createContactMessage(form);
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
          index="۰۹"
          eyebrow="CONTACT"
          title="سوالی درباره محصولات دارید؟"
          lead="سوال خود را درباره مغز و خلال پسته، بادام یا فندق بنویسید — پیام شما مستقیم برای ما ارسال می‌شود و در اولین فرصت پاسخ می‌دهیم."
          className="mb-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Direct channels */}
          <Reveal variant="left" className="lg:col-span-2">
            <div className="flex flex-col gap-3">
              <a
                href="tel:+989121823438"
                className="p-5 rounded-2xl panel gold-frame flex items-center gap-4 transition-all hover:scale-[1.01]"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--hairline-strong)' }}
                >
                  <Phone size={18} style={{ color: 'var(--accent)' }} />
                </span>
                <span>
                  <span className="font-body text-xs block mb-0.5" style={{ color: 'var(--fg-muted)' }}>
                    تماس مستقیم / واتساپ
                  </span>
                  <span
                    className="font-heading font-black text-sm"
                    style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', direction: 'ltr' }}
                  >
                    ۰۹۱۲۱۸۲۳۴۳۸
                  </span>
                </span>
              </a>

              <a
                href="mailto:info@7golden.co"
                className="p-5 rounded-2xl panel gold-frame flex items-center gap-4 transition-all hover:scale-[1.01]"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--hairline-strong)' }}
                >
                  <Mail size={18} style={{ color: 'var(--accent)' }} />
                </span>
                <span>
                  <span className="font-body text-xs block mb-0.5" style={{ color: 'var(--fg-muted)' }}>
                    ایمیل
                  </span>
                  <span
                    className="font-heading font-black text-sm"
                    style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', direction: 'ltr' }}
                  >
                    info@7golden.co
                  </span>
                </span>
              </a>

              <div className="p-5 rounded-2xl liquid-glass-strong flex items-start gap-4">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid var(--hairline-strong)' }}
                >
                  <MessageCircle size={18} style={{ color: 'var(--accent)' }} />
                </span>
                <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  درخواست نمونه، قیمت عمده یا مشخصات فنی محصول را هم می‌توانید همین‌جا بنویسید.
                </span>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal variant="up" delay={120} className="lg:col-span-3">
            <div className="p-5 md:p-8 rounded-3xl panel-strong">
              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    <CheckCircle size={36} style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="font-heading text-xl font-black mb-2" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                    پیام شما ارسال شد!
                  </h3>
                  <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                    در اسرع وقت با شما تماس می‌گیریم.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {FIELDS.map((f) => (
                    <div key={f.key}>
                      <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: 'var(--fg)' }}>
                        {f.label}
                        {f.required && <span style={{ color: 'var(--accent)' }}> *</span>}
                      </label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                        required={f.required}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: 'var(--fg)' }}>
                      سوال شما درباره محصولات<span style={{ color: 'var(--accent)' }}> *</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      required
                      placeholder="مثلاً: قیمت مغز فندق درجه یک برای سفارش عمده چقدر است؟"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-none transition-all"
                      style={inputStyle}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="font-body text-xs" style={{ color: '#f87171' }}>
                      ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید یا با شماره تماس بگیرید.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      background: 'var(--accent)',
                      color: 'hsl(var(--accent-foreground))',
                      boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                    }}
                  >
                    <Send size={16} />
                    {status === 'sending' ? 'در حال ارسال…' : 'ارسال سوال'}
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
