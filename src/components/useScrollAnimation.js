import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation — reveals an element when it scrolls into view.
 *
 * Includes a safety fallback: if the IntersectionObserver hasn't fired
 * within 2.5 s (e.g. the element is in a transformed/overflow container
 * that confuses the observer, or the threshold is too high for a very
 * tall element), the element is forced visible so content is never
 * permanently hidden.
 */
export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the element is already in the viewport on mount, show immediately.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fired = true;
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px 80px 0px' }
    );

    observer.observe(el);

    // Safety fallback — never leave content permanently invisible.
    const fallback = setTimeout(() => {
      if (!fired) {
        setVisible(true);
        observer.disconnect();
      }
    }, 2500);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}
