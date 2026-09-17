import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, Edit2, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

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

  const mockOrders = [
    { id: 'HG-1042', date: '۱۴۰۳/۰۶/۲۵', status: 'تحویل شده', statusColor: '#22c55e', total: '۴۵۰٬۰۰۰', items: 3 },
    { id: 'HG-1038', date: '۱۴۰۳/۰۶/۱۰', status: 'در حال ارسال', statusColor: 'var(--accent)', total: '۸۹۰٬۰۰۰', items: 5 },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '5rem' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="flex flex-col items-center text-center mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
                      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 font-body text-xs px-3 py-2 rounded-full transition-all hover:scale-105" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--accent)' }}>
                        <Edit2 size={12} /> ویرایش
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 font-body text-xs px-3 py-2 rounded-full transition-all hover:scale-105" style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}>
                          <Check size={12} /> {saving ? '...' : 'ذخیره'}
                        </button>
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 font-body text-xs px-3 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--fg-muted)' }}>
                          <X size={12} /> انصراف
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
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--fg)', opacity: editing ? 1 : 0.7 }}
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs block mb-2" style={{ color: 'var(--fg-muted)' }}>ایمیل</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none opacity-50"
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--fg)' }}
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
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--fg)', opacity: editing ? 1 : 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-heading text-lg font-black mb-6" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>تاریخچه سفارش‌ها</h2>
                  <div className="flex flex-col gap-3">
                    {mockOrders.map(order => (
                      <div key={order.id} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>سفارش #{order.id}</span>
                            <span className="font-body text-xs ms-3" style={{ color: 'var(--fg-muted)' }}>{order.date}</span>
                          </div>
                          <span className="font-body text-xs px-3 py-1 rounded-full" style={{
                            background: order.status === 'تحویل شده' ? 'rgba(34,197,94,0.1)' : 'rgba(212,175,55,0.1)',
                            color: order.statusColor,
                            border: `1px solid ${order.status === 'تحویل شده' ? 'rgba(34,197,94,0.2)' : 'rgba(212,175,55,0.2)'}`,
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{order.items} کالا</span>
                          <span className="font-heading font-black text-sm" style={{ color: 'var(--accent)', fontFamily: 'Peyda, serif' }}>{order.total} تومان</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-heading text-lg font-black mb-6" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>آدرس‌های من</h2>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
    </div>
  );
}