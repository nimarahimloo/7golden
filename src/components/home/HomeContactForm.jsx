
import { useState } from 'react';
import {
  Send,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import { createContactMessage } from '@/lib/api/content';

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

const FIELDS = [
  {
    key: 'name',
    type: 'text',
    label: 'نام و نام خانوادگی',
    required: true,
    autoComplete: 'name',
  },
  {
    key: 'phone',
    type: 'tel',
    label: 'شماره تماس',
    required: false,
    autoComplete: 'tel',
  },
  {
    key: 'email',
    type: 'email',
    label: 'آدرس ایمیل',
    required: false,
    autoComplete: 'email',
  },
] as const;

export default function HomeContactForm() {
  const [form, setForm] = useState < FormState > ({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState < FormStatus > ('idle');

  const setField = (
    key: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (status === 'error') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.message.trim() ||
      status === 'sending'
    ) {
      return;
    }

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
          eyebrow="ارتباط با ۷ گلدن"
          title="آغاز یک همکاری حرفه‌ای"
          lead="برای آشنایی با محصولات، دریافت مشخصات فنی یا بررسی سفارش موردنظرتان، با ما در ارتباط باشید. درخواست شما، آغاز گفت‌وگویی دقیق درباره نیازهای مجموعه شماست."
          className="mb-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">

          {/* اطلاعات تماس */}

          <Reveal
            variant="left"
            className="lg:col-span-2"
          >
            <div className="flex flex-col gap-3">

              <a
                href="tel:+989121823438"
                className="p-5 rounded-2xl panel gold-frame flex items-center gap-4 transition-all hover:scale-[1.01]"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--hairline-strong)',
                  }}
                >
                  <Phone
                    size={18}
                    style={{ color: 'var(--accent)' }}
                  />
                </span>

                <span>
                  <span
                    className="font-body text-xs block mb-1"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    تماس مستقیم
                  </span>

                  <span
                    className="font-heading font-black text-sm"
                    style={{
                      color: 'var(--fg)',
                      fontFamily: 'Peyda, serif',
                      direction: 'ltr',
                      display: 'block',
                    }}
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
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--hairline-strong)',
                  }}
                >
                  <Mail
                    size={18}
                    style={{ color: 'var(--accent)' }}
                  />
                </span>

                <span>
                  <span
                    className="font-body text-xs block mb-1"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    مکاتبات و درخواست‌ها
                  </span>

                  <span
                    className="font-heading font-black text-sm"
                    style={{
                      color: 'var(--fg)',
                      fontFamily: 'Peyda, serif',
                      direction: 'ltr',
                      display: 'block',
                    }}
                  >
                    info@7golden.co
                  </span>
                </span>
              </a>

              <div className="p-5 rounded-2xl liquid-glass-strong flex items-start gap-4">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--hairline-strong)',
                  }}
                >
                  <MessageCircle
                    size={18}
                    style={{ color: 'var(--accent)' }}
                  />
                </span>

                <span>
                  <span
                    className="font-body text-sm font-semibold block mb-2"
                    style={{ color: 'var(--fg)' }}
                  >
                    درخواست خود را مطرح کنید
                  </span>

                  <span
                    className="font-body text-xs leading-relaxed"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    نام محصول، نوع فرآوری، مقدار موردنیاز یا مشخصات
                    فنی مدنظرتان را درج کنید تا موضوع درخواست روشن باشد.
                  </span>
                </span>
              </div>

            </div>
          </Reveal>

          {/* فرم ارتباط */}

          <Reveal
            variant="up"
            delay={120}
            className="lg:col-span-3"
          >
            <div className="p-5 md:p-8 rounded-3xl panel-strong">

              {status === 'sent' ? (
                <div
                  className="flex flex-col items-center justify-center py-14 text-center"
                  role="status"
                  aria-live="polite"
                >
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
                    className="font-heading text-xl font-black mb-3"
                    style={{
                      color: 'var(--fg)',
                      fontFamily: 'Peyda, serif',
                    }}
                  >
                    درخواست شما ثبت شد.
                  </h3>

                  <p
                    className="font-body text-sm leading-relaxed max-w-sm"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    از توجه شما به ۷ گلدن سپاسگزاریم.
                    اطلاعات درخواست برای پیگیری ثبت شده است.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="mb-2">
                    <h3
                      className="font-heading font-black text-lg mb-2"
                      style={{
                        color: 'var(--fg)',
                        fontFamily: 'Peyda, serif',
                      }}
                    >
                      درخواست اطلاعات و همکاری
                    </h3>

                    <p
                      className="font-body text-xs leading-relaxed"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      اطلاعات زیر را تکمیل کنید تا درخواست شما
                      برای بررسی ثبت شود.
                    </p>
                  </div>

                  {FIELDS.map((field) => (
                    <div key={field.key}>
                      <label
                        htmlFor={`contact-${field.key}`}
                        className="font-body text-xs font-semibold block mb-2"
                        style={{ color: 'var(--fg)' }}
                      >
                        {field.label}

                        {field.required && (
                          <span style={{ color: 'var(--accent)' }}>
                            {' '}*
                          </span>
                        )}
                      </label>

                      <input
                        id={`contact-${field.key}`}
                        name={field.key}
                        type={field.type}
                        value={form[field.key]}
                        onChange={(event) =>
                          setField(field.key, event.target.value)
                        }
                        required={field.required}
                        autoComplete={field.autoComplete}
                        dir={field.key === 'phone' || field.key === 'email' ? 'ltr' : 'rtl'}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>
                  ))}

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="font-body text-xs font-semibold block mb-2"
                      style={{ color: 'var(--fg)' }}
                    >
                      جزئیات درخواست
                      <span style={{ color: 'var(--accent)' }}>
                        {' '}*
                      </span>
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={(event) =>
                        setField('message', event.target.value)
                      }
                      required
                      placeholder="محصول موردنظر، مشخصات فنی یا جزئیات سفارش خود را بنویسید."
                      className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-y transition-all"
                      style={inputStyle}
                    />
                  </div>

                  {status === 'error' && (
                    <p
                      className="font-body text-xs leading-relaxed"
                      style={{ color: '#f87171' }}
                      role="alert"
                    >
                      ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید
                      یا از طریق اطلاعات تماس با ما ارتباط بگیرید.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--accent)',
                      color: 'hsl(var(--accent-foreground))',
                      boxShadow:
                        '0 8px 32px rgba(212,175,55,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
                    }}
                  >
                    <Send size={16} />

                    {status === 'sending'
                      ? 'در حال ثبت درخواست...'
                      : 'ثبت درخواست'}
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
