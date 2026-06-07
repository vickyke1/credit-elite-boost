import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { CategoryIcon } from "@/components/category-icon";
import { CtaBanner } from "@/components/cta-banner";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Category" });
  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/category/${category.slug}`,
    keywords: [category.name.toLowerCase(), "digital products", "templates"],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items = getProductsByCategory(category.slug);

  return (
    <>
      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />
        <div className="mb-10 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <CategoryIcon name={category.icon} className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        <ProductGrid
          products={items}
          emptyMessage="No products in this category yet — check back soon!"
        />
      </div>
      <CtaBanner
        title={`Looking for more ${category.name.toLowerCase()}?`}
        description="Explore the full marketplace for hundreds more premium digital products."
      />
    </>
  );
}
