import { describe, expect, test } from "vitest";
import imageLoader, { optimizedImagePath } from "./image-loader";

describe("optimizedImagePath", () => {
  test("maps a static import to its WebP variant next to it", () => {
    expect(
      optimizedImagePath("/_next/static/media/cover.3f2a1b.jpg", 640, 75)
    ).toBe("/_next/static/media/cover.3f2a1b-w640q75.webp");
  });

  test("maps a public image", () => {
    expect(optimizedImagePath("/images/photo.png", 1080, 90)).toBe(
      "/images/photo-w1080q90.webp"
    );
  });

  test("handles every raster extension case-insensitively", () => {
    for (const ext of ["jpg", "jpeg", "png", "webp", "avif", "JPG", "Jpeg"]) {
      expect(optimizedImagePath(`/a.${ext}`, 32, 75)).toBe("/a-w32q75.webp");
    }
  });

  test("leaves non-raster images unchanged", () => {
    expect(optimizedImagePath("/logo.svg", 640, 75)).toBe("/logo.svg");
  });

  test("rejects remote images", () => {
    expect(() =>
      optimizedImagePath("https://example.com/a.jpg", 640, 75)
    ).toThrow("Only local images");
  });
});

describe("imageLoader", () => {
  test("uses the quality prop", () => {
    expect(
      imageLoader({ quality: 90, src: "/images/photo.jpg", width: 750 })
    ).toBe("/images/photo-w750q90.webp");
  });

  test("falls back to next/image's default quality", () => {
    expect(imageLoader({ src: "/images/photo.jpg", width: 750 })).toBe(
      "/images/photo-w750q75.webp"
    );
  });
});
