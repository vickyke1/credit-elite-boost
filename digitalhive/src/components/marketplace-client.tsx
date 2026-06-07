"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "@/components/product-grid";
import { categories } from "@/lib/data/categories";
import { trackSearch } from "@/lib/analytics";
import type { Product, SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const sortLabels: Record<SortOption, string> = {
  featured: "Featured",
  popular: "Most Popular",
  newest: "Newest",
  rating: "Top Rated",
  "title-asc": "Title: A–Z",
  "title-desc": "Title: Z–A",
};

function sortProducts(items: Product[], sort: SortOption): Product[] {
  const copy = [...items];
  switch (sort) {
    case "popular":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
      return copy.sort(
        (a, b) => Number(b.newArrival) - Number(a.newArrival) || b.reviewCount - a.reviewCount,
      );
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "featured":
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function MarketplaceClient({ allProducts }: { allProducts: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";
  const initialSort = (searchParams.get("sort") as SortOption) ?? "featured";

  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState(initialCategory);
  const [sort, setSort] = React.useState<SortOption>(initialSort);
  const [page, setPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);

  // Keep URL in sync (shallow) for shareable links.
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `/marketplace?${qs}` : "/marketplace", {
      scroll: false,
    });
  }, [query, category, sort, router]);

  React.useEffect(() => {
    setPage(1);
  }, [query, category, sort]);

  React.useEffect(() => {
    if (!query) return;
    const t = setTimeout(() => trackSearch(query), 600);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = allProducts;
    if (category !== "all") items = items.filter((p) => p.category === category);
    if (q) {
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return sortProducts(items, sort);
  }, [allProducts, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const activeFilters = (category !== "all" ? 1 : 0) + (query ? 1 : 0);

  function reset() {
    setQuery("");
    setCategory("all");
    setSort("featured");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Sidebar filters */}
      <aside
        className={cn(
          "space-y-6 lg:block",
          showFilters ? "block" : "hidden",
        )}
      >
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Categories</h2>
            {activeFilters > 0 && (
              <button
                onClick={reset}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                category === "all" && "bg-accent font-medium text-accent-foreground",
              )}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const count = allProducts.filter(
                (p) => p.category === c.slug,
              ).length;
              return (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                    category === c.slug &&
                      "bg-accent font-medium text-accent-foreground",
                  )}
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products and tags..."
              className="h-11 pl-10"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilters > 0 && (
              <Badge className="ml-1">{activeFilters}</Badge>
            )}
          </Button>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="h-11 sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {visible.length} of {filtered.length} products
          </span>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>

        <ProductGrid
          products={visible}
          className="sm:grid-cols-2 xl:grid-cols-3"
          emptyMessage="No products match your search. Try a different keyword or category."
        />

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
            >
              Load more products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
