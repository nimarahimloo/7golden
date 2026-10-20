import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div dir="rtl" className="admin-richtext-editor rounded-xl overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={(nextValue) => onChange(nextValue)}
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
