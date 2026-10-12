import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Separate preload: DOM globals must exist before Testing Library is imported anywhere.
// A real origin: next/image builds absolute URLs and throws on "about:blank".
GlobalRegistrator.register({ url: "http://localhost:3000" });
