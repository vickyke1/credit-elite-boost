import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  className,
}: StarRatingProps) {
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i;
          return (
            <Star
              key={i}
              className={cn(
                dimension,
                filled || half
                  ? "fill-honey-400 text-honey-400"
                  : "fill-muted text-muted-foreground/40",
              )}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && (
          <span className="ml-1 text-muted-foreground/70">
            ({reviewCount.toLocaleString()})
          </span>
        )}
      </span>
    </div>
  );
}
