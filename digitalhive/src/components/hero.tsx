"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";

const stats = [
  { icon: Download, label: "Instant downloads" },
  { icon: BadgeCheck, label: "Hand-picked quality" },
  { icon: Star, label: "4.8 average rating" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-accent/60 to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-honey-300/40 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />
      </div>

      <div className="container-page py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            The marketplace for digital creators
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
            Discover <span className="gradient-text">Premium</span> Digital
            Products
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            Templates, planners, ebooks, design assets, and AI prompts — curated
            for modern professionals. Find what you need here, then check out
            securely on Etsy.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3">
            <SearchBar />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/marketplace">
                  Browse Marketplace
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {stats.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
