"use client";

// Lightweight analytics layer. Sends events to Google Analytics (gtag) when
// configured, and always logs to the console in development for easy debugging.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", name, params);
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, params);
  }
}

export function trackPageView(url: string) {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;
  window.gtag("config", GA_ID, { page_path: url });
}

// Specific, named events used across the app.
export function trackEtsyClick(product: {
  id: string;
  title: string;
  category: string;
}) {
  trackEvent("etsy_click", {
    product_id: product.id,
    product_title: product.title,
    category: product.category,
    outbound: true,
  });
}

export function trackProductClick(product: { id: string; title: string }) {
  trackEvent("product_click", {
    product_id: product.id,
    product_title: product.title,
  });
}

export function trackNewsletterSignup(source: string) {
  trackEvent("newsletter_signup", { source });
}

export function trackSearch(query: string) {
  trackEvent("search", { search_term: query });
}
