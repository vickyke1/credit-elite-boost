import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner({
  title = "Ready to find your next digital product?",
  description = "Browse hundreds of premium templates, planners, and assets — checkout securely on Etsy.",
  primaryHref = "/marketplace",
  primaryLabel = "Browse Marketplace",
  secondaryHref = "/categories",
  secondaryLabel = "View Categories",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="container-page py-16">
      <div className="relative overflow-hidden rounded-2xl gradient-honey px-6 py-14 text-center shadow-lg sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-honey-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-honey-950/80">
            {description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-honey-950 text-white hover:bg-honey-950/90"
            >
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-honey-950/30 bg-white/30 text-honey-950 hover:bg-white/50"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
