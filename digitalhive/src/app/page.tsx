import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { CategoryCard } from "@/components/category-card";
import { CreatorBenefits } from "@/components/creator-benefits";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import {
  products,
  featuredProducts,
  bestsellerProducts,
  newArrivals,
} from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { generalFaqs } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  description:
    "DigitalHive is the marketplace for digital creators. Discover premium templates, planners, ebooks, AI prompts, and design assets — then check out securely on Etsy.",
});

export default function HomePage() {
  const trending = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);

  return (
    <>
      <Hero />

      {/* Popular Categories */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Browse"
          title="Popular Categories"
          description="Find exactly what you need across ten curated collections."
          href="/categories"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((c, i) => (
            <CategoryCard
              key={c.slug}
              category={c}
              index={i}
              count={products.filter((p) => p.category === c.slug).length}
            />
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-secondary/40 py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured Products"
            description="Our team's favorites — premium quality, ready to download."
            href="/marketplace"
          />
          <ProductGrid products={featuredProducts.slice(0, 4)} />
        </div>
      </section>

      {/* Trending */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Hot right now"
          title="Trending Products"
          description="The most-loved products in the hive this week."
          href="/marketplace?sort=popular"
        />
        <ProductGrid products={trending.slice(0, 8)} />
      </section>

      {/* Creator Benefits */}
      <section className="bg-secondary/40 py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why DigitalHive"
            title="Built for creators and buyers"
            align="center"
          />
          <CreatorBenefits />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Crowd favorites"
          title="Best Sellers"
          description="Thousands of happy customers can't be wrong."
          href="/marketplace?sort=popular"
        />
        <ProductGrid products={bestsellerProducts.slice(0, 4)} />
      </section>

      {/* New Arrivals */}
      <section className="bg-secondary/40 py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Fresh drops"
            title="New Arrivals"
            description="Just added to the marketplace."
            href="/marketplace?sort=newest"
          />
          <ProductGrid products={newArrivals.slice(0, 4)} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Loved by thousands"
          title="What our customers say"
          align="center"
        />
        <TestimonialsSection />
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-16">
        <div className="container-page mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked questions"
            align="center"
          />
          <FaqAccordion items={generalFaqs} />
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/contact">
                Still have questions? Contact us
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
