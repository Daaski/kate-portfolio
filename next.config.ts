import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export has no image server: scripts/optimize-images.ts writes a WebP
  // per width after `next build`, and the loader points srcset at those files.
  // Widths are explicit (Next 16 defaults) because the script reads them here.
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
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

export default nextConfig;
