import { siteConfig } from "@/lib/seo";
import type { Product, BlogPost } from "@/lib/types";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: new URL("/logo.png", siteConfig.url).toString(),
        description: siteConfig.description,
        sameAs: [
          "https://www.etsy.com",
          "https://twitter.com/digitalhive",
          "https://www.instagram.com/digitalhive",
        ],
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/marketplace?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.shortDescription,
        image: product.images,
        sku: product.id,
        category: product.category,
        brand: { "@type": "Brand", name: siteConfig.name },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
        offers: {
          "@type": "Offer",
          url: new URL(`/product/${product.slug}`, siteConfig.url).toString(),
          priceCurrency: "USD",
          price: product.price ?? 0,
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: BlogPost }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.publishedAt,
        author: { "@type": "Person", name: post.author.name },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: new URL("/logo.png", siteConfig.url).toString(),
          },
        },
        mainEntityOfPage: new URL(
          `/blog/${post.slug}`,
          siteConfig.url,
        ).toString(),
      }}
    />
  );
}
