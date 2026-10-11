import { useEffect, useState } from 'react';
import LogoLoader from './LogoLoader';

// Never trap the visitor behind the splash, however slow the network is.
const SAFETY_MS = 8000;
// The page must stay "loaded" this long before the splash fades — this absorbs
// late-rendering route content whose images mount a moment after first paint.
const SETTLE_MS = 900;
const POLL_MS = 150;

/** True once the document, its fonts and every on-screen image are done. */
function isFullyLoaded() {
  if (document.readyState !== 'complete') return false;
  if (document.fonts && document.fonts.status !== 'loaded') return false;

  // Only the images the visitor can actually see gate the splash: lazy ones
  // load on scroll, and hidden/unlaid ones (0×0) must never block it.
  const vh = window.innerHeight;
  return !Array.from(document.images).some((img) => {
    if (img.complete || img.loading === 'lazy') return false;
    if (!img.offsetWidth && !img.offsetHeight) return false;
    const rect = img.getBoundingClientRect();
    return rect.top < vh && rect.bottom > 0;
  });
}

/**
 * SiteLoader — the full-screen splash that owns the top layer while the site
 * first paints. It sits above the header, tab bar and floating buttons and only
 * fades away once everything on the page has finished loading. A safety timeout
 * guarantees it can never get stuck on screen.
 */
export default function SiteLoader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    let cleanSince = 0;
    let timer;

    const poll = () => {
      const now = Date.now();
      if (now - startedAt > SAFETY_MS) {
        setDone(true);
        return;
      }
      if (isFullyLoaded()) {
        if (!cleanSince) cleanSince = now;
        if (now - cleanSince >= SETTLE_MS) {
          setDone(true);
          return;
        }
      } else {
        cleanSince = 0;
      }
      timer = setTimeout(poll, POLL_MS);
    };

    poll();
    return () => clearTimeout(timer);
  }, []);

  // Unmount after the fade so the logo dots stop animating.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setHidden(true), 600);
    return () => clearTimeout(t);
  }, [done]);

  if (hidden) return null;

  return (
    <div className={`site-loader${done ? ' is-done' : ''}`} aria-hidden="true">
      <LogoLoader />
    </div>
  );
}
