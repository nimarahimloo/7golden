import React from 'react';

const badges = [
  {
    name: 'اینماد',
    desc: 'نماد اعتماد الکترونیکی',
    image: 'https://7golden.co/wp-content/uploads/2022/09/Certificate-min.png',
  },
  {
    name: 'صنعت و معدن',
    desc: 'وزارت صنعت، معدن و تجارت',
    image: 'https://7golden.co/wp-content/uploads/2022/09/Certificate-min.png',
  },
  {
    name: 'اتاق بازرگانی',
    desc: 'اتاق بازرگانی و صنایع',
    image: 'https://7golden.co/wp-content/uploads/2022/09/Certificate-min.png',
  },
  {
    name: 'ساماندهی',
    desc: 'پایگاه ملی مجوزها',
    image: 'https://7golden.co/wp-content/uploads/2022/09/Certificate-min.png',
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map((badge, i) => (
        <a
          key={i}
          href="#"
          className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.95)' }}
          >
            <img
              src={badge.image}
              alt={badge.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-center">
            <p className="font-body text-[10px] font-bold" style={{ color: 'var(--fg)' }}>{badge.name}</p>
            <p className="font-body text-[9px]" style={{ color: 'var(--fg-muted)' }}>{badge.desc}</p>
          </div>
        </a>
      ))}
    </div>
  );
}