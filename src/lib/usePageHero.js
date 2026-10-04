import { useState, useEffect } from 'react';
import { getPageHero } from '@/lib/api/content';

/**
 * Fetches the hero section config for a page from the API.
 * Falls back to the provided defaults if no DB record exists.
 *
 * @param {string} pageKey - e.g. 'home', 'about', 'shop'
 * @param {object} defaults - { image, title, subtitle, badge }
 */
export function usePageHero(pageKey, defaults) {
  const [hero, setHero] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const section = await getPageHero(pageKey);
        if (active && section) {
          setHero({
            image: section.image || defaults.image,
            title: section.title_fa || defaults.title,
            subtitle: section.subtitle_fa || defaults.subtitle,
            badge: section.badge_fa || defaults.badge,
          });
        }
      } catch {
        // keep defaults
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [pageKey]);

  return { hero, loading };
}
