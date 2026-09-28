import React from 'react';
import { motion } from 'framer-motion';

const stories = [
  {
    image: '/cdn/origin-1.png',
    titleFA: 'ریشه در زمین',
    titleEN: 'Rooted in the land',
    eyebrow: 'ORIGIN',
  },
  {
    image: '/cdn/origin-2.png',
    titleFA: 'برداشت با دقت',
    titleEN: 'Careful harvest',
    eyebrow: 'HARVEST',
  },
  {
    image: '/cdn/origin-3.png',
    titleFA: 'صادرات جهانی',
    titleEN: 'Global export',
    eyebrow: 'EXPORT',
  },
];

export default function OriginStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl aspect-[4/5]"
            >
              <img src={s.image} alt={s.titleFA} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <p className="eyebrow text-xs tracking-widest mb-1">{s.eyebrow}</p>
                <h3 className="font-heading text-xl text-white">{s.titleFA}</h3>
                <p className="text-sm text-white/70">{s.titleEN}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
