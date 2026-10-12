// Next build adapter: once `next build` has exported out/, writes a WebP variant
// of every raster image for each width and quality next/image can request.
// File names come from the same optimizedImagePath() the loader uses, so srcset
// URLs always resolve. Next imports this file with plain Node (type stripping),
// hence the explicit .ts extension below.
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { NextAdapter } from "next";
import sharp from "sharp";
import {
  DEFAULT_QUALITY,
  optimizedImagePath,
  RASTER_EXTENSION,
} from "../src/lib/image-loader.ts";

const adapter: NextAdapter = {
  name: "optimize-images",
  async onBuildComplete({ config, projectDir }) {
    const outDir = path.join(projectDir, "out");
    // config.images is already merged with Next defaults.
    const { deviceSizes, imageSizes, qualities = [] } = config.images;
    const widths = [...imageSizes, ...deviceSizes];
    // The loader asks for DEFAULT_QUALITY when an <Image> has no quality prop.
    const allQualities = [...new Set([DEFAULT_QUALITY, ...qualities])];

    // `next build` recreates out/, so it never holds variants from a previous run.
    const files = (await readdir(outDir, { recursive: true })).filter((file) =>
      RASTER_EXTENSION.test(file)
    );

    // sharp runs encodes on the libuv thread pool, so this stays CPU-bounded.
    // ponytail: re-encodes every image on each build; add a hash cache if builds get slow.
    await Promise.all(
      files.flatMap((file) => {
        const src = `/${file.split(path.sep).join("/")}`;
        const image = sharp(path.join(outDir, file));
        return widths.flatMap((width) =>
          allQualities.map((quality) =>
            image
              .clone()
              // Smaller originals are not upscaled, but every width still gets a file.
              .resize({ width, withoutEnlargement: true })
              .webp({ quality })
              .toFile(
                path.join(outDir, optimizedImagePath(src, width, quality))
              )
          )
        );
      })
    );

    console.log(
      `Optimized ${files.length} images × ${widths.length} widths × ${allQualities.length} qualities`
    );
  },
};

export default adapter;
