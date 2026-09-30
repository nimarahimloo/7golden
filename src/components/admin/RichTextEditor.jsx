import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div dir="rtl" className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid var(--border)' }}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={(v) => onChange(v)}
        placeholder={placeholder || 'متن را وارد کنید…'}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
}
