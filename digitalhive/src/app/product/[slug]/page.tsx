import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Download, ShieldCheck, Tag } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGallery } from "@/components/product-gallery";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { BuyOnEtsyButton } from "@/components/buy-on-etsy-button";
import { ProductGrid } from "@/components/product-grid";
import { ReviewsSection } from "@/components/reviews";
import { FaqAccordion } from "@/components/faq-accordion";
import { SectionHeading } from "@/components/section-heading";
import { ProductJsonLd } from "@/components/structured-data";
import {
  products,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { productFaqs } from "@/lib/data/faq";
import { sampleReviews } from "@/lib/data/reviews";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return buildMetadata({ title: "Product not found" });
  return buildMetadata({
    title: product.title,
    description: product.shortDescription,
    path: `/product/${product.slug}`,
    image: product.images[0],
    keywords: product.tags,
    type: "article",
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product, 4);

  return (
    <div className="container-page py-10">
      <ProductJsonLd product={product} />
      <Breadcrumbs
        items={[
          { label: "Marketplace", href: "/marketplace" },
          ...(category
            ? [{ label: category.name, href: `/category/${category.slug}` }]
            : []),
          { label: product.title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-primary hover:underline"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />
            <div className="flex gap-1.5">
              {product.bestseller && (
                <Badge className="bg-honey-500 text-honey-950">Bestseller</Badge>
              )}
              {product.newArrival && <Badge variant="success">New</Badge>}
            </div>
          </div>

          {typeof product.price === "number" && (
            <div className="mt-5 text-3xl font-bold">
              ${product.price.toFixed(2)}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                on Etsy
              </span>
            </div>
          )}

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          {product.features && product.features.length > 0 && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 space-y-3">
            <BuyOnEtsyButton
              product={product}
              size="lg"
              className="w-full"
            />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Download className="h-4 w-4 text-primary" /> Instant download
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure Etsy
                checkout
              </span>
            </div>
          </div>

          {product.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/marketplace?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t pt-12">
        <SectionHeading title="Customer Reviews" eyebrow="What buyers say" />
        <ReviewsSection
          reviews={sampleReviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-3xl border-t pt-12">
        <SectionHeading title="Product FAQ" align="center" />
        <FaqAccordion items={productFaqs} />
      </section>

      {/* Related */}
      <section className="mt-16 border-t pt-12">
        <SectionHeading
          title="Related Products"
          eyebrow="You may also like"
          href="/marketplace"
        />
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
