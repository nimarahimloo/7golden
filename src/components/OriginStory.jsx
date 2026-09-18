import React from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';

const STORIES = [
{
  image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/63cc54780_generated_image.png',
  nameFA: 'پسته قزوین',
  nameEN: 'Qazvin Pistachio',
  regionFA: 'بوئین‌زهرا، قزوین',
  regionEN: 'Buin Zahra, Qazvin'
},
{
  image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/ad2b537bb_generated_image.png',
  nameFA: 'فندق اشنویه',
  nameEN: 'Oshnavieh Hazelnut',
  regionFA: 'اشنویه و قزوین',
  regionEN: 'Oshnavieh & Qazvin'
},
{
  image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/1ff738aeb_generated_image.png',
  nameFA: 'بادام ایرانی',
  nameEN: 'Iranian Almond',
  regionFA: 'ایران',
  regionEN: 'Iran'
}];

/**
 * Product origins — a three-up image mosaic. Each tile carries only the
 * growing region and the product name; the full stories live on the about page.
 */
export default function OriginStory() {
  const isFA = true;
  const headingFont = 'Peyda, serif';
  const subFont = 'Kalameh, serif';

  return (
    <section className="py-16 md:py-24" style={{ background: 'rgba(6, 4, 2, 0.5)' }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-10 md:mb-16">
          <span className="eyebrow block mb-3">ORIGIN</span>
          <span className="font-subheading text-xs uppercase block mb-3" style={{ color: 'var(--brass)', fontFamily: subFont }}>
            {isFA ? 'خاستگاه محصولات' : 'Product Origins'}
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
            {isFA ? 'از باغ تا میز شما' : 'From Orchard to Your Table'}
          </h2>
          <hr className="hairline mt-6" />
        </div>

        {/* Origin tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {STORIES.map((story, i) => (
            <StoryTile key={story.nameEN} story={story} delay={i * 100} isFA={isFA} headingFont={headingFont} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryTile({ story, delay, isFA, headingFont }) {
  const { ref, visible } = useScrollAnimation();

  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div
        className="group relative rounded-3xl overflow-hidden aspect-[4/5]"
        style={{ border: '1px solid var(--hairline)', background: 'var(--bg-secondary)' }}
      >
        <img
          src={story.image}
          alt={isFA ? story.nameFA : story.nameEN}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(2,1,0,0.92) 0%, rgba(2,1,0,0.35) 45%, transparent 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <span className="font-body text-[9px] uppercase block mb-1" style={{ color: 'var(--accent)' }}>
            {isFA ? story.regionFA : story.regionEN}
          </span>
          <h3 className="font-heading text-lg md:text-2xl font-black" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
            {isFA ? story.nameFA : story.nameEN}
          </h3>
        </div>
      </div>
    </div>
  );
}
