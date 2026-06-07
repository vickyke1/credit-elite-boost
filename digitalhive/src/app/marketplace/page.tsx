import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MarketplaceClient } from "@/components/marketplace-client";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@/lib/data/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Marketplace",
  description:
    "Browse the full DigitalHive marketplace — search, filter, and sort hundreds of premium digital products across every category.",
  path: "/marketplace",
});

function MarketplaceFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <Skeleton className="hidden h-96 lg:block" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Marketplace" }]} />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Marketplace
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover premium digital products. Search, filter by category, and
          sort to find exactly what you need.
        </p>
      </div>
      <Suspense fallback={<MarketplaceFallback />}>
        <MarketplaceClient allProducts={products} />
      </Suspense>
    </div>
  );
}
