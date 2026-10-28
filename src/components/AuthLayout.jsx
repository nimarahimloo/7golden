import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" dir="rtl" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-symbol.webp"
            alt="7Golden"
            className="h-14 w-auto object-contain mx-auto mb-6"
          />
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.25)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <Icon className="w-7 h-7" style={{ color: 'var(--accent)' }} aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-black" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>{title}</h1>
          {subtitle && <p className="font-body text-sm mt-2" style={{ color: 'var(--fg-muted)' }}>{subtitle}</p>}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--hairline)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {children}
        </div>

        {footer && (
          <p className="text-center font-body text-sm mt-6" style={{ color: 'var(--fg-muted)' }}>{footer}</p>
        )}
      </div>
    </div>
  );
}