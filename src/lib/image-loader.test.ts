import { afterEach, describe, expect, test, vi } from "vitest";
import imageLoader, { optimizedImagePath } from "./image-loader";

describe("optimizedImagePath", () => {
  test("maps a static import to its WebP variant next to it", () => {
    expect(
      optimizedImagePath("/_next/static/media/cover.3f2a1b.jpg", 640)
    ).toBe("/_next/static/media/cover.3f2a1b-w640.webp");
  });

  test("maps a public image", () => {
    expect(optimizedImagePath("/images/photo.png", 1080)).toBe(
      "/images/photo-w1080.webp"
    );
  });

  test("handles every raster extension case-insensitively", () => {
    for (const ext of ["jpg", "jpeg", "png", "webp", "avif", "JPG", "Jpeg"]) {
      expect(optimizedImagePath(`/a.${ext}`, 32)).toBe("/a-w32.webp");
    }
  });

  test("leaves non-raster images unchanged", () => {
    expect(optimizedImagePath("/next.svg", 640)).toBe("/next.svg");
  });

  test("rejects remote images", () => {
    expect(() => optimizedImagePath("https://example.com/a.jpg", 640)).toThrow(
      "Only local images"
    );
  });
});

describe("imageLoader", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("returns the optimized variant in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(imageLoader({ src: "/images/photo.jpg", width: 750 })).toBe(
      "/images/photo-w750.webp"
    );
  });

  test("serves the original with a width query in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(imageLoader({ src: "/images/photo.jpg", width: 750 })).toBe(
      "/images/photo.jpg?w=750"
    );
  });
});
