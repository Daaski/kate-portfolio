"use client";

import type { ImageLoaderProps } from "next/image";

export const RASTER_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

/** What next/image itself uses when an <Image> has no quality prop. */
export const DEFAULT_QUALITY = 75;

/**
 * Path of the WebP variant that scripts/optimize-images.ts writes next to the
 * original image in out/. Non-raster images (SVG) are returned unchanged.
 */
export function optimizedImagePath(
  src: string,
  width: number,
  quality: number
): string {
  if (!src.startsWith("/")) {
    throw new Error(`Only local images are supported, got "${src}"`);
  }
  return src.replace(RASTER_EXTENSION, `-w${width}q${quality}.webp`);
}

export default function imageLoader({
  src,
  width,
  quality = DEFAULT_QUALITY,
}: ImageLoaderProps): string {
  return optimizedImagePath(src, width, quality);
}
