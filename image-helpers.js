/**
 * Image helpers — local /public assets only. No external CDN transforms.
 */

export const IMAGE_LOAD_MODE = {
  OPTIMIZED: 'optimized',
  ORIGINAL: 'original',
  FALLBACK: 'fallback',
}

const DEVICE_PIXEL_RATIOS = [1, 2]

/** External CDN hosts are no longer used; always return local path as-is. */
export function parseImageSrc(src) {
  if (!src) return null
  // Already local
  if (src.startsWith('/') || src.startsWith('./') || src.startsWith('data:')) {
    return { baseUrl: src, isLocal: true }
  }
  // Strip known legacy CDN prefixes if any slip through
  try {
    const u = new URL(src)
    if (u.hostname.includes('base44') || u.hostname.includes('wixstatic') || u.hostname.includes('7golden.co')) {
      // Prefer path under public if it looks like /images/...
      return { baseUrl: u.pathname, isLocal: true }
    }
  } catch {
    /* ignore */
  }
  return { baseUrl: src, isLocal: true }
}

export function buildTransformUrl(parsed, options = {}) {
  // No remote transform service — return original local URL
  return parsed?.baseUrl || options.src || ''
}

export function buildSrcSet(parsed, options = {}) {
  const url = buildTransformUrl(parsed, options)
  return DEVICE_PIXEL_RATIOS.map((dpr) => `${url} ${dpr}x`).join(', ')
}

export function getOriginalImageUrl(src, parsed) {
  return parsed?.baseUrl || src
}

export function nextImageLoadMode(mode) {
  return mode === IMAGE_LOAD_MODE.OPTIMIZED
    ? IMAGE_LOAD_MODE.ORIGINAL
    : IMAGE_LOAD_MODE.FALLBACK
}

/** Default width used when measured size is not yet available. */
export const DEFAULT_TRANSFORM_WIDTH = 800

/**
 * Legacy alias — same as parseImageSrc (no external Wix/Base44 media service).
 */
export function parseWixMediaUrl(src) {
  return parseImageSrc(src)
}
