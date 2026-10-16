// Адаптер next build: после того как `next build` выгрузил out/, пишет WebP-вариант
// каждой растровой картинки для всех ширин и качеств, которые может запросить next/image.
// Имена файлов — из той же optimizedImagePath(), что и в loader, поэтому URL из srcset
// всегда существуют. Next импортирует этот файл обычным Node (type stripping),
// отсюда явное расширение .ts ниже.
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
    // config.images уже объединён с дефолтами Next.
    const { deviceSizes, imageSizes, qualities = [] } = config.images;
    const widths = [...imageSizes, ...deviceSizes];
    // Loader запрашивает DEFAULT_QUALITY, если у <Image> нет пропа quality.
    const allQualities = [...new Set([DEFAULT_QUALITY, ...qualities])];

    // `next build` пересоздаёт out/, поэтому вариантов от прошлой сборки там не бывает.
    const files = (await readdir(outDir, { recursive: true })).filter((file) =>
      RASTER_EXTENSION.test(file)
    );

    // sharp кодирует в пуле потоков libuv, поэтому нагрузка ограничена числом ядер.
    // ponytail: каждая сборка перекодирует все картинки; станет медленно — добавить кеш по хешу.
    await Promise.all(
      files.flatMap((file) => {
        const src = `/${file.split(path.sep).join("/")}`;
        const image = sharp(path.join(outDir, file));
        return widths.flatMap((width) =>
          allQualities.map((quality) =>
            image
              .clone()
              // Маленькие оригиналы не увеличиваются, но файл есть для каждой ширины.
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
