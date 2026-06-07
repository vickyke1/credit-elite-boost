import Link from "next/link";
import { Hexagon, Instagram, Twitter, Youtube } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { categories } from "@/lib/data/categories";
import { siteConfig } from "@/lib/seo";

const footerNav = {
  Marketplace: [
    { label: "All Products", href: "/marketplace" },
    { label: "Categories", href: "/categories" },
    { label: "Bestsellers", href: "/marketplace?sort=popular" },
    { label: "New Arrivals", href: "/marketplace?sort=newest" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Admin", href: "/admin" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg gradient-honey text-honey-950">
                <Hexagon className="h-5 w-5 fill-honey-950/10" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Digital<span className="text-primary">Hive</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {siteConfig.tagline} The marketplace for digital creators —
              premium templates, planners, ebooks, and assets for modern
              professionals.
            </p>
            <div className="mt-6 max-w-sm">
              <p className="mb-2 text-sm font-semibold">
                Get new products & deals
              </p>
              <NewsletterForm source="footer" />
            </div>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold">Top Categories</h3>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs">
            DigitalHive is a discovery platform. Purchases are completed on
            Etsy.
          </p>
        </div>
      </div>
    </footer>
  );
}
