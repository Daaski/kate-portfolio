import { defineConfig } from "vitest/config";

const IMAGE = /\.(png|jpe?g|webp|avif)$/;

export default defineConfig({
  plugins: [
    {
      // Vite отдаёт импорт картинки строкой-URL, а next/image ждёт StaticImageData с размерами.
      // Заглушка вместо него — тесты рендерят настоящие данные из src/constants без vi.mock.
      enforce: "pre",
      load: (id) =>
        IMAGE.test(id)
          ? `export default ${JSON.stringify({ height: 1, src: id, width: 1 })};`
          : null,
      name: "static-image-stub",
    },
  ],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
