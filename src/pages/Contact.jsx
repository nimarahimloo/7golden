import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  MessageCircle,
  Instagram,
  Globe,
} from 'lucide-react';

import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import { usePageHero } from '@/lib/usePageHero';
import { createContactMessage } from '@/lib/api/content';
import Eyebrow from '@/components/ui/eyebrow';
import { CONTACT_INFO, CONTACT_ADDRESSES } from '@/lib/contact-info';

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: 'تلفن دفتر',
    value: CONTACT_INFO.officePhone,
    href: CONTACT_INFO.officePhoneLink,
    dir: 'ltr',
  },
  {
    icon: Phone,
    label: 'موبایل / واتساپ',
    value: CONTACT_INFO.mobile,
    href: CONTACT_INFO.mobileLink,
    dir: 'ltr',
  },
  {
    icon: Mail,
    label: 'ایمیل',
    value: CONTACT_INFO.email,
    href: CONTACT_INFO.emailLink,
    dir: 'ltr',
  },
  {
    icon: Globe,
    label: 'وب‌سایت',
    value: CONTACT_INFO.website,
    href: CONTACT_INFO.websiteLink,
    dir: 'ltr',
  },
  {
    icon: Instagram,
    label: 'اینستاگرام',
    value: CONTACT_INFO.instagram,
    href: CONTACT_INFO.instagramLink,
    dir: 'ltr',
  },
];

export default function Contact() {
  const { refreshSiteMode } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  const set = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const { hero } = usePageHero('contact', {
    image: '/banner/banner-spoons-set.webp',
    title: t('contact_title'),
    subtitle: 'شماره تماس، ایمیل و ثبت درخواست',
    badge: 'تماس با ما',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);
    setSendError('');

    try {
      await createContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });

      setSent(true);
    } catch {
      setSendError(
        'ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید یا با دفتر مجموعه تماس بگیرید.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
      }}
    >
      <Seo
        title={`تماس با ${SITE_SEO.siteNameFA}`}
        description="راه‌های ارتباط با خشکبار هفت‌طلایی؛ شماره تماس دفتر، موبایل، ایمیل، آدرس دفاتر و کارخانه."
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/contact`}
      />

      <PullToRefresh onRefresh={refreshSiteMode}>
        {/* Hero */}
        <div className="relative">
          <DynamicHeroSlider
            pageKey="contact"
            fallback={{
              image: hero?.image || '/banner/Hero.webp',
              title: hero?.title || '',
              subtitle: hero?.subtitle || '',
              badge: hero?.badge || '',
            }}
          />
        </div>

        {/* Contact Cards */}
        <section className="chapter-shell -mt-12 relative z-10 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {CONTACT_CARDS.map((card, i) => (
              <Reveal
                key={card.label}
                delay={i * 80}
                variant="up"
              >
                <a
                  href={card.href}
                  target={
                    card.href.startsWith('http') ? '_blank' : undefined
                  }
                  rel={
                    card.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="rounded-2xl p-4 md:p-5 panel gold-frame transition-all duration-300 group block h-full"
                >
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{
                      background: 'rgba(212,175,55,0.12)',
                      border: '1px solid var(--hairline-strong)',
                    }}
                  >
                    <card.icon
                      size={18}
                      style={{ color: 'var(--accent)' }}
                    />
                  </div>

                  <p
                    className="font-body text-xs mb-1"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {card.label}
                  </p>

                  <p
                    dir={card.dir}
                    className="font-heading font-black text-xs md:text-sm"
                    style={{
                      color: 'var(--fg)',
                      fontFamily: 'Peyda, serif',
                    }}
                  >
                    {card.value}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Addresses + Form */}
        <div className="chapter-shell pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Addresses */}
            <div>
              <StoryChapter
                index="01"
                eyebrow="LOCATIONS"
                title="آدرس‌های ما"
                className="mb-8"
              />

              <div className="flex flex-col gap-4 mb-8">
                {CONTACT_ADDRESSES.map((location, i) => (
                  <Reveal
                    key={location.title}
                    variant="left"
                    delay={80 + i * 80}
                  >
                    <div className="p-6 rounded-3xl liquid-glass-strong">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(212,175,55,0.12)',
                            border: '1px solid var(--hairline-strong)',
                          }}
                        >
                          <MapPin
                            size={20}
                            style={{ color: 'var(--accent)' }}
                          />
                        </div>

                        <div>
                          <h3
                            className="font-heading font-black text-sm mb-2"
                            style={{
                              color: 'var(--fg)',
                              fontFamily: 'Peyda, serif',
                            }}
                          >
                            {location.title}
                          </h3>

                          <p
                            className="font-body text-sm leading-relaxed"
                            style={{ color: 'var(--fg-muted)' }}
                          >
                            {location.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Company Image */}
              <Reveal variant="up" delay={120}>
                <ParallaxMedia
                  src="/img-6052.webp"
                  alt="فضای مجموعه هفت طلایی"
                  ratio="aspect-[16/9]"
                  className="rounded-3xl"
                  speed={0.2}
                />
              </Reveal>

              {/* Social & Contact Links */}
              <Reveal
                variant="up"
                delay={200}
                className="mt-6"
              >
                <div className="p-6 rounded-3xl liquid-glass-strong">
                  <h3
                    className="font-heading font-black text-sm mb-4"
                    style={{
                      color: 'var(--fg)',
                      fontFamily: 'Peyda, serif',
                    }}
                  >
                    راه‌های ارتباطی
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {/* WhatsApp */}
                    <a
                      href={CONTACT_INFO.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="پیام در واتساپ"
                      title="واتساپ"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <MessageCircle
                        size={18}
                        style={{ color: 'var(--accent)' }}
                      />
                    </a>

                    {/* Phone */}
                    <a
                      href={CONTACT_INFO.mobileLink}
                      aria-label="تماس تلفنی"
                      title="تماس تلفنی"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <Phone
                        size={18}
                        style={{ color: 'var(--accent)' }}
                      />
                    </a>

                    {/* Email */}
                    <a
                      href={CONTACT_INFO.emailLink}
                      aria-label="ارسال ایمیل"
                      title="ایمیل"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <Mail
                        size={18}
                        style={{ color: 'var(--accent)' }}
                      />
                    </a>

                    {/* Instagram */}
                    <a
                      href={CONTACT_INFO.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="صفحه اینستاگرام هفت طلایی"
                      title="اینستاگرام"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <Instagram
                        size={18}
                        style={{ color: 'var(--accent)' }}
                      />
                    </a>

                    {/* Website */}
                    <a
                      href={CONTACT_INFO.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="وب‌سایت هفت طلایی"
                      title="وب‌سایت"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <Globe
                        size={18}
                        style={{ color: 'var(--accent)' }}
                      />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Contact Form */}
            <div>
              <StoryChapter
                index="02"
                eyebrow="INQUIRY"
                title="ارسال درخواست همکاری"
                className="mb-8"
              />

              <Reveal variant="up" delay={120}>
                <div className="p-5 md:p-8 rounded-3xl panel-strong">
                  {sent ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                        style={{
                          background: 'rgba(34,197,94,0.12)',
                          border: '1px solid rgba(34,197,94,0.25)',
                        }}
                      >
                        <CheckCircle
                          size={36}
                          style={{ color: '#22c55e' }}
                        />
                      </div>

                      <h3
                        className="font-heading text-xl font-black mb-2"
                        style={{
                          color: 'var(--fg)',
                          fontFamily: 'Peyda, serif',
                        }}
                      >
                        پیام شما ثبت شد.
                      </h3>

                      <p
                        className="font-body text-sm"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        پیام شما در سامانه ثبت شد. برای پیگیری، با دفتر مجموعه تماس بگیرید.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="contact-page-form flex flex-col gap-4"
                    >
                      {[
                        {
                          key: 'name',
                          type: 'text',
                          label: t('name'),
                        },
                        {
                          key: 'email',
                          type: 'email',
                          label: t('email'),
                        },
                        {
                          key: 'phone',
                          type: 'tel',
                          label: t('phone'),
                        },
                      ].map((field) => (
                        <div key={field.key}>
                          <label
                            htmlFor={`contact-${field.key}`}
                            className="font-body text-xs font-semibold block mb-1.5"
                            style={{ color: 'var(--fg)' }}
                          >
                            {field.label}
                          </label>

                          <input
                            id={`contact-${field.key}`}
                            type={field.type}
                            name={field.key}
                            autoComplete={
                              field.key === 'name'
                                ? 'name'
                                : field.key === 'email'
                                  ? 'email'
                                  : 'tel'
                            }
                            required={field.key === 'name'}
                            value={form[field.key]}
                            onChange={(e) =>
                              set(field.key, e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                            style={{
                              background: 'rgba(0,0,0,0.2)',
                              border: '1px solid var(--hairline)',
                              color: 'var(--fg)',
                              boxShadow:
                                'inset 0 1px 2px rgba(0,0,0,0.3)',
                            }}
                          />
                        </div>
                      ))}

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="font-body text-xs font-semibold block mb-1.5"
                          style={{ color: 'var(--fg)' }}
                        >
                          {t('message')}
                        </label>

                        <textarea
                          id="contact-message"
                          name="message"
                          rows={4}
                          required
                          value={form.message}
                          onChange={(e) =>
                            set('message', e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-none transition-all"
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--hairline)',
                            color: 'var(--fg)',
                            boxShadow:
                              'inset 0 1px 2px rgba(0,0,0,0.3)',
                          }}
                        />
                      </div>

                      {sendError && (
                        <p
                          className="font-body text-xs leading-relaxed"
                          style={{ color: '#f87171' }}
                          role="alert"
                        >
                          {sendError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: 'var(--accent)',
                          color: 'hsl(var(--accent-foreground))',
                          boxShadow:
                            '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                        }}
                      >
                        <Send size={16} />

                        {sending
                          ? 'در حال ارسال…'
                          : t('send_message')}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Closing Banner */}
        <section
          className="closing-band"
          style={{ minHeight: '50vh' }}
        >
          <div className="closing-band-bg">
            <img
              src="/hazelnut-spoon.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative z-10 chapter-shell py-20 md:py-28 text-center">
            <Reveal variant="up">
              <Eyebrow className="block mb-5">
                CONTACT
              </Eyebrow>
            </Reveal>

            <Reveal variant="up" delay={80}>
              <h2
                className="display-lg"
                style={{ color: 'var(--ink)' }}
              >
                <span className="gold-text">
                  برای سفارش و همکاری با ما تماس بگیرید
                </span>
              </h2>
            </Reveal>

            <Reveal
              variant="up"
              delay={120}
              className="mt-6"
            >
              <p
                className="font-body text-sm md:text-base"
                style={{ color: 'var(--fg-muted)' }}
              >
                کارخانه: قزوین، آبیک، شهرک صنعتی کاسپین ۲، نبش کوچه ۲
              </p>
            </Reveal>

            <Reveal
              variant="up"
              delay={200}
              className="mt-8"
            >
              <a
                href={CONTACT_INFO.mobileLink}
                className="btn-gold inline-flex"
              >
                <Phone size={16} />
                تماس مستقیم
              </a>
            </Reveal>
          </div>
        </section>

        {/* Factory Map */}
        <section
          className="map-band"
          aria-label="موقعیت کارخانه هفت طلایی در شهرک صنعتی کاسپین ۲"
        >
          <div
            className="map-frame"
            data-loaded={mapLoaded ? 'true' : 'false'}
          >
            <iframe
              title="موقعیت کارخانه هفت طلایی در قزوین، آبیک، شهرک صنعتی کاسپین ۲"
              src="https://maps.google.com/maps?q=Qazvin%2C%20Abyek%2C%20Caspian%20Industrial%20Park%202&z=13&output=embed"
              className="map-frame-iframe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />

            <div
              className="map-frame-veil"
              aria-hidden="true"
            />
          </div>
        </section>
      </PullToRefresh>
    </div>
  );
}
