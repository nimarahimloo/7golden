import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Tags, FileText, Image as ImageIcon, Settings, Mail,
  LayoutDashboard, Home, LogOut, Loader2, Award, MessageSquareQuote,
  ShoppingBag, BarChart3, Users, KeyRound, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import EntityCrud from '@/components/admin/EntityCrud';
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
  { id: 'users', label: 'کاربران', icon: Users },
  { id: 'settings', label: 'تنظیمات سایت', icon: Settings },
  { id: 'security', label: 'امنیت / رمز', icon: KeyRound },
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
        {active === 'dashboard' && <DashboardSection go={setActive} />}
        {active === 'products' && <ProductsSection />}
        {active === 'categories' && <CategoriesSection />}
        {active === 'gallery' && <GallerySection />}
        {active === 'blog' && <BlogSection />}
        {active === 'awards' && <AwardsAdminSection />}
        {active === 'testimonials' && <TestimonialsSection />}
        {active === 'orders' && <OrdersSection />}
        {active === 'messages' && <MessagesSection />}
        {active === 'users' && <UsersSection />}
        {active === 'settings' && <SettingsSection />}
        {active === 'security' && <SecuritySection />}
      </AdminShell>
    </div>
  );
}
