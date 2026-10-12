import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export has no image optimization server.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
