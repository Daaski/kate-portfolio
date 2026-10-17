import { describe, expect, test } from "vitest";
import { nearestSlide } from "./utils";

describe("nearestSlide", () => {
  test.each([
    [0, 0, 0],
    [1, 0, 0],
    [3, 0, 3],
    [0, 2, 5],
    [4, 2, 5],
    [0, 1, 1],
  ])("current %i, index %i -> %i (count 3)", (current, index, expected) => {
    expect(nearestSlide(current, index, 3)).toBe(expected);
  });
});
