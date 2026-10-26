import { preload } from "react-dom";
import { expect, test, vi } from "vitest";
import { preloadImage } from "./preload-image";

vi.mock("react-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-dom")>()),
  preload: vi.fn(),
}));

// Те же sizes, что у <Image> слайда: иначе браузер скачал бы другой вариант из srcset.
test("preloads the image with the given sizes", () => {
  preloadImage({
    sizes: "100vw",
    src: { height: 600, src: "/slide.png", width: 800 },
  });
  expect(preload).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      as: "image",
      imageSizes: "100vw",
      imageSrcSet: expect.any(String),
    })
  );
});
