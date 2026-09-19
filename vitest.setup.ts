import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia or IntersectionObserver, both of which
// framer-motion (useReducedMotion, whileInView) and the custom cursor/grid
// components rely on — stub them so component render tests don't throw.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!("IntersectionObserver" in window)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // @ts-expect-error — jsdom has no IntersectionObserver; this stub is enough for tests
  window.IntersectionObserver = MockIntersectionObserver;
  // @ts-expect-error — same, for code that references the global directly
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
