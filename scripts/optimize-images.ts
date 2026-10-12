// Runs after `next build`: writes a WebP variant of every raster image in out/
// for each width next/image can request. File names come from the same
// optimizedImagePath() the loader uses, so srcset URLs always resolve.
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import nextConfig from "../next.config";
import { optimizedImagePath, RASTER_EXTENSION } from "../src/lib/image-loader";

const OUT_DIR = "out";
const QUALITY = 75;
const VARIANT_SUFFIX = /-w\d+\.webp$/;

const widths = [
  ...(nextConfig.images?.imageSizes ?? []),
  ...(nextConfig.images?.deviceSizes ?? []),
];
if (widths.length === 0) {
  throw new Error(
    "Set images.imageSizes and images.deviceSizes in next.config.ts"
  );
}

const files = (await readdir(OUT_DIR, { recursive: true })).filter(
  (file) => RASTER_EXTENSION.test(file) && !VARIANT_SUFFIX.test(file)
);

// sharp runs encodes on the libuv thread pool, so this stays CPU-bounded.
// ponytail: re-encodes every image on each build; add a hash cache if builds get slow.
await Promise.all(
  files.flatMap((file) => {
    const src = `/${file.split(path.sep).join("/")}`;
    const image = sharp(path.join(OUT_DIR, file));
    return widths.map((width) =>
      image
        .clone()
        // Smaller originals are not upscaled, but every width still gets a file.
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(path.join(OUT_DIR, optimizedImagePath(src, width)))
    );
  })
);

console.log(`Optimized ${files.length} images × ${widths.length} widths`);
