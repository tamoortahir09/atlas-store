/**
 * R2 Asset Management with Cloudflare CDN Caching
 * 
 * This utility implements cost-saving principles:
 * - Uses versioned URLs to manage cache invalidation
 * - Leverages Cloudflare's CDN for edge caching
 * - Reduces GetObject hits to R2 through proper caching
 * - Provides consistent asset management across the app
 */

const R2_BASE_URL = 'https://website.atlasrust.com';

// Asset versions - increment to bust cache when needed
const ASSET_VERSIONS = {
  'maps-bg': '1',
  'hero-video': '1',
  'store-bg': '1',
  // Add more asset versions as needed
} as const;

export type AssetKey = keyof typeof ASSET_VERSIONS;

/**
 * Get versioned R2 asset URL with cache optimization
 * @param path - Asset path (e.g., 'videos/maps-bg.mp4')
 * @param versionKey - Version key for cache busting
 * @param options - Additional options for caching
 */
export function getR2AssetUrl(
  path: string, 
  versionKey?: AssetKey,
  options: {
    maxAge?: number; // Cache-Control max-age hint
    format?: string; // For image transformations
  } = {}
): string {
  const url = new URL(path, R2_BASE_URL);
  
  // Add version parameter for cache management
  if (versionKey && ASSET_VERSIONS[versionKey]) {
    url.searchParams.set('v', ASSET_VERSIONS[versionKey]);
  }
  
  // Add format parameter for image transformations
  if (options.format) {
    url.searchParams.set('format', options.format);
  }
  
  return url.toString();
}

/**
 * Video asset URLs with optimized caching
 */
export const VIDEO_ASSETS = {
  MAPS_BACKGROUND: getR2AssetUrl('videos/maps-bg.mp4', 'maps-bg'),
  // Add more video assets as needed
} as const;

/**
 * HTML attributes for video elements to maximize caching
 */
export const VIDEO_CACHE_ATTRIBUTES = {
  // Use metadata preload to avoid unnecessary bandwidth
  preload: 'metadata' as const,
  // Optimize for caching
  style: {
    willChange: 'auto' as const,
  },
  // Cache headers are handled by Cloudflare R2 + CDN
} as const;

/**
 * Utility for creating cache-optimized video props
 */
export function createVideoProps(src: string, additional: Record<string, any> = {}) {
  return {
    src,
    ...VIDEO_CACHE_ATTRIBUTES,
    ...additional,
  };
}

/**
 * Cost optimization notes:
 * 
 * 1. Cloudflare CDN Caching:
 *    - Assets cached at edge reduce R2 GetObject hits
 *    - Use proper Cache-Control headers on R2 bucket
 * 
 * 2. Version Management:
 *    - Update ASSET_VERSIONS when assets change
 *    - Allows long-term caching with controlled invalidation
 * 
 * 3. Preload Strategy:
 *    - Use 'metadata' preload for videos to save bandwidth
 *    - Critical assets can use 'auto' when needed
 * 
 * 4. Format Optimization:
 *    - Consider WebP/AVIF for images
 *    - Use appropriate video codecs (H.264, VP9, AV1)
 *    - Compress assets before uploading to R2
 */ 