import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false, lang }) {
  const [open, setOpen] = useState(defaultOpen);
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'hsl(var(--card))' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 transition-all hover:bg-black/5"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} style={{ color: 'var(--accent)' }} />}
          <h3 className="font-body font-semibold text-sm" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {title}
          </h3>
        </div>
        <ChevronDown
          size={18}
          style={{ color: 'var(--fg-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}