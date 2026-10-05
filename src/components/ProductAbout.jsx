import React from 'react';
import { Factory, Package, Gauge } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import { CAPACITY_NOTES } from '@/lib/corporate-content';
import { extractUses, getPackagingOptions, getTasteRows, toFa } from '@/lib/product-facts';

function TasteBar({ label, value, delay }) {
  const { ref, visible } = useScrollAnimation(0.1);
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-xs" style={{ color: '#fff' }}>{label}</span>
        <span className="font-body text-xs" style={{ color: 'var(--gold-2)' }}>{toFa(value)}٪</span>
      </div>
      <div className="taste-track">
        <div
          className="taste-fill"
          style={{ transform: `scaleX(${visible ? value / 100 : 0})`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function FactCard({ icon: Icon, title, children, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="fact-card h-full">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
          >
            <Icon size={19} style={{ color: 'var(--gold-2)' }} />
          </span>
          <h3 className="display-sm" style={{ color: '#fff' }}>{title}</h3>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

const GRID_COLS = {
  1: 'md:grid-cols-1 max-w-xl mx-auto',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
};

/**
 * ProductAbout — the facts hiding inside a product's own data, laid out for
 * a buyer: which industries it serves (read from the description), which pack
 * sizes it ships in, and its taste profile. Cards with no data are skipped.
 */
export default function ProductAbout({ product, name }) {
  const uses = extractUses(product.descFA);
  const packs = getPackagingOptions(product.weights);
  const taste = getTasteRows(product.taste);

  const cards = [];
  if (uses.length > 0) {
    cards.push(
      <FactCard key="uses" icon={Factory} title="کاربرد صنعتی" delay={0}>
        <div className="flex flex-wrap gap-2">
          {uses.map((u) => <span key={u} className="fact-chip">{u}</span>)}
        </div>
      </FactCard>
    );
  }
  if (packs.length > 0) {
    cards.push(
      <FactCard key="packs" icon={Package} title="بسته‌بندی و حجم سفارش" delay={90}>
        <div className="flex flex-wrap gap-2 mb-4">
          {packs.map((p) => <span key={p} className="fact-chip">{p}</span>)}
        </div>
        <p className="font-body text-xs leading-relaxed" style={{ color: '#fff' }}>
          {CAPACITY_NOTES[3]}
        </p>
      </FactCard>
    );
  }
  if (taste.length > 0) {
    cards.push(
      <FactCard key="taste" icon={Gauge} title="پروفایل طعم" delay={180}>
        <div className="flex flex-col gap-4">
          {taste.map((row, i) => <TasteBar key={row.label} label={row.label} value={row.value} delay={i * 120} />)}
        </div>
      </FactCard>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className="mt-16">
      <StoryChapter
        eyebrow="PRODUCT DETAILS"
        title={`کاربرد و ویژگی‌های ${name}`}
        align="center"
        className="mb-10"
      />
      <div className={`grid grid-cols-1 gap-4 md:gap-6 ${GRID_COLS[cards.length]}`}>
        {cards}
      </div>
    </div>
  );
}
