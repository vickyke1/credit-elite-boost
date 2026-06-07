import type { BlogPost } from "@/lib/types";
import { authors } from "@/lib/data/authors";

const cover = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-sell-digital-products-on-etsy",
    title: "How to Sell Digital Products on Etsy in 2026 (Beginner's Guide)",
    excerpt:
      "A step-by-step guide to launching your first digital product on Etsy — from idea to first sale.",
    coverImage: cover("photo-1556742502-ec7c0e9f34b1"),
    category: "Selling Online",
    author: authors.maya,
    publishedAt: "2026-05-28",
    readingMinutes: 9,
    tags: ["etsy", "digital products", "beginners"],
    content: `## Why digital products?\n\nDigital products are the dream side hustle: you create once and sell forever, with no inventory, shipping, or packaging. On Etsy, buyers are already searching for templates, planners, and printables every single day.\n\n## Step 1 — Pick a proven niche\n\nStart where demand already exists. Resume templates, digital planners, and small-business documents consistently sell well. Use Etsy search autocomplete to validate that real shoppers are looking for your idea.\n\n## Step 2 — Create a polished product\n\nQuality wins. Use clean typography, consistent spacing, and a cohesive color palette. Deliver in the formats your buyers expect (PDF, Canva links, Word, Google Docs).\n\n## Step 3 — Write a keyword-rich listing\n\nYour title, tags, and description are your SEO. Lead with the exact phrase a buyer would type, then support it with related keywords.\n\n## Step 4 — Drive outside traffic\n\nThis is where DigitalHive comes in. A branded storefront lets you rank on Google, build trust, and funnel shoppers straight to your Etsy checkout.\n\n## Step 5 — Iterate with reviews\n\nYour first reviews are gold. Ask happy buyers for feedback, then refine your product and listing based on what they say.`,
  },
  {
    slug: "best-selling-digital-products-2026",
    title: "15 Best-Selling Digital Products to Create in 2026",
    excerpt:
      "Looking for a profitable digital product idea? These 15 categories are dominating marketplaces this year.",
    coverImage: cover("photo-1556761175-b413da4baf72"),
    category: "Ideas",
    author: authors.maya,
    publishedAt: "2026-05-20",
    readingMinutes: 7,
    tags: ["ideas", "digital products", "trends"],
    content: `## What makes a product sell?\n\nThe best-sellers solve a specific, urgent problem for a clearly defined buyer. Here are 15 categories that are thriving in 2026.\n\n1. Digital planners for iPad\n2. Resume and cover letter templates\n3. ChatGPT and AI prompt packs\n4. Notion templates and dashboards\n5. Social media template kits\n6. Small-business document bundles\n7. Printable wall art\n8. Budget and finance spreadsheets\n9. Wedding planning printables\n10. Teacher and classroom resources\n11. Procreate brushes and design assets\n12. Email marketing template libraries\n13. Self-care and wellness journals\n14. Homeschool worksheet bundles\n15. Real estate marketing kits\n\n## Pick one and go deep\n\nDon't spread yourself thin. Choose one category, become the best at it, and expand from there.`,
  },
  {
    slug: "etsy-seo-tips-rank-higher",
    title: "Etsy SEO: 12 Tips to Rank Higher and Get More Sales",
    excerpt:
      "Master Etsy search with these 12 actionable SEO tips that move listings to page one.",
    coverImage: cover("photo-1432888622747-4eb9a8efeb07"),
    category: "SEO",
    author: authors.jordan,
    publishedAt: "2026-05-12",
    readingMinutes: 8,
    tags: ["etsy", "seo", "traffic"],
    content: `## Etsy SEO is keyword matching\n\nEtsy's algorithm matches a shopper's query to your listing's title, tags, and attributes — then ranks by relevance and quality.\n\n## The 12 tips\n\n1. Put your strongest keyword phrase first in the title.\n2. Use all 13 tags with multi-word phrases.\n3. Match tags to title phrases.\n4. Fill in every attribute.\n5. Write for humans in the description, keywords included.\n6. Refresh stale listings.\n7. Encourage reviews to boost quality score.\n8. Use long-tail keywords with less competition.\n9. Avoid repeating single words.\n10. Add a compelling first photo.\n11. Keep your shop conversion rate healthy.\n12. Drive external traffic from a branded site like DigitalHive.\n\n## Combine on-site and off-site SEO\n\nRanking on Google with your own marketplace multiplies your Etsy visibility.`,
  },
  {
    slug: "pricing-digital-products",
    title: "How to Price Your Digital Products (Without Guessing)",
    excerpt:
      "A simple framework for pricing templates, planners, and downloads to maximize revenue.",
    coverImage: cover("photo-1554224155-6726b3ff858f"),
    category: "Selling Online",
    author: authors.maya,
    publishedAt: "2026-05-04",
    readingMinutes: 6,
    tags: ["pricing", "strategy"],
    content: `## Value, not cost\n\nDigital products have near-zero marginal cost, so price on the value you deliver, not the time you spent.\n\n## The 3-tier method\n\nOffer a simple, a standard, and a premium bundle. Most buyers choose the middle option, which anchors your pricing.\n\n## Test and adjust\n\nStart in a healthy range for your niche, watch conversion, and nudge price up as reviews build trust.`,
  },
  {
    slug: "canva-vs-photoshop-for-templates",
    title: "Canva vs Photoshop: Which Is Better for Selling Templates?",
    excerpt:
      "Both tools can build sellable templates. Here's how to choose the right one for your shop.",
    coverImage: cover("photo-1626785774573-4b799315345d"),
    category: "Tools",
    author: authors.priya,
    publishedAt: "2026-04-26",
    readingMinutes: 5,
    tags: ["canva", "photoshop", "design", "tools"],
    content: `## Canva: speed and accessibility\n\nCanva templates are buyer-friendly — your customers can edit them in the browser with no software. Perfect for social kits and simple documents.\n\n## Photoshop: power and polish\n\nPhotoshop gives you pixel-perfect control for complex design assets and mockups, but raises the skill bar for buyers.\n\n## The verdict\n\nFor most digital sellers, Canva wins on buyer experience. Reserve Photoshop for premium, designer-focused assets.`,
  },
  {
    slug: "build-email-list-digital-shop",
    title: "How to Build an Email List for Your Digital Product Shop",
    excerpt:
      "Email is the highest-ROI channel for creators. Here's how to start your list from zero.",
    coverImage: cover("photo-1526628953301-3e589a6a8b74"),
    category: "Marketing",
    author: authors.jordan,
    publishedAt: "2026-04-18",
    readingMinutes: 7,
    tags: ["email", "marketing", "list building"],
    content: `## Why email beats social\n\nYou own your email list. Algorithms can't bury it, and subscribers convert far better than passive followers.\n\n## Offer a lead magnet\n\nGive away a small, genuinely useful freebie — a mini template or checklist — in exchange for an email.\n\n## Nurture, then sell\n\nSend value-first emails, build trust, and recommend your paid products naturally. A newsletter signup on your DigitalHive site is the perfect starting point.`,
  },
  {
    slug: "digital-planner-trends-2026",
    title: "Digital Planner Trends Shaping 2026",
    excerpt:
      "From AI-assisted layouts to minimalist aesthetics, here's what's hot in digital planning.",
    coverImage: cover("photo-1484480974693-6ca0a78fb36b"),
    category: "Trends",
    author: authors.priya,
    publishedAt: "2026-04-10",
    readingMinutes: 5,
    tags: ["planners", "trends", "design"],
    content: `## Minimalism rules\n\nClean, distraction-free layouts with plenty of white space continue to dominate buyer preferences.\n\n## Hyperlinking is expected\n\nBuyers now expect fully hyperlinked navigation in GoodNotes and Notability — it's a baseline, not a bonus.\n\n## Customization sells\n\nOffer multiple color themes and undated versions so buyers can make the planner their own.`,
  },
  {
    slug: "passive-income-myths",
    title: "5 Passive Income Myths That Keep Creators Broke",
    excerpt:
      "Passive income is real — but these five myths set new creators up to fail. Let's bust them.",
    coverImage: cover("photo-1579621970563-ebec7560ff3e"),
    category: "Mindset",
    author: authors.maya,
    publishedAt: "2026-04-02",
    readingMinutes: 6,
    tags: ["passive income", "mindset"],
    content: `## Myth 1 — It's truly hands-off\n\nDigital products need upkeep: marketing, updates, and customer support. "Passive" means leveraged, not effortless.\n\n## Myth 2 — One product is enough\n\nA catalog beats a single hit. More quality listings means more chances to rank and sell.\n\n## Myth 3 — Build it and they'll come\n\nTraffic doesn't appear on its own. SEO and a branded storefront do the heavy lifting.\n\n## Myth 4 — You need to be a designer\n\nTools like Canva have lowered the bar. Clarity and usefulness beat fancy design.\n\n## Myth 5 — It happens overnight\n\nMost shops compound over months. Consistency is the real secret.`,
  },
  {
    slug: "best-ai-prompts-for-creators",
    title: "The Best AI Prompts Every Digital Creator Should Steal",
    excerpt:
      "Use these ChatGPT prompts to write listings, brainstorm products, and create content faster.",
    coverImage: cover("photo-1677442136019-21780ecad995"),
    category: "AI",
    author: authors.jordan,
    publishedAt: "2026-03-25",
    readingMinutes: 6,
    tags: ["ai", "chatgpt", "productivity"],
    content: `## Listing copy in seconds\n\n"Write an Etsy listing title and 13 tags for a [product], targeting [audience], using high-search keywords."\n\n## Product brainstorming\n\n"Give me 20 digital product ideas in the [niche] category that solve a specific problem for [buyer]."\n\n## Content repurposing\n\n"Turn this blog post into 5 social captions and an email newsletter."\n\n## Pro tip\n\nGrab a curated prompt pack so you're not starting from a blank page every time.`,
  },
  {
    slug: "from-etsy-to-own-store",
    title: "From Etsy to Your Own Store: When and How to Scale",
    excerpt:
      "Etsy is a fantastic launchpad — but here's how to graduate to your own marketplace brand.",
    coverImage: cover("photo-1556155092-490a1ba16284"),
    category: "Growth",
    author: authors.maya,
    publishedAt: "2026-03-17",
    readingMinutes: 8,
    tags: ["growth", "etsy", "branding"],
    content: `## Start on Etsy\n\nEtsy gives you instant access to millions of buyers and handles checkout, so it's the perfect place to validate.\n\n## Build your brand in parallel\n\nA branded site like DigitalHive lets you rank on Google, capture emails, and control the customer experience — while Etsy still handles payment.\n\n## Add direct payments when ready\n\nOnce you have steady traffic and an email list, layer in direct checkout to keep more margin. You don't have to choose — run both.\n\n## The funnel that scales\n\nGoogle → DigitalHive storefront → Etsy checkout today, your own checkout tomorrow.`,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .concat(blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category))
    .slice(0, limit);
}

export const blogCategories = Array.from(new Set(blogPosts.map((p) => p.category)));
