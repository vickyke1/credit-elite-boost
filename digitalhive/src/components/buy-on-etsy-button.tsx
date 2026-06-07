"use client";

import { ExternalLink, ShoppingBag } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackEtsyClick } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BuyOnEtsyButtonProps extends ButtonProps {
  product: Product;
  label?: string;
}

export function BuyOnEtsyButton({
  product,
  label = "Buy on Etsy",
  className,
  ...props
}: BuyOnEtsyButtonProps) {
  const href = product.etsyUrl || "https://www.etsy.com";

  return (
    <Button
      asChild
      className={cn("group", className)}
      onClick={() => trackEtsyClick(product)}
      {...props}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={`Buy ${product.title} on Etsy`}
      >
        <ShoppingBag className="transition-transform group-hover:-translate-y-0.5" />
        {label}
        <ExternalLink className="opacity-70" />
      </a>
    </Button>
  );
}
