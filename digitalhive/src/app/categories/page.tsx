import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryCard } from "@/components/category-card";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Categories",
  description:
    "Explore all DigitalHive categories — business templates, digital planners, resume templates, ebooks, AI prompts, design assets, and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Categories
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ten curated collections of premium digital products. Pick a category
          to dive in.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <CategoryCard
            key={c.slug}
            category={c}
            index={i}
            count={products.filter((p) => p.category === c.slug).length}
          />
        ))}
      </div>
    </div>
  );
}
