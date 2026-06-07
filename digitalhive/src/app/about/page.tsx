import Image from "next/image";
import { Compass, Heart, Sparkles, Target, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBanner } from "@/components/cta-banner";
import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "DigitalHive is a premium marketplace for digital products, built to help creators reach more customers and help buyers discover quality downloads.",
  path: "/about",
});

const values = [
  {
    icon: Sparkles,
    title: "Quality First",
    description:
      "We curate, not aggregate. Every product earns its place through design and usefulness.",
  },
  {
    icon: Heart,
    title: "Creator-Friendly",
    description:
      "We exist to send creators more traffic and sales — your success is our success.",
  },
  {
    icon: Users,
    title: "Buyer Trust",
    description:
      "Transparent, secure, and honest. Buyers should feel confident with every click.",
  },
  {
    icon: Compass,
    title: "Always Improving",
    description:
      "We iterate relentlessly — from a discovery storefront today to a full marketplace tomorrow.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: "About" }]} />

        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            Our story
          </span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Premium digital products,{" "}
            <span className="gradient-text">all in one hive</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            DigitalHive was born from a simple frustration: incredible digital
            products were scattered, hard to find, and even harder to trust. We
            set out to build a beautiful, curated home for the best templates,
            planners, ebooks, and assets — and a launchpad for the creators
            behind them.
          </p>
        </div>

        <div className="relative mx-auto my-12 aspect-[16/7] max-w-5xl overflow-hidden rounded-2xl border">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="The DigitalHive team collaborating"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        {/* Mission */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 text-muted-foreground">
              To be the most trusted marketplace for digital products — helping
              buyers discover exactly what they need, and helping creators turn
              their work into a thriving business. We bridge discovery and
              checkout today through Etsy, and we&apos;re building toward a full
              standalone marketplace.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl font-bold">Why We Exist</h2>
            <p className="mt-3 text-muted-foreground">
              Digital products are the future of work and creativity. But great
              products deserve a great storefront. DigitalHive gives creators a
              premium brand to be discovered through, and gives buyers a
              curated, high-trust place to shop with confidence.
            </p>
          </div>
        </div>

        {/* Values */}
        <section className="mx-auto mt-16 max-w-5xl">
          <SectionHeading
            eyebrow="What we stand for"
            title="Our Values"
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto mt-16 max-w-4xl rounded-2xl border bg-secondary/40 p-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: "10+", label: "Categories" },
              { value: "500+", label: "Curated products" },
              { value: "12k+", label: "Happy customers" },
              { value: "4.8★", label: "Average rating" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-primary">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CtaBanner
        title="Join the hive"
        description="Discover premium digital products or get your work in front of thousands of buyers."
      />
    </>
  );
}
