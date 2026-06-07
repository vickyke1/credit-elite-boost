import { StarRating } from "@/components/star-rating";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/lib/types";

export function ReviewsSection({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
        <div>
          <StarRating rating={rating} size="md" />
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {reviewCount.toLocaleString()} reviews
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <StarRating rating={review.rating} />
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.date)}
                </span>
              </div>
              <h4 className="font-semibold">{review.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
              <p className="mt-3 text-sm font-medium">— {review.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
