import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useScrollAnimation } from '@/components/useScrollAnimation';

const STORIES = [
{
  image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/63cc54780_generated_image.png',
  nameFA: 'پسته قزوین',
  nameEN: 'Qazvin Pistachio',
  regionFA: 'بوئین\u200cزهرا، قزوین',
  regionEN: 'Buin Zahra, Qazvin',
  storyFA: 'در دامنه\u200cهای خشک و آفتاب\u200cگیر بوئین\u200cزهرا، پسته\u200cای سبز می\u200cشود که رنگ و طعمش در دنیا بی\u200cنظیر است. کشاورزان ما با دانشِ نسل\u200cها، هر درخت را با صبر و عشق پرورش می\u200cدهند و سبزترین مغز پسته\u200cی دنیا را به دست می\u200cرسانند.',
  storyEN: 'In the dry, sun-drenched slopes of Buin Zahra, a pistachio grows whose color and flavor are unmatched worldwide. Our farmers nurture each tree with generational knowledge and devotion, producing the greenest pistachio kernels on earth.'
},
{
  image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/ad2b537bb_generated_image.png',
  nameFA: 'فندق اشنویه',
  nameEN: 'Oshnavieh Hazelnut',
  regionFA: 'اشنویه و قزوین',
  regionEN: 'Oshnavieh & Qazvin',
  storyFA: 'از باغستان\u200cهای سرسبز اشنویه و قزوین، فندقی با طعم شیرین و خامه\u200cای به دست می\u200cرسد که در صنایع شکلات و شیرینی جهان جایگاهی ویژه دارد. شرایط اقلیمی و خاکی این مناطق، کیفیتی منحصر\u200cبه\u200cفرد به مغز فندق می\u200cبخشد.',
  storyEN: 'From the lush orchards of Oshnavieh and Qazvin comes a hazelnut with a sweet, creamy flavor that holds a special place in the global chocolate and confectionery industries. The climate and soil of these regions impart a unique quality to the kernels.'
},
{
  image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/1ff738aeb_generated_image.png',
  nameFA: 'بادام ایرانی',
  nameEN: 'Iranian Almond',
  regionFA: 'ایران',
  regionEN: 'Iran',
  storyFA: 'بادام درختی ایرانی، با روکش قهوه\u200cای خاص خود، در سایزهای مختلف برای مصرف بازار و صنایع قنادی و شکلات\u200cسازی پرورش می\u200cیابد. هر مغز بادام، حاصلِ سال\u200cها تلاش و مراقبت از باغستان\u200cهای ایران است.',
  storyEN: 'Iranian tree almonds, with their distinctive brown coating, are cultivated in various sizes for markets and the confectionery and chocolate industries. Each almond kernel is the result of years of care and dedication in Iranian orchards.'
}];


export default function OriginStory() {
  const { lang, dir } = useApp();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--bg)' }} dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-subheading text-xs uppercase block mb-3" style={{ color: '#D4AF37', fontFamily: subFont }}>
            {isFA ? 'خاستگاه محصولات' : 'Product Origins'}
          </span>
          <h2 className="font-black mb-4 text-6xl md:text-6xl [font-family:'YekanBakh',_system-ui,_sans-serif]" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'از باغ تا میز شما' : 'From Orchard to Your Table'}
          </h2>
          

          
        </div>

        {/* Stories */}
        <div className="flex flex-col gap-16 md:gap-24">
          {STORIES.map((story, i) => {
            const reversed = i % 2 === 1;
            return (
              <StoryBlock key={i} story={story} reversed={reversed} isFA={isFA} headingFont={headingFont} />);

          })}
        </div>
      </div>
    </section>);

}

function StoryBlock({ story, reversed, isFA, headingFont }) {
  const { ref, visible } = useScrollAnimation();

  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center`}>
      {/* Image */}
      <div className={reversed ? 'md:order-2' : ''}>
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/10]" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <img src={story.image} alt={isFA ? story.nameFA : story.nameEN} className="w-full h-full object-cover" style={{ animation: 'kenBurns 8s ease-out forwards' }} />
          {/* Region badge */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="glass-card px-4 py-2.5 rounded-2xl">
              <span className="font-body text-[9px] uppercase block mb-0.5" style={{ color: '#D4AF37' }}>
                {isFA ? 'خاستگاه' : 'Origin'}
              </span>
              <span className="font-heading font-extrabold text-sm text-white" style={{ fontFamily: headingFont }}>
                {isFA ? story.regionFA : story.regionEN}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Text */}
      <div className={reversed ? 'md:order-1' : ''}>
        <h3 className="font-heading text-xl md:text-3xl font-black mb-4" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
          {isFA ? story.nameFA : story.nameEN}
        </h3>
        <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {isFA ? story.storyFA : story.storyEN}
        </p>
      </div>
    </div>);

}