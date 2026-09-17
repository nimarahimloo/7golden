import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Tags, FileText, Image as ImageIcon, Settings, Mail,
  LayoutDashboard, Home, LogOut, Loader2, Award
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import EntityCrud from '@/components/admin/EntityCrud';
import SiteModeToggle from '@/components/admin/SiteModeToggle';
import LogoLoader from '@/components/LogoLoader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SECTIONS = [
  { id: 'products', label: 'محصولات', labelEN: 'Products', icon: Package },
  { id: 'categories', label: 'دسته‌بندی', labelEN: 'Categories', icon: Tags },
  { id: 'gallery', label: 'گالری', labelEN: 'Gallery', icon: ImageIcon },
  { id: 'blog', label: 'مجله', labelEN: 'Blog Posts', icon: FileText },
  { id: 'awards', label: 'مجوزها و جوایز', labelEN: 'Awards', icon: Award },
  { id: 'messages', label: 'پیام‌ها', labelEN: 'Messages', icon: Mail },
  { id: 'settings', label: 'تنظیمات', labelEN: 'Settings', icon: Settings },
];

export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const [active, setActive] = useState('products');
  const navigate = useNavigate();

  if (isLoadingAuth) {
    return <LogoLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }} dir="rtl">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,175,55,0.1)' }}>
            <LayoutDashboard size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="font-heading font-extrabold text-xl mb-2" style={{ color: 'var(--fg)' }}>
            ورود به پنل مدیریت
          </h1>
          <p className="font-body text-sm mb-5" style={{ color: 'var(--fg-muted)' }}>
            برای دسترسی به پنل ادمین ابتدا وارد حساب کاربری خود شوید
          </p>
          <Link to="/login" className="inline-block px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all hover:scale-105" style={{ background: 'var(--accent)', color: '#fff' }}>
            ورود
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }} dir="rtl">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <LayoutDashboard size={28} style={{ color: '#ef4444' }} />
          </div>
          <h1 className="font-heading font-extrabold text-xl mb-2" style={{ color: 'var(--fg)' }}>
            دسترسی محدود
          </h1>
          <p className="font-body text-sm mb-5" style={{ color: 'var(--fg-muted)' }}>
            شما دسترسی ادمین ندارید. برای مدیریت سایت با مدیر سایت تماس بگیرید.
          </p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all hover:scale-105" style={{ background: 'var(--bg-secondary)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
            بازگشت به سایت
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }} dir="rtl">
      <AdminShell
        active={active}
        setActive={setActive}
        user={user}
        onLogout={() => { navigate('/'); }}
      >
        {active === 'products' && <ProductsSection />}
        {active === 'categories' && <CategoriesSection />}
        {active === 'gallery' && <GallerySection />}
        {active === 'blog' && <BlogSection />}
        {active === 'awards' && <AwardsAdminSection />}
        {active === 'messages' && <MessagesSection />}
        {active === 'settings' && <SettingsSection />}
      </AdminShell>
    </div>
  );
}

function AdminShell({ active, setActive, user, onLogout, children }) {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen flex-shrink-0" style={{ background: 'hsl(var(--card))', borderBottom: '1px solid var(--border)' }}>
        <div className="lg:hidden border-b p-3" style={{ borderColor: 'var(--border)' }}>
          <Select value={active} onValueChange={setActive}>
            <SelectTrigger className="w-full admin-input cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTIONS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block p-4">
          <div className="flex items-center gap-2.5 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <LayoutDashboard size={20} color="#fff" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm" style={{ color: 'var(--fg)' }}>پنل مدیریت</div>
              <div className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>7Golden Admin</div>
            </div>
          </div>

          <nav className="space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all"
                style={{
                  background: active === s.id ? 'var(--accent)' : 'transparent',
                  color: active === s.id ? '#fff' : 'var(--fg)',
                  fontWeight: active === s.id ? 600 : 400,
                }}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-4 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
            <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all" style={{ color: 'var(--fg-muted)' }}>
              <Home size={16} />
              مشاهده سایت
            </Link>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all" style={{ color: '#ef4444' }}>
              <LogOut size={16} />
              خروج
            </button>
          </div>

          <div className="mt-6 px-3">
            <div className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>
              {user?.email}
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <SiteModeToggle />
          <div className="mb-6">
            <h1 className="font-heading font-extrabold text-xl md:text-2xl mb-1" style={{ color: 'var(--fg)' }}>
              {SECTIONS.find(s => s.id === active)?.label}
            </h1>
            <p className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
              مدیریت {SECTIONS.find(s => s.id === active)?.labelEN}
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

/* ===== Section configs ===== */

function ProductsSection() {
  return (
    <EntityCrud
      entityName="Product"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '—' },
        { key: 'name_fa', label: 'نام' },
        { key: 'category', label: 'دسته' },
        { key: 'price_display', label: 'قیمت' },
        { key: 'in_stock', label: 'موجود', render: r => r.in_stock !== false ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>✗</span> },
        { key: 'featured', label: 'ویژه', render: r => r.featured ? <span style={{ color: 'var(--accent)' }}>★</span> : '—' },
        { key: 'published', label: 'منتشر', render: r => r.published !== false ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>✗</span> },
      ]}
      fields={[
        { key: 'slug', label: 'شناسه URL (slug)', placeholder: 'hazelnut-paste' },
        { key: 'name_fa', label: 'نام (فارسی)' },
        { key: 'name_en', label: 'نام (انگلیسی)' },
        { key: 'desc_fa', label: 'توضیحات (فارسی)', type: 'textarea' },
        { key: 'desc_en', label: 'توضیحات (انگلیسی)', type: 'textarea' },
        { key: 'category', label: 'دسته (slug)', placeholder: 'hazelnut' },
        { key: 'origin_fa', label: 'خاستگاه (فارسی)' },
        { key: 'origin_en', label: 'خاستگاه (انگلیسی)' },
        { key: 'price', label: 'قیمت (عدد)', type: 'number' },
        { key: 'price_display', label: 'قیمت (نمایش)', placeholder: '۸۵۰٬۰۰۰ تومان' },
        { key: 'image', label: 'تصویر اصلی', type: 'image' },
        { key: 'badge', label: 'برچسب (فارسی)' },
        { key: 'badge_en', label: 'برچسب (انگلیسی)' },
        { key: 'in_stock', label: 'موجود در انبار', type: 'boolean', default: true },
        { key: 'featured', label: 'محصول ویژه', type: 'boolean', default: false },
        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },
        { key: 'sort_order', label: 'ترتیب نمایش', type: 'number', default: 0 },
      ]}
    />
  );
}

function CategoriesSection() {
  return (
    <EntityCrud
      entityName="Category"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '—' },
        { key: 'name_fa', label: 'نام' },
        { key: 'slug', label: 'شناسه' },
      ]}
      fields={[
        { key: 'slug', label: 'شناسه (slug)', placeholder: 'hazelnut' },
        { key: 'name_fa', label: 'نام (فارسی)' },
        { key: 'name_en', label: 'نام (انگلیسی)' },
        { key: 'desc_fa', label: 'توضیحات (فارسی)', type: 'textarea' },
        { key: 'desc_en', label: 'توضیحات (انگلیسی)', type: 'textarea' },
        { key: 'image', label: 'تصویر', type: 'image' },
        { key: 'sort_order', label: 'ترتیب نمایش', type: 'number', default: 0 },
      ]}
    />
  );
}

function GallerySection() {
  return (
    <EntityCrud
      entityName="GalleryImage"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-12 rounded-lg object-cover" /> : '—' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'span', label: 'اندازه', render: r => ({ tall: 'بلند', wide: 'عریض', normal: 'معمولی' }[r.span] || 'معمولی') },
        { key: 'published', label: 'منتشر', render: r => r.published !== false ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>✗</span> },
      ]}
      fields={[
        { key: 'title_fa', label: 'عنوان (فارسی)' },
        { key: 'title_en', label: 'عنوان (انگلیسی)' },
        { key: 'desc_fa', label: 'توضیحات (فارسی)', type: 'textarea' },
        { key: 'desc_en', label: 'توضیحات (انگلیسی)', type: 'textarea' },
        { key: 'image', label: 'تصویر', type: 'image' },
        { key: 'span', label: 'اندازه نمایش', type: 'select', options: [
          { value: 'normal', label: 'معمولی' },
          { value: 'tall', label: 'بلند' },
          { value: 'wide', label: 'عریض' },
        ], default: 'normal' },
        { key: 'sort_order', label: 'ترتیب نمایش', type: 'number', default: 0 },
        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },
      ]}
    />
  );
}

function BlogSection() {
  return (
    <EntityCrud
      entityName="BlogPost"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '—' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'category', label: 'دسته' },
        { key: 'published', label: 'منتشر', render: r => r.published ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>✗</span> },
      ]}
      fields={[
        { key: 'slug', label: 'شناسه (slug)' },
        { key: 'title_fa', label: 'عنوان (فارسی)' },
        { key: 'title_en', label: 'عنوان (انگلیسی)' },
        { key: 'excerpt_fa', label: 'خلاصه (فارسی)', type: 'textarea' },
        { key: 'excerpt_en', label: 'خلاصه (انگلیسی)', type: 'textarea' },
        { key: 'content', label: 'محتوا', type: 'textarea', rows: 8 },
        { key: 'category', label: 'دسته' },
        { key: 'date_fa', label: 'تاریخ (فارسی)' },
        { key: 'date_en', label: 'تاریخ (انگلیسی)' },
        { key: 'image', label: 'تصویر', type: 'image' },
        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },
        { key: 'sort_order', label: 'ترتیب', type: 'number', default: 0 },
      ]}
    />
  );
}

function AwardsAdminSection() {
  return (
    <EntityCrud
      entityName="Award"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-12 rounded-lg object-cover" /> : '—' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'published', label: 'منتشر', render: r => r.published !== false ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>✗</span> },
      ]}
      fields={[
        { key: 'title_fa', label: 'عنوان (فارسی)' },
        { key: 'title_en', label: 'عنوان (انگلیسی)' },
        { key: 'desc_fa', label: 'توضیحات (فارسی)', type: 'textarea' },
        { key: 'desc_en', label: 'توضیحات (انگلیسی)', type: 'textarea' },
        { key: 'image', label: 'تصویر', type: 'image' },
        { key: 'sort_order', label: 'ترتیب نمایش', type: 'number', default: 0 },
        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },
      ]}
    />
  );
}

function MessagesSection() {
  return (
    <EntityCrud
      entityName="ContactMessage"
      columns={[
        { key: 'name', label: 'نام' },
        { key: 'phone', label: 'تلفن' },
        { key: 'email', label: 'ایمیل' },
        { key: 'message', label: 'پیام', render: r => <span className="line-clamp-1">{r.message}</span> },
        { key: 'status', label: 'وضعیت', render: r => {
          const map = { new: 'جدید', read: 'خوانده شده', replied: 'پاسخ داده شده' };
          return <span style={{ color: r.status === 'new' ? 'var(--accent)' : 'var(--fg-muted)' }}>{map[r.status] || r.status}</span>;
        } },
      ]}
      fields={[
        { key: 'name', label: 'نام' },
        { key: 'phone', label: 'تلفن' },
        { key: 'email', label: 'ایمیل' },
        { key: 'message', label: 'پیام', type: 'textarea' },
        { key: 'status', label: 'وضعیت', type: 'select', options: [
          { value: 'new', label: 'جدید' },
          { value: 'read', label: 'خوانده شده' },
          { value: 'replied', label: 'پاسخ داده شده' },
        ] },
      ]}
    />
  );
}

function SettingsSection() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    (async () => {
      try {
        const items = await import('@/api/base44Client').then(m => m.base44.entities.SiteSettings.list());
        setSettings(items[0] || {});
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { base44 } = await import('@/api/base44Client');
    try {
      if (settings.id) {
        const { id, created_date, updated_date, created_by_id, ...rest } = settings;
        await base44.entities.SiteSettings.update(id, rest);
      } else {
        await base44.entities.SiteSettings.create(settings);
      }
      alert('تنظیمات ذخیره شد');
    } catch (e) {
      alert('خطا در ذخیره: ' + (e.message || 'نامشخص'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>;
  }

  const setField = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
      <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
        <h3 className="font-heading font-extrabold text-sm mb-4" style={{ color: 'var(--fg)' }}>اطلاعات سایت</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">نام سایت (فارسی)</label>
            <input className="admin-input" value={settings.site_name_fa || ''} onChange={e => setField('site_name_fa', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">نام سایت (انگلیسی)</label>
            <input className="admin-input" value={settings.site_name_en || ''} onChange={e => setField('site_name_en', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
        <h3 className="font-heading font-extrabold text-sm mb-4" style={{ color: 'var(--fg)' }}>اطلاعات تماس</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">تلفن ثابت</label>
            <input className="admin-input" value={settings.contact_phone || ''} onChange={e => setField('contact_phone', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">موبایل</label>
            <input className="admin-input" value={settings.contact_mobile || ''} onChange={e => setField('contact_mobile', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">ایمیل</label>
            <input className="admin-input" value={settings.contact_email || ''} onChange={e => setField('contact_email', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">ساعات کاری (فارسی)</label>
            <input className="admin-input" value={settings.working_hours_fa || ''} onChange={e => setField('working_hours_fa', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
        <h3 className="font-heading font-extrabold text-sm mb-4" style={{ color: 'var(--fg)' }}>نشانی</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="admin-label">نشانی دفتر مرکزی (فارسی)</label>
            <textarea className="admin-input" rows={2} value={settings.hq_address_fa || ''} onChange={e => setField('hq_address_fa', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">نشانی دفتر تهران (فارسی)</label>
            <textarea className="admin-input" rows={2} value={settings.tehran_address_fa || ''} onChange={e => setField('tehran_address_fa', e.target.value)} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50 magnetic-btn"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16} />}
        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </form>
  );
}