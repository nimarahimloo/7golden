import { Link } from 'react-router-dom';
import { ChevronLeft, Handshake, FlaskConical, Truck } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import DepthParallax from '@/components/story/DepthParallax';
import Eyebrow from '@/components/ui/eyebrow';

/**
 * HomeOrigin — chapter 03. Its one job: tell an industrial buyer why
 * sourcing straight from the orchards of Qazvin and Oshnavieh is a
 * commercial advantage (price, quality control, reliable supply) and send
 * them to request a sample. Every claim here is already stated elsewhere
 * on the site (About page, product copy, capacity notes).
 */
const PROOFS = [
  {
    icon: Handshake,
    title: 'خرید مستقیم، قیمت شفاف',
    text: 'واسطه را حذف کرده‌ایم. بخش بیشتری از ارزش به کشاورز می‌رسد و شما محصول با کیفیت بهتر و قیمت منصفانه‌تری می‌گیرید — همه می‌برند.',
  },
  {
    icon: FlaskConical,
    title: 'کنترل کیفی از برداشت تا بسته‌بندی',
    text: 'رطوبت، آفلاتوکسین و سلامت محصول را در آزمایشگاهمان می‌سنجیم تا هر محموله دقیقاً مطابق مشخصات سفارش شما باشد — نه شانسی.',
  },
  {
    icon: Truck,
    title: 'تأمین پایدار، تحویل سر موعد',
    text: 'رابطه مستقیم با باغ‌داران یعنی تأمین مداوم مواد اولیه و تحویل طبق برنامه قرارداد. در خط تولیدتان غافلگیری نخواهید داشت.',
  },
];

export default function HomeOrigin() {
  return (
    <section className="chapter">
      <div className="chapter-shell">
        <StoryChapter
          index="03"
          eyebrow="تأمین مستقیم"
          title="کیفیتی که از باغ شروع می‌شود، نه از انبار واسطه"
          lead="محصول را مستقیم از باغستان‌های قزوین و اشنویه می‌خریم؛ به همین دلیل می‌دانیم هر محموله از کجا آمده و تا بسته‌بندی چه مراحلی را گذرانده. برای کارخانه‌ای که هر ماه مواد اولیه یکسان می‌خواهد، این یعنی کیفیت قابل پیش‌بینی و قیمت شفاف."
          align="center"
          className="mb-12 md:mb-16"
        />

        <DepthParallax
          src="/banner/banner-spoons-set.webp"
          alt="باغستان‌های قزوین و اشنویه"
          ratio="aspect-[4/3] md:aspect-[21/9]"
          className="rounded-3xl"
        >
          <div>
            <Eyebrow className="block mb-2">از باغ تا کارخانه</Eyebrow>
            <span className="display-md" style={{ color: 'var(--ink)' }}>از باغ تا خط تولید شما</span>
          </div>
        </DepthParallax>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
          {PROOFS.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="fact-card h-full">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
                >
                  <item.icon size={20} style={{ color: 'var(--gold-2)' }} />
                </div>
                <h3 className="display-sm mb-3" style={{ color: '#fff' }}>{item.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: '#fff' }}>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link to="/contact" className="btn-gold">
            درخواست نمونه و قیمت
            <ChevronLeft size={16} />
          </Link>
          <Link to="/about" className="btn-ghost">داستان ما را بخوانید</Link>
        </Reveal>
      </div>
    </section>
  );
}
