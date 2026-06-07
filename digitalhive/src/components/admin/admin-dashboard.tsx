"use client";

import * as React from "react";
import Image from "next/image";
import {
  BarChart3,
  Boxes,
  FileUp,
  FolderTree,
  Lock,
  Newspaper,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data/categories";
import { blogPosts } from "@/lib/data/blog";
import {
  deleteProduct,
  getAllProducts,
  importProductsFromCsv,
  loadAdminProducts,
  upsertProduct,
} from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "digitalhive-admin";

type Tab = "overview" | "products" | "import" | "categories" | "blog";

const tabs: { id: Tab; label: string; icon: typeof Boxes }[] = [
  { id: "overview", label: "Analytics", icon: BarChart3 },
  { id: "products", label: "Products", icon: Boxes },
  { id: "import", label: "CSV Import", icon: FileUp },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "blog", label: "Blog", icon: Newspaper },
];

const emptyForm: Partial<Product> & { tagsText?: string } = {
  title: "",
  shortDescription: "",
  description: "",
  category: "business-templates",
  etsyUrl: "",
  tagsText: "",
  featured: false,
  bestseller: false,
  newArrival: true,
};

export function AdminDashboard() {
  const [authed, setAuthed] = React.useState(false);
  const [passInput, setPassInput] = React.useState("");
  const [error, setError] = React.useState("");
  const [tab, setTab] = React.useState<Tab>("overview");

  const [adminProducts, setAdminProducts] = React.useState<Product[]>([]);
  const [allCount, setAllCount] = React.useState(0);
  const [form, setForm] =
    React.useState<Partial<Product> & { tagsText?: string }>(emptyForm);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [importResult, setImportResult] = React.useState<string>("");

  const refresh = React.useCallback(() => {
    setAdminProducts(loadAdminProducts());
    setAllCount(getAllProducts().length);
  }, []);

  React.useEffect(() => {
    if (sessionStorage.getItem("dh-admin") === "1") setAuthed(true);
  }, []);

  React.useEffect(() => {
    if (authed) refresh();
  }, [authed, refresh]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (passInput === PASSCODE) {
      setAuthed(true);
      sessionStorage.setItem("dh-admin", "1");
      setError("");
    } else {
      setError("Incorrect passcode. (Default: digitalhive-admin)");
    }
  }

  function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    upsertProduct({
      ...form,
      id: editingId ?? undefined,
      title: form.title,
      tags: form.tagsText
        ? form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      images: form.images,
    });
    setForm(emptyForm);
    setEditingId(null);
    refresh();
  }

  function editProduct(p: Product) {
    setEditingId(p.id);
    setForm({ ...p, tagsText: p.tags.join(", ") });
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeProduct(id: string) {
    deleteProduct(id);
    refresh();
  }

  function handleCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { imported } = importProductsFromCsv(String(reader.result));
      setImportResult(
        imported > 0
          ? `Successfully imported ${imported} product${imported === 1 ? "" : "s"}.`
          : "No valid rows found. Check your CSV headers.",
      );
      refresh();
    };
    reader.readAsText(file);
  }

  function loadSampleCsv() {
    const sample = `Product Name,Description,Category,Image URL,Etsy URL,Tags
Modern Pitch Deck Template,Investor-ready pitch deck in 20 slides,Business Templates,https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80,https://www.etsy.com/listing/000/pitch-deck,pitch deck;startup;business
Wedding Guest List Tracker,Printable guest list and RSVP tracker,Printable Forms,https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80,https://www.etsy.com/listing/000/wedding-tracker,wedding;printable;planner`;
    const { imported } = importProductsFromCsv(sample);
    setImportResult(`Imported ${imported} sample products.`);
    refresh();
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-center text-xl font-bold">Admin Access</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Enter the passcode to manage DigitalHive.
          </p>
          <form onSubmit={login} className="mt-6 space-y-3">
            <Input
              type="password"
              placeholder="Passcode"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Unlock Dashboard
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Products", value: allCount, icon: Boxes },
    { label: "Admin-Created", value: adminProducts.length, icon: Plus },
    { label: "Categories", value: categories.length, icon: FolderTree },
    { label: "Blog Posts", value: blogPosts.length, icon: Newspaper },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage products, imports, and content.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sessionStorage.removeItem("dh-admin");
            setAuthed(false);
          }}
        >
          Sign out
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview / Analytics */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-2 text-3xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Connect your analytics</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set <code className="rounded bg-muted px-1">NEXT_PUBLIC_GA_ID</code>{" "}
              in your environment to stream live page views, Etsy click
              tracking, product clicks, and newsletter signups into Google
              Analytics. Outbound Etsy clicks fire a{" "}
              <code className="rounded bg-muted px-1">etsy_click</code> event
              automatically.
            </p>
          </div>
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={saveProduct}
            className="space-y-4 rounded-xl border bg-card p-6"
          >
            <h2 className="font-semibold">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="short">Short description</Label>
              <Input
                id="short"
                value={form.shortDescription ?? ""}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={3}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://..."
                value={form.images?.[0] ?? ""}
                onChange={(e) =>
                  setForm({ ...form, images: [e.target.value] })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="etsy">Etsy URL</Label>
              <Input
                id="etsy"
                placeholder="https://www.etsy.com/listing/..."
                value={form.etsyUrl ?? ""}
                onChange={(e) => setForm({ ...form, etsyUrl: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={form.tagsText ?? ""}
                onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {(["featured", "bestseller", "newArrival"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form[k])}
                    onChange={(e) =>
                      setForm({ ...form, [k]: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  {k}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Save changes" : "Add product"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div>
            <h2 className="mb-3 font-semibold">
              Your products ({adminProducts.length})
            </h2>
            {adminProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No admin-created products yet. Add one with the form, or import a
                CSV.
              </div>
            ) : (
              <div className="space-y-3">
                {adminProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 rounded-xl border bg-card p-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{p.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{p.category}</span>
                        {p.featured && <Badge variant="secondary">Featured</Badge>}
                        <span className="inline-flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-honey-400 text-honey-400" />
                          {p.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => editProduct(p)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeProduct(p.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSV Import */}
      {tab === "import" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Bulk import via CSV</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a CSV with the columns below. Product pages are generated
              automatically from each row.
            </p>
            <div className="mt-4 overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted">
                  <tr>
                    {[
                      "Product Name",
                      "Description",
                      "Category",
                      "Image URL",
                      "Etsy URL",
                      "Tags",
                    ].map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-muted-foreground">
                    <td className="px-3 py-2">Pitch Deck</td>
                    <td className="px-3 py-2">20-slide deck</td>
                    <td className="px-3 py-2">Business Templates</td>
                    <td className="px-3 py-2">https://...</td>
                    <td className="px-3 py-2">https://etsy.com/...</td>
                    <td className="px-3 py-2">deck;startup</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Tags can be separated by semicolons or pipes. Categories are
              matched by name.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm hover:border-primary">
                <FileUp className="h-5 w-5 text-primary" />
                Choose CSV file
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleCsv}
                />
              </label>
            </div>
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={loadSampleCsv}>
                Import sample rows
              </Button>
            </div>
            {importResult && (
              <p className="mt-3 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                {importResult}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {tab === "categories" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.slug} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.description}
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                Slug: <code className="rounded bg-muted px-1">{c.slug}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog */}
      {tab === "blog" && (
        <div className="space-y-3">
          {blogPosts.map((p) => (
            <div
              key={p.slug}
              className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.category} · {p.author.name} · {p.publishedAt}
                </div>
              </div>
              <Badge variant="secondary">{p.readingMinutes} min</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
