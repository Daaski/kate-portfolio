"use client";

import type { ImageLoaderProps } from "next/image";

export const RASTER_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

/**
 * Path of the WebP variant that scripts/optimize-images.ts writes next to the
 * original image in out/. Non-raster images (SVG) are returned unchanged.
 */
export function optimizedImagePath(src: string, width: number): string {
  if (!src.startsWith("/")) {
    throw new Error(`Only local images are supported, got "${src}"`);
  }
  return src.replace(RASTER_EXTENSION, `-w${width}.webp`);
}

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  // Variants exist only after `bun run build`, so dev serves the original.
  // The query keeps each srcset URL width-specific, as next/image expects.
  if (process.env.NODE_ENV === "development") {
    return `${src}?w=${width}`;
  }
  return optimizedImagePath(src, width);
}
