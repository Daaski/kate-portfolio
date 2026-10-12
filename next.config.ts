import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    // Static export has no image server: the scripts/optimize-images.ts adapter
    // writes WebP variants at the end of `next build`, and the loader points
    // srcset at those files. Variants exist only after a build, so dev serves
    // originals as-is.
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
