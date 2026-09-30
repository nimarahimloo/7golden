import React from 'react';

export default class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err, info) {
    console.error('Admin crash', err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="p-6 rounded-2xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }} dir="rtl">
          <p className="font-bold mb-2">خطا در پنل — صفحه سیاه نمی‌ماند</p>
          <pre className="text-xs whitespace-pre-wrap mb-3">{String(this.state.err?.message || this.state.err)}</pre>
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-white"
            style={{ background: 'var(--accent)' }}
            onClick={() => this.setState({ err: null })}
          >
            تلاش مجدد
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
