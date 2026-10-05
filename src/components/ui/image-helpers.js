/**
 * Local-only image helpers (no Wix / Base44 CDN transforms).
 * Must export everything image.jsx imports.
 */

export const IMAGE_LOAD_MODE = {
  OPTIMIZED: "optimized",
  ORIGINAL: "original",
  FALLBACK: "fallback",
}

export const DEFAULT_TRANSFORM_WIDTH = 800
export const DEVICE_PIXEL_RATIOS = [1, 2]

/**
 * Legacy name kept for image.jsx — treats any URL as a simple local asset descriptor.
 */
export function parseWixMediaUrl(src) {
  if (!src || typeof src !== "string") {
    return null
  }

  // Local / relative / data
  if (
    src.startsWith("/") ||
    src.startsWith("./") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return {
      baseUrl: src,
      isLocal: true,
      isWixMedia: false,
      fileName: src.split("/").pop() || "image",
    }
  }

  try {
    const u = new URL(src)
    // Map old CDN URLs to path-only (files should live under public/)
    if (
      u.hostname.includes("base44") ||
      u.hostname.includes("wixstatic") ||
      u.hostname.includes("7golden.co")
    ) {
      return {
        baseUrl: u.pathname || "/logo.webp",
        isLocal: true,
        isWixMedia: false,
        fileName: u.pathname.split("/").pop() || "image",
      }
    }
    return {
      baseUrl: src,
      isLocal: false,
      isWixMedia: false,
      fileName: u.pathname.split("/").pop() || "image",
    }
  } catch {
    return {
      baseUrl: src,
      isLocal: true,
      isWixMedia: false,
      fileName: "image",
    }
  }
}

/** Alias used by some code paths */
export function parseImageSrc(src) {
  return parseWixMediaUrl(src)
}

/** No remote resize service — return original */
export function buildTransformUrl(parsed, options = {}) {
  if (!parsed) return options.src || ""
  return parsed.baseUrl || options.src || ""
}

export function buildSrcSet(parsed, options = {}) {
  const url = buildTransformUrl(parsed, options)
  if (!url) return undefined
  return DEVICE_PIXEL_RATIOS.map((dpr) => `${url} ${dpr}x`).join(", ")
}

export function getOriginalImageUrl(src, parsed) {
  if (parsed && parsed.baseUrl) return parsed.baseUrl
  return src || ""
}

export function nextImageLoadMode(mode) {
  if (mode === IMAGE_LOAD_MODE.OPTIMIZED) return IMAGE_LOAD_MODE.ORIGINAL
  return IMAGE_LOAD_MODE.FALLBACK
}
