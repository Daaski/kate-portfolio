import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { onScrollFrame } from "./on-scroll-frame";

describe("onScrollFrame", () => {
  let frames: Map<number, FrameRequestCallback>;
  let nextId: number;

  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) {
      callback(0);
    }
  };

  beforeEach(() => {
    frames = new Map();
    nextId = 0;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      nextId += 1;
      frames.set(nextId, callback);
      return nextId;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      frames.delete(id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("calls update immediately", () => {
    const update = vi.fn();
    const stop = onScrollFrame(update);
    expect(update).toHaveBeenCalledTimes(1);
    stop();
  });

  test("batches several scroll events into one update per frame", () => {
    const update = vi.fn();
    const stop = onScrollFrame(update);
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    flush();
    expect(update).toHaveBeenCalledTimes(2);
    window.dispatchEvent(new Event("scroll"));
    flush();
    expect(update).toHaveBeenCalledTimes(3);
    stop();
  });

  test("calls update on resize", () => {
    const update = vi.fn();
    const stop = onScrollFrame(update);
    window.dispatchEvent(new Event("resize"));
    flush();
    expect(update).toHaveBeenCalledTimes(2);
    stop();
  });

  test("stops updating and cancels the pending frame after cleanup", () => {
    const update = vi.fn();
    const stop = onScrollFrame(update);
    window.dispatchEvent(new Event("scroll"));
    stop();
    expect(frames.size).toBe(0);
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("resize"));
    flush();
    expect(update).toHaveBeenCalledTimes(1);
  });
});
