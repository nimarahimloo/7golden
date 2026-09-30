import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Tags, FileText, Image as ImageIcon, Settings, Mail,
  LayoutDashboard, Home, LogOut, Loader2, Award, MessageSquareQuote,
  ShoppingBag, BarChart3
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import EntityCrud from '@/components/admin/EntityCrud';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';
import SiteModeToggle from '@/components/admin/SiteModeToggle';
import LogoLoader from '@/components/LogoLoader';
import { base44 } from '@/api/base44Client';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const SECTIONS = [
  { id: 'dashboard', label: 'داشبورد', icon: BarChart3 },
  { id: 'products', label: 'محصولات', icon: Package },
  { id: 'categories', label: 'دسته‌بندی', icon: Tags },
  { id: 'gallery', label: 'گالری', icon: ImageIcon },
  { id: 'blog', label: 'مجله / بلاگ', icon: FileText },
  { id: 'awards', label: 'مجوزها و جوایز', icon: Award },
  { id: 'testimonials', label: 'نظرات مشتریان', icon: MessageSquareQuote },
  { id: 'orders', label: 'سفارش‌ها', icon: ShoppingBag },
  { id: 'messages', label: 'پیام‌های تماس', icon: Mail },
  { id: 'settings', label: 'تنظیمات سایت', icon: Settings },
  { id: 'users', label: 'کاربران', icon: Settings },
  { id: 'security', label: 'امنیت / رمز', icon: Settings },
];

export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();
  const [active, setActive] = useState('dashboard');
  const navigate = useNavigate();

  if (isLoadingAuth) return <LogoLoader />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }} dir="rtl">
        <div className="text-center max-w-sm">
          <h1 className="font-heading font-extrabold text-xl mb-2" style={{ color: 'var(--fg)' }}>ورود به پنل مدیریت</h1>
          <p className="font-body text-sm mb-5" style={{ color: 'var(--fg-muted)' }}>برای دسترسی وارد حساب ادمین شوید</p>
          <Link to="/login" className="inline-block px-6 py-3 rounded-xl font-body font-semibold text-sm" style={{ background: 'var(--accent)', color: '#fff' }}>ورود</Link>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
        <div className="text-center">
          <p className="mb-4">دسترسی فقط برای مدیر سیستم</p>
          <Link to="/" className="underline">بازگشت به سایت</Link>
        </div>
      </div>
    );
  }

  const onLogout = () => { logout(true); navigate('/'); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }} dir="rtl">
      <AdminShell active={active} setActive={setActive} user={user} onLogout={onLogout}>
        {active === 'dashboard' && <DashboardSection />}
        {active === 'products' && <ProductsSection />}
        {active === 'categories' && <CategoriesSection />}
        {active === 'gallery' && <GallerySection />}
        {active === 'blog' && <BlogSection />}
        {active === 'awards' && <AwardsAdminSection />}
        {active === 'testimonials' && <TestimonialsSection />}
        {active === 'orders' && <OrdersSection />}
        {active === 'messages' && <MessagesSection />}
        {active === 'settings' && <SettingsSection />}
        {active === 'users' && (
          <EntityCrud entityName="User" title="کاربر"
            columns={[
              { key: 'email', label: 'ایمیل' },
              { key: 'role', label: 'نقش' },
            ]}
            fields={[
              { key: 'email', label: 'ایمیل' },
              { key: 'role', label: 'نقش', type: 'select', options: [
                { value: 'user', label: 'کاربر' },
                { value: 'admin', label: 'ادمین' },
              ]},
            ]}
          />
        )}
        {active === 'security' && (
          <div className="max-w-md rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-2">رمز ادمین را از دیتابیس یا بعد از فعال‌سازی endpoint تغییر دهید.</p>
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>فعلی seed: admin@7golden.co — حتماً عوض شود.</p>
          </div>
        )}
      </AdminShell>
    </div>
  );
}

function AdminShell({ active, setActive, user, onLogout, children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <aside className="lg:w-64 flex-shrink-0" style={{ background: 'hsl(var(--card))', borderLeft: '1px solid var(--border)' }}>
        <div className="lg:hidden border-b p-3" style={{ borderColor: 'var(--border)' }}>
          <Select value={active} onValueChange={setActive}>
            <SelectTrigger className="w-full admin-input cursor-pointer"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SECTIONS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden lg:block p-4">
          <div className="flex items-center gap-2.5 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <LayoutDashboard size={20} color="#fff" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm" style={{ color: 'var(--fg)' }}>پنل مدیریت</div>
              <div className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <nav className="space-y-1">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all"
                style={{
                  background: active === s.id ? 'var(--accent)' : 'transparent',
                  color: active === s.id ? '#fff' : 'var(--fg)',
                  fontWeight: active === s.id ? 600 : 400,
                }}>
                <s.icon size={16} />{s.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-4 space-y-1" style={{ borderTop: '1px solid var(--border)' }}>
            <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
              <Home size={16} />مشاهده سایت
            </Link>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
              <LogOut size={16} />خروج
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading font-extrabold text-xl" style={{ color: 'var(--fg)' }}>
            {SECTIONS.find(s => s.id === active)?.label}
          </h1>
          <SiteModeToggle />
        </div>
        <AdminErrorBoundary key={active}>{children}</AdminErrorBoundary>
      </main>
    </div>
  );
}

function DashboardSection() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const [products, categories, blog, messages, orders] = await Promise.all([
          base44.entities.Product.list(undefined, 500).catch(() => []),
          base44.entities.Category.list(undefined, 200).catch(() => []),
          base44.entities.BlogPost.list(undefined, 200).catch(() => []),
          base44.entities.ContactMessage.list(undefined, 200).catch(() => []),
          base44.entities.Order.list(undefined, 200).catch(() => []),
        ]);
        setStats({
          products: products.length,
          categories: categories.length,
          blog: blog.length,
          messages: messages.filter(m => m.status === 'new').length,
          orders: orders.length,
        });
      } catch (e) {
        console.error(e);
        setStats({ products: 0, categories: 0, blog: 0, messages: 0, orders: 0 });
      }
    })();
  }, []);

  if (!stats) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin" style={{ color: 'var(--accent)' }} /></div>;
  }

  const cards = [
    { label: 'محصولات', value: stats.products, color: '#d4af37' },
    { label: 'دسته‌ها', value: stats.categories, color: '#22c55e' },
    { label: 'مطالب بلاگ', value: stats.blog, color: '#3b82f6' },
    { label: 'پیام جدید', value: stats.messages, color: '#ef4444' },
    { label: 'سفارش‌ها', value: stats.orders, color: '#a855f7' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(c => (
        <div key={c.label} className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
          <div className="text-3xl font-heading font-extrabold mb-1" style={{ color: c.color }}>{c.value}</div>
          <div className="text-sm font-body" style={{ color: 'var(--fg-muted)' }}>{c.label}</div>
        </div>
      ))}
      <div className="col-span-full rounded-2xl p-5 mt-2" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
        <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
          از منوی سمت راست هر بخش را مدیریت کنید. فیلدهای انگلیسی از پنل حذف شده‌اند؛ هنگام ذخیره از روی متن فارسی پر می‌شوند.
        </p>
      </div>
    </div>
  );
}

function ProductsSection() {
  const [catOptions, setCatOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { base44 } = await import('@/api/base44Client');
        const items = await base44.entities.Category.list('sort_order', 200);
        const list = Array.isArray(items) ? items : [];
        if (!cancelled) {
          setCatOptions(
            list.map((c) => ({
              value: c.slug,
              label: c.name_fa || c.slug,
            }))
          );
        }
      } catch (e) {
        console.error('load categories', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <EntityCrud
      entityName="Product"
      title="محصول"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" /> : '—' },
        { key: 'name_fa', label: 'عنوان' },
        { key: 'category', label: 'دسته', render: r => {
          const opt = catOptions.find(o => o.value === r.category);
          return opt ? opt.label : (r.category || '—');
        }},
        { key: 'gallery', label: 'گالری', render: r => {
          const g = Array.isArray(r.gallery) ? r.gallery : [];
          return `${g.length} تصویر`;
        }},
        { key: 'published', label: 'منتشر', toggleBool: true },
      ]}
      fields={[
        { key: 'slug', label: 'شناسه URL', placeholder: 'pistachio-akbari', required: true },
        { key: 'name_fa', label: 'عنوان محصول', required: true },
        {
          key: 'category',
          label: 'دسته‌بندی',
          type: 'select',
          required: true,
          options: catOptions.length
            ? catOptions
            : [{ value: '', label: 'ابتدا در بخش دسته‌ها یک دسته بسازید' }],
        },
        { key: 'origin_fa', label: 'خاستگاه (اختیاری)' },
        { key: 'desc_fa', label: 'توضیحات / محتوای محصول', type: 'richtext' },
        { key: 'image', label: 'تصویر اصلی (کاور)', type: 'image', required: true },
        { key: 'gallery', label: 'گالری تصاویر (تا ۲۰ عدد)', type: 'gallery', max: 20 },
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
        { key: 'slug', label: 'شناسه (slug)', placeholder: 'pistachio' },
        { key: 'name_fa', label: 'نام دسته' },
        { key: 'desc_fa', label: 'توضیحات', type: 'richtext' },
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
        { key: 'image', label: 'تصویر', render: r => r.image ? <img src={r.image} alt="" className="w-12 h-12 rounded-lg object-cover" /> : '—' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'sort_order', label: 'ترتیب' },
      ]}
      fields={[
        { key: 'title_fa', label: 'عنوان' },
        { key: 'image', label: 'تصویر', type: 'image' },
        { key: 'sort_order', label: 'ترتیب', type: 'number', default: 0 },
        { key: 'published', label: 'منتشر', type: 'boolean', default: true },
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
        { key: 'image', label: 'کاور', render: r => (r.image || r.cover) ? <img src={r.image || r.cover} alt="" className="w-12 h-10 rounded object-cover" /> : '—' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'slug', label: 'slug' },
        { key: 'published', label: 'منتشر', render: r => r.published !== false ? '✓' : '✗' },
      ]}
      fields={[
        { key: 'slug', label: 'شناسه URL', placeholder: 'export-quality' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'excerpt_fa', label: 'خلاصه', type: 'richtext' },
        { key: 'content', label: 'متن کامل', type: 'richtext' },
        { key: 'image', label: 'تصویر کاور', type: 'image', required: true },
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
      title="گواهی / جایزه"
      defaultSort="sort_order"
      columns={[
        {
          key: 'image',
          label: 'تصویر',
          render: (r) =>
            r.image ? (
              <img src={r.image} alt={r.title_fa || 'گواهی'} className="w-14 h-14 rounded-lg object-cover" />
            ) : (
              '—'
            ),
        },
        {
          key: 'title_fa',
          label: 'عنوان',
          render: (r) =>
            r.title_fa || (
              <span style={{ color: 'var(--fg-muted)' }}>فقط تصویر</span>
            ),
        },
        { key: 'published', label: 'منتشر', toggleBool: true },
        { key: 'sort_order', label: 'ترتیب' },
      ]}
      fields={[
        { key: 'image', label: 'تصویر گواهی / جایزه', type: 'image', required: true },
        { key: 'title_fa', label: 'عنوان (اختیاری — برای موارد غیرکاغذی)' },
        { key: 'desc_fa', label: 'توضیحات (اختیاری)', type: 'richtext' },
        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },
        { key: 'sort_order', label: 'ترتیب نمایش', type: 'number', default: 0 },
      ]}
    />
  );
}


function TestimonialsSection() {
  return (
    <EntityCrud
      entityName="Testimonial"
      defaultSort="sort_order"
      columns={[
        { key: 'name_fa', label: 'نام' },
        { key: 'role_fa', label: 'سمت' },
        { key: 'text_fa', label: 'نظر', render: r => <span className="line-clamp-1">{r.text_fa || r.content_fa}</span> },
        { key: 'published', label: 'منتشر', render: r => r.published !== false ? '✓' : '✗' },
      ]}
      fields={[
        { key: 'name_fa', label: 'نام مشتری' },
        { key: 'role_fa', label: 'سمت / شرکت' },
        { key: 'text_fa', label: 'متن نظر', type: 'richtext' },
        { key: 'avatar', label: 'آواتار', type: 'image' },
        { key: 'sort_order', label: 'ترتیب', type: 'number', default: 0 },
        { key: 'published', label: 'منتشر', type: 'boolean', default: true },
      ]}
    />
  );
}

function OrdersSection() {
  return (
    <EntityCrud
      entityName="Order"
      defaultSort="-createdAt"
      columns={[
        { key: 'id', label: 'شناسه', render: r => <span className="font-mono text-xs">{String(r.id).slice(-8)}</span> },
        { key: 'customer_name', label: 'مشتری', render: r => r.customer_name || r.name || '—' },
        { key: 'phone', label: 'تلفن' },
        { key: 'status', label: 'وضعیت' },
        { key: 'total', label: 'مبلغ', render: r => r.total ?? r.total_amount ?? '—' },
      ]}
      fields={[
        { key: 'customer_name', label: 'نام مشتری' },
        { key: 'phone', label: 'تلفن' },
        { key: 'email', label: 'ایمیل' },
        { key: 'address', label: 'آدرس', type: 'textarea' },
        { key: 'status', label: 'وضعیت', type: 'select', options: [
          { value: 'pending', label: 'در انتظار' },
          { value: 'confirmed', label: 'تأیید شده' },
          { value: 'shipped', label: 'ارسال شده' },
          { value: 'cancelled', label: 'لغو' },
        ] },
        { key: 'notes', label: 'یادداشت', type: 'textarea' },
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
          const map = { new: 'جدید', read: 'خوانده‌شده', replied: 'پاسخ‌داده‌شده' };
          return map[r.status] || r.status;
        } },
      ]}
      fields={[
        { key: 'name', label: 'نام' },
        { key: 'phone', label: 'تلفن' },
        { key: 'email', label: 'ایمیل' },
        { key: 'message', label: 'پیام', type: 'textarea' },
        { key: 'status', label: 'وضعیت', type: 'select', options: [
          { value: 'new', label: 'جدید' },
          { value: 'read', label: 'خوانده‌شده' },
          { value: 'replied', label: 'پاسخ‌داده‌شده' },
        ] },
      ]}
    />
  );
}

function SettingsSection() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const items = await base44.entities.SiteSettings.list();
        setSettings(items[0] || {
          site_mode: 'corporate',
          contact_phone: '', contact_email: '', contact_mobile: '', working_hours_fa: '', site_name_fa: '',
          hq_address_fa: '', tehran_address_fa: '',
        });
      } catch {
        setSettings({ site_mode: 'corporate' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setField = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, created_date, updated_date, ...rest } = settings;
      if (id) await base44.entities.SiteSettings.update(id, rest);
      else {
        const created = await base44.entities.SiteSettings.create(rest);
        setSettings(created);
      }
      alert('ذخیره شد');
    } catch (err) {
      alert('خطا: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader2 className="animate-spin mx-auto" />;

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-2xl p-5 space-y-4" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
        <h3 className="font-heading font-extrabold text-sm">تماس</h3>
        <div>
          <label className="admin-label">تلفن</label>
          <input className="admin-input w-full" value={settings.contact_phone || settings.contact_phone || ''} onChange={e => setField('contact_phone', e.target.value)} dir="ltr" />
        </div>
        <div>
          <label className="admin-label">ایمیل</label>
          <input className="admin-input w-full" value={settings.contact_email || settings.contact_email || ''} onChange={e => setField('contact_email', e.target.value)} dir="ltr" />
        </div>
        <div>
          <label className="admin-label">ساعات کاری</label>
          <input className="admin-input w-full" value={settings.working_hours_fa || ''} onChange={e => setField('working_hours_fa', e.target.value)} />
        </div>
      </div>
      <div className="rounded-2xl p-5 space-y-4" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
        <h3 className="font-heading font-extrabold text-sm">نشانی</h3>
        <div>
          <label className="admin-label">دفتر مرکزی</label>
          <textarea className="admin-input w-full" rows={2} value={settings.hq_address_fa || ''} onChange={e => setField('hq_address_fa', e.target.value)} />
        </div>
        <div>
          <label className="admin-label">دفتر تهران</label>
          <textarea className="admin-input w-full" rows={2} value={settings.tehran_address_fa || ''} onChange={e => setField('tehran_address_fa', e.target.value)} />
        </div>
      </div>
      <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: 'var(--accent)', color: '#fff' }}>
        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </form>
  );
}
