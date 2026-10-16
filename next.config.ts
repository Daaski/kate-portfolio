import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    // У static export нет сервера картинок: адаптер scripts/optimize-images.ts
    // пишет WebP-варианты в конце `next build`, а loader направляет srcset
    // на эти файлы. Варианты есть только после сборки, поэтому dev отдаёт
    // оригиналы как есть.
    adapterPath: require.resolve("./scripts/optimize-images.ts"),
    images: {
      loader: "custom",
      loaderFile: "./src/lib/image-loader.ts",
      unoptimized: phase === PHASE_DEVELOPMENT_SERVER,
    },
    output: "export",
    turbopack: {
      rules: {
        "*.css": {
          as: "*.css",
          loaders: ["@tailwindcss/turbopack"],
        },
      },
    },
  };
}
