import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Eye,
  PackageCheck,
  Handshake,
} from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import DepthParallax from '@/components/story/DepthParallax';
import Eyebrow from '@/components/ui/eyebrow';

const PROOFS = [
  {
    icon: Eye,
    title: 'شناخت دقیق محصول',
    text: 'طعم، بافت، اندازه و ویژگی‌های هر محصول، بخشی از هویت آن هستند. شناخت این جزئیات، مبنای انتخاب پسته، بادام و فندق در ۷ گلدن است.',
  },
  {
    icon: PackageCheck,
    title: 'فرآوری متناسب با کاربرد',
    text: 'از مغز تا خلال، شکل ارائه محصول با نوع مصرف آن ارتباط دارد. انتخاب محصول با توجه به نیاز صنایع غذایی و مجموعه‌های حرفه‌ای انجام می‌شود.',
  },
  {
    icon: Handshake,
    title: 'همکاری در مقیاس حرفه‌ای',
    text: 'مشخصات محصول، مقدار سفارش و نوع بسته‌بندی در کنار هم تعریف می‌شوند تا نیاز هر مجموعه، مبنای انتخاب و برنامه‌ریزی سفارش باشد.',
  },
];

export default function HomeOrigin() {
  return (
    <section className="chapter">
      <div className="chapter-shell">
        <StoryChapter
          index="03"
          eyebrow="نگاه ۷ گلدن"
          title="شناخت محصول، امضای ۷ گلدن است."
          lead="پسته، بادام و فندق هرکدام ویژگی‌های خاص خود را دارند. شناخت طعم، بافت، اندازه و کاربرد، مبنای انتخاب محصول برای مصارف حرفه‌ای و تجاری در ۷ گلدن است."
          align="center"
          className="mb-12 md:mb-16"
        />

        <DepthParallax
          src="/banner/banner-spoons-set.webp"
          alt="محصولات خشکبار ۷ گلدن"
          ratio="aspect-[4/3] md:aspect-[21/9]"
          className="rounded-3xl"
        >
          <div>
            <Eyebrow className="block mb-2">
              معیارهای انتخاب
            </Eyebrow>

            <span
              className="display-md"
              style={{ color: 'var(--ink)' }}
            >
              کیفیت، حاصل انتخاب دقیق است.
            </span>
          </div>
        </DepthParallax>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
          {PROOFS.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="fact-card h-full">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: 'rgba(227,194,99,0.1)',
                    border: '1px solid var(--hairline-strong)',
                  }}
                >
                  <item.icon
                    size={20}
                    style={{ color: 'var(--gold-2)' }}
                  />
                </div>

                <h3
                  className="display-sm mb-3"
                  style={{ color: '#fff' }}
                >
                  {item.title}
                </h3>

                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: '#fff' }}
                >
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={120}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/contact" className="btn-gold">
            مشاوره و سفارش
            <ChevronLeft size={16} />
          </Link>

          <Link to="/about" className="btn-ghost">
            آشنایی با ۷ گلدن
          </Link>
        </Reveal>
      </div>
    </section>
  );
}