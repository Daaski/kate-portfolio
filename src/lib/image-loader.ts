"use client";

import type { ImageLoaderProps } from "next/image";

export const RASTER_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

/** Качество, которое next/image берёт сам, если у <Image> нет пропа quality. */
export const DEFAULT_QUALITY = 75;

/**
 * Путь WebP-варианта, который scripts/optimize-images.ts кладёт рядом
 * с оригиналом в out/. Нерастровые картинки (SVG) возвращаются без изменений.
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
