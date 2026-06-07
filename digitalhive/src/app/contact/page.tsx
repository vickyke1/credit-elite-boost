import { Mail, MessageSquare, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { FaqAccordion } from "@/components/faq-accordion";
import { SectionHeading } from "@/components/section-heading";
import { generalFaqs } from "@/lib/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with the DigitalHive team. Questions about a product, a partnership, or selling with us? We're here to help.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-2 text-muted-foreground">
          Have a question about a product, a partnership idea, or want to sell
          with us? Drop us a line and we&apos;ll respond within 24 hours.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>

        <aside className="space-y-4">
          {[
            {
              icon: Mail,
              title: "Email us",
              lines: ["hello@digitalhive.com", "support@digitalhive.com"],
            },
            {
              icon: MessageSquare,
              title: "Product support",
              lines: [
                "For purchases, contact the seller via your Etsy order.",
              ],
            },
            {
              icon: Clock,
              title: "Response time",
              lines: ["Within 24 hours, Monday–Friday."],
            },
          ].map(({ icon: Icon, title, lines }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border bg-card p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                {lines.map((l) => (
                  <p key={l} className="text-sm text-muted-foreground">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>

      <section className="mx-auto mt-16 max-w-3xl border-t pt-12">
        <SectionHeading title="Frequently asked questions" align="center" />
        <FaqAccordion items={generalFaqs} />
      </section>
    </div>
  );
}
