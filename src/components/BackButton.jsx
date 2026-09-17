import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function BackButton({ to, fallback = '/', className = '' }) {
  const navigate = useNavigate();
  const isFA = true;
  const isRTL = true;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (to) {
      navigate(to);
    } else {
      navigate(fallback);
    }
  };

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 font-body text-sm font-semibold transition-all hover:gap-2.5 px-3 py-2.5 ${className}`}
      style={{ color: 'var(--fg-muted)', minHeight: '44px', minWidth: '44px' }}
      aria-label={isFA ? 'بازگشت' : 'Back'}
    >
      <BackIcon size={18} />
      {isFA ? 'بازگشت' : 'Back'}
    </button>
  );
}