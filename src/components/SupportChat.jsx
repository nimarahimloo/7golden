import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/contact-info';

/**
 * SupportChat — the 7Golden trade-desk assistant.
 *
 * Deliberately LOCAL and FREE: it answers from a small in-repo knowledge base
 * with keyword matching. No external API, no paid AI service and no network
 * request — every answer ships with the site and works offline.
 * Keep the copy in sync with the brand's verified facts (corporate-content.js).
 */

const CONTACT = `تلفن دفتر: ${CONTACT_INFO.officePhone} و موبایل: ${CONTACT_INFO.mobile} · ایمیل: ${CONTACT_INFO.email}`;

const KNOWLEDGE = [
  {
    id: 'products',
    keywords: ['محصول', 'محصولات', 'گرید', 'چی دارید', 'تولید میکنید', 'تولید می‌کنید'],
    answer:
      'گروه‌های اصلی محصول هفت‌طلایی فندق، پسته و بادام هستند. شکل‌های فرآوری‌شده می‌تواند شامل مغز، خلال، پرک، خمیر، گرانول یا پودر باشد؛ فهرست محصولات و موجودی روز را در صفحه محصولات ببینید یا از واحد فروش استعلام بگیرید.\n' +
      CONTACT,
  },
  {
    id: 'hazelnut',
    keywords: ['فندق', 'خمیر', 'گرانول', 'پودر فندق'],
    answer:
      'در گروه فندق، شکل‌هایی مانند مغز، خمیر، گرانول و پودر در فهرست محصولات دیده می‌شود. برای اطلاع از گرید، موجودی، نوع بسته‌بندی و امکان تأمین، مشخصات سفارش را با واحد فروش مطرح کنید.\n' +
      CONTACT,
  },
  {
    id: 'pistachio',
    keywords: ['پسته', 'خلال', 'مغز پسته', 'سبز'],
    answer:
      'گروه پسته می‌تواند شامل مغز پسته، مغز پوست‌کنده، خلال و پودر باشد. شکل قابل‌عرضه و موجودی روز باید هنگام سفارش تأیید شود.\n' +
      CONTACT,
  },
  {
    id: 'almond',
    keywords: ['بادام', 'پرک', 'بادام زمینی'],
    answer:
      'در گروه بادام، شکل‌هایی مانند مغز، خلال و پرک مطرح هستند. برای تأیید نوع دقیق محصول، مشخصات و موجودی، با واحد فروش تماس بگیرید.\n' +
      CONTACT,
  },
  {
    id: 'price',
    keywords: ['قیمت', 'نمونه', 'استعلام', 'پیش‌فاکتور', 'پیش فاکتور', 'سفارش', 'خرید', 'عمده'],
    answer:
      'برای استعلام، نام محصول، شکل فرآوری، مقدار موردنیاز و جزئیات بسته‌بندی را اعلام کنید. قیمت و موجودی بر اساس مشخصات سفارش بررسی می‌شود.\n' +
      CONTACT,
  },
  {
    id: 'shipping',
    keywords: ['ارسال', 'تحویل', 'زمان', 'کشور', 'مقصد', 'صادرات', 'صادر', 'گمرک', 'خارج'],
    answer:
      'اطلاعات مقصد قابل ارسال، مدارک موردنیاز و زمان تحویل باید برای همان سفارش از واحد فروش تأیید شود. من فهرست مستند و به‌روزی از بازارهای فعال یا مدارک هر محموله ندارم.\n' +
      CONTACT,
  },
  {
    id: 'quality',
    keywords: ['کیفیت', 'کنترل', 'آزمایشگاه', 'رطوبت', 'استاندارد', 'مجوز', 'بهداشت', 'گواهی', 'مدرک'],
    answer:
      'برای پاسخ دقیق درباره مشخصات فنی، آزمون‌ها یا مدارک مربوط به یک محصول، باید مدارک همان محصول بررسی شود. از این گفت‌وگو نمی‌توانم وجود آزمایشگاه، گواهی یا آزمون هر محموله را تأیید کنم.\n' +
      CONTACT,
  },
  {
    id: 'about',
    keywords: ['درباره', 'کی هستید', 'تاریخ', 'سابقه', 'قزوین', 'کارخانه', 'آدرس'],
    answer:
      'پیشینه خانوادگی خشکبار محمدی در بازار قزوین به سال ۱۳۳۵ بازمی‌گردد. فرآوری خشکبار در کارگاهی کوچک در سال ۱۳۷۷ آغاز شد و شرکت خشکبار و بسته‌بندی هفت طلایی در سال ۱۳۹۶ ثبت شد.\n' +
      'دفتر: قزوین، انتهای سعدی جنوبی، نرسیده به چهارراه بازار، پلاک ۲۱۰. کارخانه: قزوین، شهرک صنعتی کاسپین ۲، نبش کوشش ۲.\n' +
      CONTACT,
  },
  {
    id: 'contact',
    keywords: ['تماس', 'شماره', 'تلفن', 'ایمیل', 'ارتباط', 'ساعات', 'پاسخگویی'],
    answer:
      'برای اطلاع از ساعات پاسخگویی، با دفتر مجموعه تماس بگیرید.\n' +
      CONTACT,
  },
];

const QUICK_REPLIES = ['محصولات', 'قیمت و سفارش', 'ارسال و تحویل', 'مدارک محصول', 'تماس'];

function findAnswer(text) {
  const q = (text || '').trim().toLowerCase();
  if (!q) return null;
  let best = null;
  let bestScore = 0;
  for (const entry of KNOWLEDGE) {
    const score = entry.keywords.reduce((n, k) => (q.includes(k.toLowerCase()) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  if (best) return best.answer;
  return (
    'متأسفانه پاسخ این مورد را در دست ندارم. برای پاسخ دقیق با واحد بازرگانی ما در تماس باشید:\n' +
    CONTACT
  );
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const ask = (text) => {
    const clean = (text || '').trim();
    if (!clean) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: clean },
      { role: 'assistant', content: findAnswer(clean) },
    ]);
    setInput('');
  };

  const sendMessage = () => ask(input);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="support-fab w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'var(--accent)',
            color: 'hsl(var(--accent-foreground))',
            boxShadow: '0 8px 32px rgba(212,175,55,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
          }}
          aria-label="باز کردن راهنمای خودکار محصولات"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: '#22c55e', border: '2px solid var(--bg)' }} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="support-fab w-[calc(100vw-3rem)] max-w-sm rounded-3xl flex flex-col overflow-hidden"
          style={{
            height: 'min(60vh, 520px)',
            background: 'var(--liquid-glass-strong-bg)',
            backdropFilter: 'blur(56px) saturate(260%)',
            WebkitBackdropFilter: 'blur(56px) saturate(260%)',
            border: '1px solid var(--liquid-glass-strong-border)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                <MessageCircle size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>راهنمای هفت‌طلایی</h3>
                <p className="font-body text-xs flex items-center gap-1" style={{ color: 'var(--gold-2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-2)' }} /> راهنمای خودکار · قیمت و موجودی با واحد فروش
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center glass-pill transition-all hover:scale-110" style={{ color: 'var(--fg)' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <MessageCircle size={24} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                  سلام! 👋 دستیار هفت‌طلایی هستم.<br />یکی از موضوع‌های زیر را انتخاب کنید یا سوالتان را بنویسید.
                </p>
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="px-3 py-1.5 rounded-full font-body text-xs transition-all hover:scale-105"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--accent)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-4 py-2.5 rounded-2xl"
                  style={{
                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface-subtle)',
                    color: msg.role === 'user' ? 'hsl(var(--accent-foreground))' : 'var(--fg)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                    boxShadow: msg.role === 'user' ? '0 4px 16px rgba(212,175,55,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                  }}
                >
                  <p className="font-body text-xs leading-relaxed whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies while chatting */}
          {messages.length > 0 && (
            <div className="px-4 pb-1 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="px-2.5 py-1 rounded-full font-body text-xs transition-all hover:scale-105"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)', color: 'var(--accent)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 px-4 py-2.5 rounded-full text-xs font-body outline-none transition-all"
                style={{
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--fg)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 4px 16px rgba(212,175,55,0.2)' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
