import { expect, test } from "vitest";
import { isArrowHidden, nextSlideIndex } from "./utils";

test("finds the first slide below the line", () => {
  expect(nextSlideIndex([-500, 80, 600, 1100], 80)).toBe(2);
  expect(nextSlideIndex([-500, 300], 80)).toBe(1);
});

test("does not count a slide sitting on the line within 1px", () => {
  expect(nextSlideIndex([80.6, 600], 80)).toBe(1);
});

test("returns -1 when every slide is above the line", () => {
  expect(nextSlideIndex([-900, -400, 80.4], 80)).toBe(-1);
  expect(nextSlideIndex([], 80)).toBe(-1);
});

test("shows the arrow while the last slide runs below the screen", () => {
  expect(isArrowHidden([-500, 80, 600], 1080, 80, 900)).toBe(false);
});

test("hides the arrow once the last slide is fully on screen", () => {
  expect(isArrowHidden([-500, 80, 400], 880, 80, 900)).toBe(true);
  expect(isArrowHidden([-500, 80, 420], 900, 80, 900)).toBe(true);
});

test("hides the arrow when no slide is below the line", () => {
  expect(isArrowHidden([-900, 80], 1500, 80, 900)).toBe(true);
  expect(isArrowHidden([], 0, 0, 900)).toBe(true);
});
