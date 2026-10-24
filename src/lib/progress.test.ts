import { describe, expect, test } from "vitest";
import { progress } from "./progress";

describe("progress", () => {
  test("maps a value inside the range to 0…1", () => {
    expect(progress(0, 0, 100)).toBe(0);
    expect(progress(50, 0, 100)).toBe(0.5);
    expect(progress(100, 0, 100)).toBe(1);
    expect(progress(6950, 6800, 7100)).toBe(0.5);
  });

  test("clamps values outside the range", () => {
    expect(progress(-20, 0, 100)).toBe(0);
    expect(progress(150, 0, 100)).toBe(1);
  });

  test("returns 0 for an empty range instead of NaN", () => {
    expect(progress(10, 100, 100)).toBe(0);
    expect(progress(10, 100, 50)).toBe(0);
  });
});
