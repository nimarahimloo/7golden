// @ts-ignore
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { UploadCloud, Trash2, Pencil, X, Plus, Loader2, Save } from 'lucide-react';

/**
 * Reusable entity CRUD table + form for the admin panel.
 *
 * Props:
 *  - entityName: e.g. "Product"
 *  - columns: [{ key, label, render? }]
 *  - fields:   [{ key, label, type: 'text'|'number'|'boolean'|'textarea'|'image'|'select', options?, default? }]
 *  - defaultSort: field name to sort by
 */
// @ts-ignore
export default function EntityCrud({ entityName, columns, fields, defaultSort }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // record or {} for new
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const items = defaultSort
        ? await base44.entities[entityName].list(defaultSort, 200)
        : await base44.entities[entityName].list();
      // @ts-ignore
      setRecords(items);
    } catch (e) {
      console.error(`Failed to load ${entityName}:`, e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // @ts-ignore
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (formData.id) {
        const { id, created_date, updated_date, created_by_id, ...rest } = formData;
        await base44.entities[entityName].update(id, rest);
      } else {
        const { id, ...rest } = formData;
        await base44.entities[entityName].create(rest);
      }
      setEditing(null);
      await load();
    } catch (e) {
      console.error(`Failed to save ${entityName}:`, e);
      // @ts-ignore
      alert('خطا در ذخیره: ' + (e.message || 'نامشخص'));
    } finally {
      setSaving(false);
    }
  };

  // @ts-ignore
  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این مورد مطمئن هستید؟')) return;
    try {
      await base44.entities[entityName].delete(id);
      await load();
    } catch (e) {
      console.error(`Failed to delete:`, e);
      // @ts-ignore
      alert('خطا در حذف: ' + (e.message || 'نامشخص'));
    }
  };

  // @ts-ignore
  const filtered = search
    ? records.filter(r =>
        // @ts-ignore
        columns.some(c => {
          const val = c.render ? c.render(r) : r[c.key];
          return String(val || '').toLowerCase().includes(search.toLowerCase());
        })
      )
    : records;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-input sm:w-64"
          />
          <span className="font-body text-sm font-semibold" style={{ color: 'var(--fg-muted)' }}>
            {filtered.length} مورد
          </span>
        </div>
        <button
          // @ts-ignore
          onClick={() => setEditing(buildEmpty(fields))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all hover:scale-105 magnetic-btn"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <Plus size={16} />
          افزودن جدید
        </button>
      </div>

      {/* Table — horizontal scroll on mobile */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'hsl(var(--card))' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map(
// @ts-ignore
                c => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th style={{ textAlign: 'center' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-12" style={{ color: 'var(--fg-muted)' }}>
                    موردی یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id}>
                    {columns.map(
// @ts-ignore
                    c => (
                      <td key={c.key}>
                        {c.render ? c.render(r) : (String(r[c.key] ?? '—'))}
                      </td>
                    ))}
                    <td>
                      <div className="flex items-center gap-1.5 justify-center">
                        <button
                          onClick={() => setEditing({ ...r })}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--accent)' }}
                          aria-label="ویرایش"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                          aria-label="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit drawer */}
      {editing && (
        <EditDrawer
          fields={fields}
          data={editing}
          // @ts-ignore
          isNew={!editing.id}
          saving={saving}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// @ts-ignore
function buildEmpty(fields) {
  const obj = {};
  // @ts-ignore
  fields.forEach(f => {
    // @ts-ignore
    if (f.type === 'boolean') obj[f.key] = f.default ?? false;
    // @ts-ignore
    else if (f.type === 'number') obj[f.key] = f.default ?? 0;
    // @ts-ignore
    else if (f.type === 'select') obj[f.key] = f.default ?? '';
    // @ts-ignore
    else if (f.type === 'array') obj[f.key] = f.default ?? [];
    // @ts-ignore
    else obj[f.key] = f.default ?? '';
  });
  return obj;
}

// @ts-ignore
function EditDrawer({ fields, data, isNew, saving, onSave, onClose }) {
  const [form, setForm] = useState({ ...data });

  // @ts-ignore
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  // @ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[150] flex" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-full max-w-lg overflow-y-auto" style={{ background: 'var(--bg)', boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 z-10" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-heading font-extrabold text-base" style={{ color: 'var(--fg)' }}>
            {isNew ? 'افزودن مورد جدید' : 'ویرایش'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)', color: 'var(--fg)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {fields.map(
// @ts-ignore
          field => (
            // @ts-ignore
            <FieldRenderer key={field.key} field={field} value={form[field.key]} onChange={v => setField(field.key, v)} />
          ))}

          <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all"
              style={{ background: 'var(--bg-secondary)', color: 'var(--fg)', border: '1px solid var(--border)' }}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// @ts-ignore
function FieldRenderer({ field, value, onChange }) {
  if (field.type === 'image') {
    return <ImageUploadField field={field} value={value} onChange={onChange} />;
  }
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="admin-label">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={field.rows || 4}
          className="admin-input resize-y"
          style={{ minHeight: '80px' }}
        />
      </div>
    );
  }
  if (field.type === 'boolean') {
    return (
      <div className="flex items-center gap-2.5 py-1">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="relative w-11 h-6 rounded-full transition-all"
          style={{ background: value ? 'var(--accent)' : 'var(--bg-secondary)' }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
            style={{ left: value ? 'calc(100% - 1.375rem)' : '0.125rem' }}
          />
        </button>
        <span className="font-body text-sm" style={{ color: 'var(--fg)' }}>{field.label}</span>
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <div>
        <label className="admin-label">{field.label}</label>
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="admin-input cursor-pointer"
        >
          <option value="">— انتخاب —</option>
          {field.options?.map(
// @ts-ignore
          opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }
  if (field.type === 'number') {
    return (
      <div>
        <label className="admin-label">{field.label}</label>
        <input
          type="number"
          value={value ?? 0}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="admin-input"
        />
      </div>
    );
  }
  return (
    <div>
      <label className="admin-label">{field.label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="admin-input"
        placeholder={field.placeholder || ''}
      />
    </div>
  );
}

// @ts-ignore
function ImageUploadField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  // @ts-ignore
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="admin-label">{field.label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-xs font-semibold cursor-pointer transition-all hover:scale-105" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--fg)' }}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {uploading ? 'در حال آپلود...' : 'انتخاب تصویر'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="admin-input mt-2"
        placeholder="یا URL تصویر را وارد کنید"
      />
    </div>
  );
}