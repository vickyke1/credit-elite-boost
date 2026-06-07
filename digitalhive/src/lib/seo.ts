import type { Metadata } from "next";

export const siteConfig = {
  name: "DigitalHive",
  tagline: "Discover Premium Digital Products.",
  description:
    "DigitalHive is a premium marketplace for digital products — templates, planners, ebooks, design assets, AI prompts, and downloadable resources. Discover, then buy on Etsy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://digitalhive.com",
  ogImage: "/og-image.png",
  twitter: "@digitalhive",
  keywords: [
    "digital products",
    "digital marketplace",
    "templates",
    "printables",
    "digital planners",
    "resume templates",
    "ebooks",
    "ai prompts",
    "design assets",
    "etsy digital products",
  ],
};

interface BuildMetaArgs {
  title?: string;
  description?: string;
  path?: string;
  /** Provide a specific image to override the auto-generated OG image. */
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  keywords,
  type = "website",
  noIndex = false,
}: BuildMetaArgs = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const url = new URL(path, siteConfig.url).toString();

  // When an explicit image is supplied we set it; otherwise we let Next's
  // file-based `opengraph-image`/`twitter-image` convention generate one.
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : new URL(image, siteConfig.url).toString()
    : undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywords ?? siteConfig.keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      ...(imageUrl
        ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
      creator: siteConfig.twitter,
    },
  };
}
