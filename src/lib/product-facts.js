// Pure helpers that turn a product's own data (description text, weights,
// taste profile) into the facts shown on the product page.

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export const toFa = (value) => String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

/** [10000, 40000] (grams) → ['۱۰ کیلوگرم', '۴۰ کیلوگرم'] */
export function getPackagingOptions(weights) {
  if (!Array.isArray(weights)) return [];
  return weights
    .map((g) => Number(g))
    .filter((g) => Number.isFinite(g) && g > 0)
    .sort((a, b) => a - b)
    .map((g) => `${toFa(+(g / 1000).toFixed(1))} کیلوگرم`);
}

/**
 * Pulls the "suitable for …" clause out of a Persian product description and
 * returns it as a list of industries / buyers.
 *   "مناسب برای صادرات، صنایع بسته‌بندی و آجیل‌فروشان." → ['صادرات', 'صنایع بسته‌بندی', 'آجیل‌فروشان']
 */
export function extractUses(desc) {
  if (!desc) return [];
  // "مناسب" must open a sentence or clause — mid-phrase ("شرایط … مناسب منطقه") is not a use list.
  const match = desc.match(/(?:^|[.،]\s*)مناسب(?:\s+برای)?(?:\s+مصرف(?:\s+در)?)?\s+([^.]+)/);
  if (!match) return [];

  // The clause sometimes runs on into the packaging sentence ("… و… بسته‌بندی در وزن‌های …") — stop there.
  let clause = match[1].split(/\sبسته‌بندی\s+در\s/)[0].trim();
  clause = clause.replace(/\s*و?\s*…\s*$/, '').trim();
  if (!clause) return [];

  const parts = clause.split('،').map((s) => s.trim()).filter(Boolean);
  // The last part is usually "X و Y" — split that final conjunction only.
  const last = parts[parts.length - 1];
  const idx = last.lastIndexOf(' و ');
  if (idx > 0) parts.splice(parts.length - 1, 1, last.slice(0, idx).trim(), last.slice(idx + 3).trim());

  return [...new Set(parts.filter(Boolean))].slice(0, 8);
}

const TASTE_LABELS = [
  { key: 'nutty', label: 'طعم مغزی' },
  { key: 'sweet', label: 'شیرینی' },
  { key: 'earthy', label: 'رایحه خاکی' },
  { key: 'bitter', label: 'تلخی' },
];

/** Returns [] for products with no taste data (e.g. by-products like skins). */
export function getTasteRows(taste) {
  if (!taste) return [];
  const rows = TASTE_LABELS
    .map(({ key, label }) => ({ label, value: Math.max(0, Math.min(100, Number(taste[key]) || 0)) }));
  return rows.some((r) => r.value > 0) ? rows : [];
}
