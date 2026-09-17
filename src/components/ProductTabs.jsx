import React, { useState } from 'react';

export default function ProductTabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Tab bar — glass pills */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex-shrink-0 px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all whitespace-nowrap"
            style={{
              background: active === i ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
              backdropFilter: active === i ? 'none' : 'blur(12px)',
              WebkitBackdropFilter: active === i ? 'none' : 'blur(12px)',
              color: active === i ? 'hsl(var(--accent-foreground))' : 'var(--fg-muted)',
              border: active === i ? 'none' : '1px solid rgba(255,255,255,0.06)',
              boxShadow: active === i ? '0 4px 16px rgba(212,175,55,0.2), inset 0 1px 1px rgba(255,255,255,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="mt-5">{tabs[active].content}</div>
    </div>
  );
}