"use client";

import type { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import { slugify } from "@/lib/utils";

// A simple client-side store for the demo admin dashboard. It layers any
// admin-created products on top of the seed catalog using localStorage so the
// dashboard is fully functional without a backend. In production you would
// swap this for a database (e.g. Supabase, Postgres) behind API routes.

const STORAGE_KEY = "digitalhive:admin:products";

export function loadAdminProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function saveAdminProducts(items: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAllProducts(): Product[] {
  return [...loadAdminProducts(), ...seedProducts];
}

export function upsertProduct(input: Partial<Product> & { title: string }): Product {
  const items = loadAdminProducts();
  const slug = input.slug?.trim() || slugify(input.title);
  const existingIndex = items.findIndex((p) => p.id === input.id);

  const product: Product = {
    id: input.id || `admin-${Date.now()}`,
    title: input.title,
    slug,
    description: input.description || input.shortDescription || "",
    shortDescription: input.shortDescription || "",
    images:
      input.images && input.images.length
        ? input.images
        : ["https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80"],
    category: input.category || "business-templates",
    tags: input.tags || [],
    featured: input.featured ?? false,
    bestseller: input.bestseller ?? false,
    newArrival: input.newArrival ?? true,
    etsyUrl: input.etsyUrl || "",
    rating: input.rating ?? 5,
    reviewCount: input.reviewCount ?? 0,
    price: input.price,
    features: input.features || [],
  };

  if (existingIndex >= 0) {
    items[existingIndex] = product;
  } else {
    items.unshift(product);
  }
  saveAdminProducts(items);
  return product;
}

export function deleteProduct(id: string) {
  const items = loadAdminProducts().filter((p) => p.id !== id);
  saveAdminProducts(items);
}

export interface CsvRow {
  "Product Name"?: string;
  Description?: string;
  Category?: string;
  "Image URL"?: string;
  "Etsy URL"?: string;
  Tags?: string;
}

// Minimal, dependency-free CSV parser that handles quoted fields and commas.
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (nonEmpty.length < 2) return [];

  const headers = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((cols) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? "").trim();
    });
    return obj;
  });
}

export function importProductsFromCsv(text: string): {
  imported: number;
  products: Product[];
} {
  const rows = parseCsv(text);
  const created: Product[] = [];

  rows.forEach((r) => {
    const title = r["Product Name"] || r["Title"] || r["Name"];
    if (!title) return;
    const product = upsertProduct({
      title,
      shortDescription: (r["Description"] || "").slice(0, 140),
      description: r["Description"] || "",
      category: r["Category"] ? slugify(r["Category"]) : "business-templates",
      images: r["Image URL"] ? [r["Image URL"]] : undefined,
      etsyUrl: r["Etsy URL"] || "",
      tags: r["Tags"]
        ? r["Tags"].split(/[;|]/).map((t) => t.trim()).filter(Boolean)
        : [],
    });
    created.push(product);
  });

  return { imported: created.length, products: created };
}
