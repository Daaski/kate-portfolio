import { expect, test } from "vitest";
import { currentGroupIndex } from "./utils";

test("picks the last group whose top reached the line", () => {
  expect(currentGroupIndex([-900, 96, 700], 96)).toBe(1);
  expect(currentGroupIndex([-900, -100, 700], 96)).toBe(1);
  expect(currentGroupIndex([-1500, -900, 40], 96)).toBe(2);
});

test("falls back to the first group above every top", () => {
  expect(currentGroupIndex([112, 900], 96)).toBe(0);
});
