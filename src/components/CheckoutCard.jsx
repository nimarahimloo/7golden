// @ts-ignore
import React from 'react';

// @ts-ignore
export default function CheckoutCard({ icon: Icon, title, headingFont, children }) {
  return (
    <div
      className="p-6 rounded-3xl"
      style={{
        background: 'rgba(18,18,18,0.38)',
        backdropFilter: 'blur(48px) saturate(240%)',
        WebkitBackdropFilter: 'blur(48px) saturate(240%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(212,175,55,0.08)',
            backdropFilter: 'blur(16px) saturate(200%)',
            WebkitBackdropFilter: 'blur(16px) saturate(200%)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: 'var(--accent)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12), 0 4px 16px rgba(212,175,55,0.1)',
          }}
        >
          <Icon size={18} />
        </div>
        <h2 className="font-heading text-lg font-black" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}