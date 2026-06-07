"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { BuyOnEtsyButton } from "@/components/buy-on-etsy-button";
import { getCategoryBySlug } from "@/lib/data/categories";
import { trackProductClick } from "@/lib/analytics";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const category = getCategoryBySlug(product.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
        onClick={() => trackProductClick(product)}
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.bestseller && (
            <Badge className="bg-honey-500 text-honey-950">Bestseller</Badge>
          )}
          {product.newArrival && (
            <Badge variant="success">New</Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="mb-1 text-xs font-medium uppercase tracking-wide text-primary hover:underline"
          >
            {category.name}
          </Link>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug">
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackProductClick(product)}
            className="hover:text-primary"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          {typeof product.price === "number" && (
            <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="mt-4 flex-1" />
        <BuyOnEtsyButton product={product} size="sm" className="w-full" />
      </div>
    </motion.article>
  );
}
