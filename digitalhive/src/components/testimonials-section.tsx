"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <motion.figure
          key={t.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
          className="relative flex flex-col rounded-xl border bg-card p-6 shadow-sm"
        >
          <Quote className="mb-3 h-7 w-7 text-primary/30" />
          <StarRating rating={t.rating} />
          <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <Image
              src={t.avatar}
              alt={t.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
