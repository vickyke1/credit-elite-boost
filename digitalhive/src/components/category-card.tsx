"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/lib/types";

export function CategoryCard({
  category,
  count,
  index = 0,
}: {
  category: Category;
  count?: number;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        {category.image && (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
          <CategoryIcon name={category.icon} className="h-5 w-5" />
        </div>
        <div className="relative text-white">
          <h3 className="flex items-center gap-1 text-lg font-semibold">
            {category.name}
            <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </h3>
          {typeof count === "number" && (
            <p className="text-sm text-white/80">{count} products</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
