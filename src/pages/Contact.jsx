import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Instagram, MessageCircle, CheckCircle } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import PageHero from '@/components/PageHero';
import BackButton from '@/components/BackButton';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import Reveal from '@/components/story/Reveal';

export default function Contact() {
  const { refreshSiteMode } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const contactCards = [
    { icon: Phone, label: 'تلفن پشتیبانی', value: '۰۲۸۳۳۲۳۴۰۰۵', href: 'tel:+982833234005' },
    { icon: Phone, label: 'موبایل', value: '۰۹۱۲۱۸۲۳۴۳۸', href: 'tel:+989121823438' },
    { icon: Mail, label: 'ایمیل', value: 'info@7golden.co', href: 'mailto:info@7golden.co' },
    { icon: Clock, label: 'ساعات کاری', value: '۹ صبح الی ۹ شب — هر روز', href: null },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={true ? `تماس با ${SITE_SEO.siteNameFA}` : `Contact ${SITE_SEO.siteNameEN}`}
        description={true ? 'با خشکبار هفت‌طلایی در تماس باشید — تلفن، ایمیل و آدرس دفتر مرکزی قزوین.' : 'Get in touch with 7Golden — phone, email, and headquarters address in Qazvin, Iran.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/contact`}
      />

      <PullToRefresh onRefresh={refreshSiteMode}>
      {/* Hero */}
      <div className="relative">
        <PageHero
          image="https://7golden.co/wp-content/uploads/2022/09/about-p-3.png"
          title={t('contact_title')}
          subtitle="همیشه در دسترس شما هستیم"
          badge="تماس با ما"
        />
        <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8" style={{ paddingTop: 'calc(5rem + var(--safe-area-top))' }}>
          <BackButton to="/" className="text-white/80 hover:text-white" />
        </div>
      </div>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {contactCards.map((card, i) => (
            <Reveal key={i} delay={i * 80} variant="up">
            <a
              href={card.href || undefined}
              className="rounded-2xl p-4 md:p-5 panel gold-frame transition-all duration-300 group block h-full"
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{
                  background: 'rgba(227,194,99,0.12)',
                  border: '1px solid var(--hairline-strong)',
                }}
              >
                <card.icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <p className="font-body text-[10px] md:text-xs mb-1" style={{ color: 'var(--fg-muted)' }}>{card.label}</p>
              <p
                className="font-heading font-black text-xs md:text-sm"
                style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', direction: card.href?.startsWith('tel') ? 'ltr' : 'inherit' }}
              >
                {card.value}
              </p>
            </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Addresses */}
          <div>
            <h2 className="display-md mb-6" style={{ color: 'var(--ink)' }}>
              آدرس‌های ما
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              {/* HQ */}
              <div className="p-6 rounded-3xl liquid-glass-strong">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(227,194,99,0.12)', border: '1px solid var(--hairline-strong)' }}
                  >
                    <MapPin size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm mb-1" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                      {t('hq_title')}
                    </h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      {t('hq_address')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tehran */}
              <div className="p-6 rounded-3xl liquid-glass-strong">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(227,194,99,0.12)', border: '1px solid var(--hairline-strong)' }}
                  >
                    <MapPin size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm mb-1" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                      {t('tehran_title')}
                    </h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      {t('tehran_address')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="p-6 rounded-3xl liquid-glass-strong">
              <h3 className="font-heading font-black text-sm mb-4" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                ما را دنبال کنید
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(227,194,99,0.06)', border: '1px solid var(--hairline)' }}
                >
                  <Instagram size={18} style={{ color: 'var(--accent)' }} />
                </a>
                <a
                  href="tel:+989121823438"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(227,194,99,0.06)', border: '1px solid var(--hairline)' }}
                >
                  <Phone size={18} style={{ color: 'var(--accent)' }} />
                </a>
                <a
                  href="mailto:info@7golden.co"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(227,194,99,0.06)', border: '1px solid var(--hairline)' }}
                >
                  <Mail size={18} style={{ color: 'var(--accent)' }} />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(227,194,99,0.06)', border: '1px solid var(--hairline)' }}
                >
                  <MessageCircle size={18} style={{ color: 'var(--accent)' }} />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="p-8 rounded-3xl panel-strong">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.25)',
                    }}
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
                  <h3 className="font-heading text-xl font-black mb-2" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                    {t('send_message')}
                  </h3>
                  <p className="font-body text-xs mb-2" style={{ color: 'var(--fg-muted)' }}>
                    فرم زیر را پر کنید — تیم پشتیبانی ما پاسخگوست است.
                  </p>
                  {[
                    { key: 'name', type: 'text', label: t('name') },
                    { key: 'email', type: 'email', label: t('email') },
                    { key: 'phone', type: 'tel', label: t('phone') },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: 'var(--fg)' }}>{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={e => set(f.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                        style={{
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--hairline)',
                          color: 'var(--fg)',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="font-body text-xs font-semibold block mb-1.5" style={{ color: 'var(--fg)' }}>{t('message')}</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-none transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--hairline)',
                        color: 'var(--fg)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{
                      background: 'var(--accent)',
                      color: 'hsl(var(--accent-foreground))',
                      boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                    }}
                  >
                    <Send size={16} />
                    {t('send_message')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      </PullToRefresh>
    </div>
  );
}