import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, Edit2, Check, X, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BackButton from '@/components/BackButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import PullToRefresh from '@/components/PullToRefresh';
import { useApp } from '@/lib/AppContext';
import { getOrders } from '@/lib/api/content';

export default function Account() {
  const { dir } = useApp();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (typeof base44.auth.deleteAccount === 'function') {
        await base44.auth.deleteAccount();
      } else if (user?.id && typeof base44.users?.deleteUser === 'function') {
        await base44.users.deleteUser(user.id);
      } else {
        throw new Error('No account deletion method available');
      }
      toast({ title: 'حساب کاربری حذف شد', description: 'حساب شما با موفقیت حذف شد.' });
      setDeleteDialogOpen(false);
      await base44.auth.logout('/');
    } catch (e) {
      toast({ title: 'خطا در حذف حساب', description: e?.message || 'حذف حساب ناموفق بود. دوباره تلاش کنید.', variant: 'destructive' });
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const loadUser = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      setProfile({ full_name: me.full_name || '', phone: me.phone || '' });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const items = await getOrders();
      setOrders(items);
    } catch (e) {
      console.error(e);
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      loadOrders();
    }
  }, [activeTab, user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ phone: profile.phone });
      await loadUser();
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await base44.auth.logout('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'اطلاعات شخصی', icon: User },
    { id: 'orders', label: 'سفارش‌های من', icon: Package },
    { id: 'addresses', label: 'آدرس‌ها', icon: MapPin },
    { id: 'favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  ];

  const statusMap = {
    pending: { label: 'در انتظار', color: 'var(--accent)' },
    processing: { label: 'در حال پردازش', color: 'var(--accent)' },
    shipped: { label: 'در حال ارسال', color: 'var(--accent)' },
    delivered: { label: 'تحویل شده', color: '#22c55e' },
    cancelled: { label: 'لغو شده', color: '#ef4444' },
  };

  return (
    <div dir={dir} style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '5rem' }}>
      <PullToRefresh onRefresh={loadUser}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <BackButton to="/" />
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-black mb-2" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
            پنل کاربری
          </h1>
          <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
            خوش آمدید، {user?.full_name || user?.email || 'کاربر گرامی'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-5 liquid-glass-strong">
              <div className="flex flex-col items-center text-center mb-6 pb-6" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <User size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                  {user?.full_name || 'کاربر'}
                </p>
                <p className="font-body text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>{user?.email}</p>
              </div>

              <div className="flex flex-col gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all text-right"
                    style={{
                      background: activeTab === tab.id ? 'rgba(212,175,55,0.12)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--accent)' : 'var(--fg-muted)',
                      border: activeTab === tab.id ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
                    }}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all text-right mt-2"
                  style={{ color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
                >
                  <LogOut size={16} />
                  خروج از حساب
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl p-6 md:p-8 liquid-glass-strong">
              {/* Profile */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-lg font-black" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>اطلاعات شخصی</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 font-body text-sm px-4 py-2.5 rounded-full transition-all hover:scale-105" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--accent)', minHeight: '44px' }}>
                        <Edit2 size={14} /> ویرایش
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 font-body text-sm px-4 py-2.5 rounded-full transition-all hover:scale-105" style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', minHeight: '44px' }}>
                          <Check size={14} /> {saving ? '...' : 'ذخیره'}
                        </button>
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 font-body text-sm px-4 py-2.5 rounded-full" style={{ background: 'var(--surface-subtle)', color: 'var(--fg-muted)', minHeight: '44px' }}>
                          <X size={14} /> انصراف
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs block mb-2" style={{ color: 'var(--fg-muted)' }}>نام و نام خانوادگی</label>
                      <input
                        type="text"
                        value={editing ? profile.full_name : (user?.full_name || '')}
                        onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                        disabled={!editing}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                        style={{ background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', color: 'var(--fg)', opacity: editing ? 1 : 0.7 }}
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs block mb-2" style={{ color: 'var(--fg-muted)' }}>ایمیل</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none opacity-50"
                        style={{ background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', color: 'var(--fg)' }}
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs block mb-2" style={{ color: 'var(--fg-muted)' }}>شماره موبایل</label>
                      <input
                        type="tel"
                        value={editing ? profile.phone : (user?.phone || '')}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        disabled={!editing}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all"
                        style={{ background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', color: 'var(--fg)', opacity: editing ? 1 : 0.7 }}
                      />
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(239,68,68,0.15)' }}>
                  <h3 className="font-heading font-black text-sm mb-2" style={{ color: '#ef4444', fontFamily: 'Peyda, serif' }}>
                   منطقه خطر
                  </h3>
                  <p className="font-body text-sm mb-4 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                   با حذف حساب کاربری، تمام اطلاعات شما شامل سفارش‌ها، پروفایل و داده‌ها به‌طور دائمی حذف خواهد شد. این عملیات قابل بازگشت نیست.
                  </p>
                  <button
                   onClick={() => setDeleteDialogOpen(true)}
                   className="flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-semibold transition-all hover:scale-105"
                   style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', minHeight: '44px' }}
                  >
                   <Trash2 size={16} />
                   حذف حساب کاربری
                  </button>
                  </div>
                  </div>
                  )}

                  {/* Orders */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-heading text-lg font-black mb-6" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>تاریخچه سفارش‌ها</h2>
                  <div className="flex flex-col gap-3">
                    {ordersLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: 'var(--accent)' }} />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>هنوز سفارشی ثبت نشده است</p>
                      </div>
                    ) : (
                      orders.map(order => {
                        const status = statusMap[order.status] || statusMap.pending;
                        const itemCount = (order.items || []).reduce((sum, i) => sum + (i.qty || 1), 0);
                        const date = new Date(order.created_date).toLocaleDateString('fa-IR');
                        const total = Number(order.grand_total || 0).toLocaleString('fa-IR');
                        return (
                          <div key={order.id} className="p-4 rounded-2xl" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--surface-border)' }}>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>سفارش #{order.order_number}</span>
                                <span className="font-body text-sm ms-3" style={{ color: 'var(--fg-muted)' }}>{date}</span>
                              </div>
                              <span className="font-body text-sm px-3 py-1 rounded-full" style={{
                                background: status.color === '#22c55e' ? 'rgba(34,197,94,0.1)' : status.color === '#ef4444' ? 'rgba(239,68,68,0.1)' : 'rgba(212,175,55,0.1)',
                                color: status.color,
                                border: `1px solid ${status.color === '#22c55e' ? 'rgba(34,197,94,0.2)' : status.color === '#ef4444' ? 'rgba(239,68,68,0.2)' : 'rgba(212,175,55,0.2)'}`,
                              }}>
                                {status.label}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{itemCount} کالا</span>
                              <span className="font-heading font-black text-sm" style={{ color: 'var(--accent)', fontFamily: 'Peyda, serif' }}>{total} تومان</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-heading text-lg font-black mb-6" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>آدرس‌های من</h2>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--surface-border)' }}>
                      <MapPin size={28} style={{ color: 'var(--fg-muted)' }} />
                    </div>
                    <p className="font-body text-sm mb-4" style={{ color: 'var(--fg-muted)' }}>هنوز آدرسی ثبت نشده است</p>
                    <button className="px-6 py-2.5 rounded-full font-body text-sm transition-all hover:scale-105" style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}>افزودن آدرس</button>
                  </div>
                </div>
              )}

              {/* Favorites */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="font-heading text-lg font-black mb-6" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>علاقه‌مندی‌ها</h2>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--surface-border)' }}>
                      <Heart size={28} style={{ color: 'var(--fg-muted)' }} />
                    </div>
                    <p className="font-body text-sm mb-4" style={{ color: 'var(--fg-muted)' }}>لیست علاقه‌مندی‌های شما خالی است</p>
                    <Link to="/shop" className="inline-block px-6 py-2.5 rounded-full font-body text-sm transition-all hover:scale-105" style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}>مشاهده محصولات</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </PullToRefresh>

      {/* Delete Account Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading" style={{ fontFamily: 'Peyda, serif' }}>
              حذف حساب کاربری
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm leading-relaxed">
              آیا مطمئن هستید؟ با این عمل، تمام سفارش‌ها، پروفایل و داده‌های شما به‌طور دائمی حذف خواهد شد. این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="font-body">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="font-body"
              style={{ background: '#ef4444', color: '#fff' }}
            >
              {deleting ? 'در حال حذف...' : 'بله، حذف کن'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}