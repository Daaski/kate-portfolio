import { afterEach, expect, test, vi } from "vitest";
import { onSiteNavigation } from "./on-site-navigation";

const link = document.createElement("a");
link.href = "/projects/sfera";
const icon = link.appendChild(document.createElement("span"));
document.body.append(link);

let stop: (() => void) | undefined;

afterEach(() => {
  stop?.();
});

const clickInside = (prevent: boolean) => {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  if (prevent) {
    event.preventDefault();
  }
  icon.dispatchEvent(event);
};

test("reports the link of a click that next/link took over", () => {
  const callback = vi.fn();
  stop = onSiteNavigation(callback);
  clickInside(true);
  expect(callback).toHaveBeenCalledWith(link);
});

// Клик, который не погашен, — новая вкладка, чужой сайт или модификатор: навигация не у сайта.
test("ignores clicks left to the browser", () => {
  const callback = vi.fn();
  stop = onSiteNavigation(callback);
  clickInside(false);
  expect(callback).not.toHaveBeenCalled();
});

test("ignores prevented clicks outside links", () => {
  const callback = vi.fn();
  stop = onSiteNavigation(callback);
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  event.preventDefault();
  document.body.dispatchEvent(event);
  expect(callback).not.toHaveBeenCalled();
});

test("stops listening", () => {
  const callback = vi.fn();
  onSiteNavigation(callback)();
  clickInside(true);
  expect(callback).not.toHaveBeenCalled();
});
