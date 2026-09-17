import React, { useState } from 'react';
import { Store, Building2, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { base44 } from '@/api/base44Client';

export default function SiteModeToggle() {
  const { isStoreMode, refreshSiteMode } = useApp();
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const items = await base44.entities.SiteSettings.list();
      const currentMode = items[0]?.site_mode || 'store';
      const newMode = currentMode === 'store' ? 'corporate' : 'store';
      if (items[0]) {
        await base44.entities.SiteSettings.update(items[0].id, { site_mode: newMode });
      } else {
        await base44.entities.SiteSettings.create({
          site_name_fa: 'خشکبار هفت‌طلایی',
          site_name_en: '7Golden',
          site_mode: newMode,
        });
      }
      await refreshSiteMode();
    } catch (e) {
      alert('خطا در تغییر حالت سایت: ' + (e.message || 'نامشخص'));
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isStoreMode ? 'rgba(212,175,55,0.1)' : 'rgba(99,102,241,0.1)' }}>
          {isStoreMode
            ? <Store size={20} style={{ color: 'var(--accent)' }} />
            : <Building2 size={20} style={{ color: '#6366f1' }} />
          }
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-sm" style={{ color: 'var(--fg)' }}>حالت سایت</h3>
          <p className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
            {isStoreMode ? 'فروشگاهی — قیمت و سبد خرید فعال است' : 'شرکتی — فقط نمایش محصولات، بدون قیمت و فروش'}
          </p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={toggling}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50 flex-shrink-0"
        style={{
          background: isStoreMode ? 'var(--accent)' : 'rgba(99,102,241,0.15)',
          color: isStoreMode ? '#fff' : '#6366f1',
          border: isStoreMode ? 'none' : '1px solid rgba(99,102,241,0.3)',
        }}
      >
        {toggling && <Loader2 size={14} className="animate-spin" />}
        {isStoreMode ? 'تبدیل به سایت شرکتی' : 'تبدیل به سایت فروشگاهی'}
      </button>
    </div>
  );
}