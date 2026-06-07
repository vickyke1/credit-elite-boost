import type { Product } from "@/lib/types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const products: Product[] = [
  {
    id: "p01",
    title: "Ultimate Business Plan Template Kit",
    slug: "ultimate-business-plan-template-kit",
    shortDescription:
      "A complete, investor-ready business plan with financial models and pitch deck.",
    description:
      "Launch faster with a polished, investor-ready business plan. This kit includes a 32-page editable business plan document, a 15-slide pitch deck, a 3-year financial model spreadsheet, and a one-page executive summary. Designed in clean, modern typography and fully editable in Google Docs, Word, and PowerPoint.",
    images: [img("photo-1454165804606-c3d57bc86b40"), img("photo-1507925921958-8a62f3d1a50d"), img("photo-1551288049-bebda4e38f71")],
    category: "business-templates",
    tags: ["business plan", "pitch deck", "startup", "financial model", "editable"],
    featured: true,
    bestseller: true,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000001/digitalhive-business-plan-kit",
    rating: 4.9,
    reviewCount: 412,
    price: 24.0,
    features: ["32-page editable plan", "15-slide pitch deck", "3-year financial model", "Works in Google Docs, Word, PowerPoint"],
  },
  {
    id: "p02",
    title: "Minimalist Resume & Cover Letter Bundle",
    slug: "minimalist-resume-cover-letter-bundle",
    shortDescription:
      "ATS-friendly resume, cover letter, and references templates in 4 color themes.",
    description:
      "Stand out and stay ATS-friendly. This bundle includes a matching resume, cover letter, and references page in four professional color themes. Easy to edit in Microsoft Word, Google Docs, and Canva. Includes a step-by-step guide to tailoring your resume for any job.",
    images: [img("photo-1586281380349-632531db7ed4"), img("photo-1517842645767-c639042777db"), img("photo-1454165804606-c3d57bc86b40")],
    category: "resume-templates",
    tags: ["resume", "cv", "cover letter", "ats", "canva", "word"],
    featured: true,
    bestseller: true,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000002/digitalhive-resume-bundle",
    rating: 4.8,
    reviewCount: 938,
    price: 12.0,
    features: ["4 color themes", "ATS-optimized layout", "Matching cover letter", "Canva + Word + Google Docs"],
  },
  {
    id: "p03",
    title: "2026 Digital Planner for iPad & GoodNotes",
    slug: "2026-digital-planner-ipad-goodnotes",
    shortDescription:
      "Hyperlinked daily, weekly, and monthly planner for GoodNotes & Notability.",
    description:
      "Organize your entire year on your iPad. This fully hyperlinked 2026 digital planner includes daily, weekly, and monthly spreads, habit trackers, goal pages, and 12 themed sticker sheets. Optimized for GoodNotes, Notability, and Xodo.",
    images: [img("photo-1484480974693-6ca0a78fb36b"), img("photo-1499591934245-40b55745b905"), img("photo-1606857521015-7f9fcf423740")],
    category: "digital-planners",
    tags: ["planner", "goodnotes", "ipad", "2026", "hyperlinked", "stickers"],
    featured: true,
    bestseller: true,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000003/digitalhive-2026-digital-planner",
    rating: 4.9,
    reviewCount: 1247,
    price: 18.0,
    features: ["Fully hyperlinked", "Daily/weekly/monthly", "12 sticker sheets", "GoodNotes & Notability ready"],
  },
  {
    id: "p04",
    title: "Patient Intake & Medical History Forms",
    slug: "patient-intake-medical-history-forms",
    shortDescription:
      "HIPAA-conscious intake, consent, and medical history forms for clinics.",
    description:
      "A professional pack of editable patient intake forms, including new patient registration, medical history, consent to treat, and HIPAA acknowledgement. Built for small practices and telehealth providers. Editable in Word and fillable PDF.",
    images: [img("photo-1576091160550-2173dba999ef"), img("photo-1505751172876-fa1923c5c528"), img("photo-1538108149393-fbbd81895907")],
    category: "medical-documents",
    tags: ["medical", "intake form", "clinic", "healthcare", "pdf", "editable"],
    featured: false,
    bestseller: true,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000004/digitalhive-patient-intake-forms",
    rating: 4.7,
    reviewCount: 286,
    price: 15.0,
    features: ["6 essential forms", "Fillable PDF + Word", "Practice branding ready", "Telehealth friendly"],
  },
  {
    id: "p05",
    title: "Teacher Lesson Plan & Classroom Bundle",
    slug: "teacher-lesson-plan-classroom-bundle",
    shortDescription:
      "Editable lesson plans, grade trackers, and classroom decor for educators.",
    description:
      "Everything a teacher needs to plan an organized year. Includes weekly and unit lesson plan templates, a grade tracker, seating chart, behavior log, and printable classroom decor. Fully editable in Google Slides and Canva.",
    images: [img("photo-1503676260728-1c00da094a0b"), img("photo-1497633762265-9d179a990aa6"), img("photo-1522202176988-66273c2fd55f")],
    category: "education-resources",
    tags: ["lesson plan", "teacher", "classroom", "education", "google slides"],
    featured: false,
    bestseller: false,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000005/digitalhive-teacher-bundle",
    rating: 4.8,
    reviewCount: 174,
    price: 16.0,
    features: ["Weekly + unit plans", "Grade tracker", "Printable decor", "Google Slides + Canva"],
  },
  {
    id: "p06",
    title: "Home Cleaning & Chore Printable Pack",
    slug: "home-cleaning-chore-printable-pack",
    shortDescription:
      "Daily, weekly, and seasonal cleaning checklists plus a kids chore chart.",
    description:
      "Keep your home effortlessly tidy with this printable cleaning bundle. Includes daily, weekly, monthly, and deep-clean checklists, a customizable chore chart, and a reward tracker for kids. Print at home in US Letter and A4.",
    images: [img("photo-1581578731548-c64695cc6952"), img("photo-1563453392212-326f5e854473"), img("photo-1584622650111-993a426fbf0a")],
    category: "printable-forms",
    tags: ["cleaning", "checklist", "chores", "printable", "household"],
    featured: false,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000006/digitalhive-cleaning-printables",
    rating: 4.6,
    reviewCount: 521,
    price: 7.0,
    features: ["12 printable pages", "US Letter + A4", "Editable chore chart", "Instant download"],
  },
  {
    id: "p07",
    title: "Passive Income Blueprint Ebook",
    slug: "passive-income-blueprint-ebook",
    shortDescription:
      "A 120-page guide to building 7 realistic passive income streams.",
    description:
      "Stop trading time for money. This 120-page ebook breaks down seven realistic passive income streams — from digital products to dividend investing — with step-by-step action plans, tool recommendations, and worksheets. Delivered as a beautifully designed PDF.",
    images: [img("photo-1512820790803-83ca734da794"), img("photo-1481627834876-b7833e8f5570"), img("photo-1457369804613-52c61a468e7d")],
    category: "ebooks",
    tags: ["ebook", "passive income", "finance", "side hustle", "pdf"],
    featured: true,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000007/digitalhive-passive-income-ebook",
    rating: 4.7,
    reviewCount: 663,
    price: 14.0,
    features: ["120 pages", "7 income streams", "Action worksheets", "Lifetime updates"],
  },
  {
    id: "p08",
    title: "ChatGPT Prompt Pack for Marketers",
    slug: "chatgpt-prompt-pack-marketers",
    shortDescription:
      "500+ proven ChatGPT prompts for ads, emails, SEO, and social media.",
    description:
      "Write better marketing copy in seconds. This pack includes 500+ categorized ChatGPT prompts for ad copy, email sequences, SEO blogs, social captions, and product descriptions. Includes a prompt-engineering cheat sheet and a Notion database version.",
    images: [img("photo-1677442136019-21780ecad995"), img("photo-1620712943543-bcc4688e7485"), img("photo-1551434678-e076c223a692")],
    category: "ai-prompts",
    tags: ["chatgpt", "ai prompts", "marketing", "copywriting", "notion"],
    featured: true,
    bestseller: true,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000008/digitalhive-chatgpt-prompts",
    rating: 4.9,
    reviewCount: 845,
    price: 11.0,
    features: ["500+ prompts", "8 categories", "Notion database", "Prompt cheat sheet"],
  },
  {
    id: "p09",
    title: "Modern Instagram Story Templates (Canva)",
    slug: "modern-instagram-story-templates-canva",
    shortDescription:
      "150 editable Canva story templates for product, sale, and quote posts.",
    description:
      "Elevate your brand feed with 150 modern, fully editable Instagram story templates for Canva. Includes product highlights, sale announcements, testimonials, quotes, and behind-the-scenes layouts. Just click the link, edit colors and text, and publish.",
    images: [img("photo-1611162617474-5b21e879e113"), img("photo-1556155092-490a1ba16284"), img("photo-1611162616475-46b635cb6868")],
    category: "design-assets",
    tags: ["instagram", "canva", "social media", "templates", "branding"],
    featured: false,
    bestseller: true,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000009/digitalhive-instagram-templates",
    rating: 4.8,
    reviewCount: 392,
    price: 13.0,
    features: ["150 templates", "100% editable in Canva", "5 content categories", "Free font links"],
  },
  {
    id: "p10",
    title: "30-Day Social Media Content Calendar",
    slug: "30-day-social-media-content-calendar",
    shortDescription:
      "A done-for-you content calendar with 30 post ideas and captions.",
    description:
      "Never stare at a blank screen again. This 30-day content calendar gives you daily post ideas, ready-to-use captions, hashtag sets, and a posting schedule. Comes as an editable spreadsheet plus a printable PDF planner.",
    images: [img("photo-1557838923-2985c318be48"), img("photo-1611926653458-09294b3142bf"), img("photo-1432888622747-4eb9a8efeb07")],
    category: "marketing-resources",
    tags: ["content calendar", "social media", "marketing", "captions", "planner"],
    featured: false,
    bestseller: false,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000010/digitalhive-content-calendar",
    rating: 4.6,
    reviewCount: 218,
    price: 9.0,
    features: ["30 post ideas", "Ready captions", "Hashtag sets", "Editable spreadsheet"],
  },
  {
    id: "p11",
    title: "Freelance Invoice & Contract Pack",
    slug: "freelance-invoice-contract-pack",
    shortDescription:
      "Professional invoice, quote, and contract templates for freelancers.",
    description:
      "Get paid on time and protect your work. This pack includes editable invoice, estimate, and freelance service contract templates, plus a late-payment reminder email script. Editable in Word, Google Docs, and Excel.",
    images: [img("photo-1450101499163-c8848c66ca85"), img("photo-1554224155-6726b3ff858f"), img("photo-1460925895917-afdab827c52f")],
    category: "business-templates",
    tags: ["invoice", "contract", "freelance", "excel", "word"],
    featured: false,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000011/digitalhive-invoice-pack",
    rating: 4.7,
    reviewCount: 301,
    price: 10.0,
    features: ["Invoice + estimate", "Service contract", "Reminder scripts", "Word + Excel + Docs"],
  },
  {
    id: "p12",
    title: "Wedding Planning Printable Binder",
    slug: "wedding-planning-printable-binder",
    shortDescription:
      "60+ page wedding planner with budget, checklists, and vendor trackers.",
    description:
      "Plan your dream day stress-free with this 60+ page printable wedding binder. Includes budget tracker, guest list manager, vendor contacts, seating chart, timeline, and day-of checklist. Print at home or at a local shop in US Letter and A4.",
    images: [img("photo-1519225421980-715cb0215aed"), img("photo-1465495976277-4387d4b0b4c6"), img("photo-1511285560929-80b456fea0bc")],
    category: "printable-forms",
    tags: ["wedding", "planner", "printable", "budget", "checklist"],
    featured: true,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000012/digitalhive-wedding-binder",
    rating: 4.9,
    reviewCount: 487,
    price: 17.0,
    features: ["60+ pages", "Budget tracker", "Vendor manager", "US Letter + A4"],
  },
  {
    id: "p13",
    title: "Notion Second Brain & Life OS",
    slug: "notion-second-brain-life-os",
    shortDescription:
      "An all-in-one Notion template to manage tasks, notes, goals, and projects.",
    description:
      "Bring your entire life into one dashboard. This Notion Life OS combines a task manager, note vault, project tracker, habit system, and goal planner with a clean, minimal aesthetic. One-click duplicate to your workspace with a setup video included.",
    images: [img("photo-1551288049-bebda4e38f71"), img("photo-1517245386807-bb43f82c33c4"), img("photo-1499951360447-b19be8fe80f5")],
    category: "business-templates",
    tags: ["notion", "productivity", "second brain", "template", "life os"],
    featured: true,
    bestseller: true,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000013/digitalhive-notion-life-os",
    rating: 4.9,
    reviewCount: 1032,
    price: 19.0,
    features: ["One-click duplicate", "Tasks + notes + goals", "Setup video", "Lifetime updates"],
  },
  {
    id: "p14",
    title: "Procreate Lettering Brush Pack",
    slug: "procreate-lettering-brush-pack",
    shortDescription:
      "45 hand-crafted Procreate brushes for lettering and calligraphy.",
    description:
      "Level up your iPad lettering with 45 hand-tested Procreate brushes, including monoline, brush pen, textured, and shading brushes. Includes a color palette swatch file and a practice worksheet. For Procreate 5+ on iPad.",
    images: [img("photo-1513364776144-60967b0f800f"), img("photo-1452860606245-08befc0ff44b"), img("photo-1499744937866-d7e566a20a61")],
    category: "design-assets",
    tags: ["procreate", "brushes", "lettering", "calligraphy", "ipad"],
    featured: false,
    bestseller: false,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000014/digitalhive-procreate-brushes",
    rating: 4.8,
    reviewCount: 256,
    price: 8.0,
    features: ["45 brushes", "Color palette file", "Practice worksheet", "Procreate 5+"],
  },
  {
    id: "p15",
    title: "Real Estate Listing Marketing Kit",
    slug: "real-estate-listing-marketing-kit",
    shortDescription:
      "Canva flyers, social posts, and open house templates for agents.",
    description:
      "Market any listing like a pro. This Canva kit includes just-listed and just-sold flyers, open house signs, social media posts, and a buyer's guide — all editable with your branding and photos. Perfect for real estate agents and brokers.",
    images: [img("photo-1560518883-ce09059eeffa"), img("photo-1568605114967-8130f3a36994"), img("photo-1570129477492-45c003edd2be")],
    category: "marketing-resources",
    tags: ["real estate", "canva", "flyer", "marketing", "agent"],
    featured: false,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000015/digitalhive-real-estate-kit",
    rating: 4.7,
    reviewCount: 143,
    price: 21.0,
    features: ["Listing flyers", "Open house signs", "Social posts", "Editable in Canva"],
  },
  {
    id: "p16",
    title: "Budget & Expense Tracker Spreadsheet",
    slug: "budget-expense-tracker-spreadsheet",
    shortDescription:
      "Automated Google Sheets budget with charts and savings goals.",
    description:
      "Take control of your money with this automated budget tracker for Google Sheets and Excel. Track income, expenses, debt, and savings goals with built-in charts and a monthly dashboard. Includes a setup guide for beginners.",
    images: [img("photo-1554224155-8d04cb21cd6c"), img("photo-1579621970795-87facc2f976d"), img("photo-1611974789855-9c2a0a7236a3")],
    category: "business-templates",
    tags: ["budget", "spreadsheet", "google sheets", "finance", "tracker"],
    featured: false,
    bestseller: true,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000016/digitalhive-budget-tracker",
    rating: 4.8,
    reviewCount: 729,
    price: 9.0,
    features: ["Automated formulas", "Dashboard + charts", "Google Sheets + Excel", "Beginner guide"],
  },
  {
    id: "p17",
    title: "Kids Homeschool Worksheet Mega Bundle",
    slug: "kids-homeschool-worksheet-mega-bundle",
    shortDescription:
      "300+ printable worksheets for math, reading, and writing (PreK–3).",
    description:
      "Make learning fun at home with 300+ printable worksheets covering math, phonics, reading, handwriting, and science for PreK through Grade 3. Organized by subject and difficulty, ready to print in US Letter and A4.",
    images: [img("photo-1503454537195-1dcabb73ffb9"), img("photo-1587654780291-39c9404d746b"), img("photo-1509062522246-3755977927d7")],
    category: "education-resources",
    tags: ["homeschool", "worksheets", "kids", "printable", "math", "reading"],
    featured: false,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000017/digitalhive-homeschool-bundle",
    rating: 4.7,
    reviewCount: 358,
    price: 12.0,
    features: ["300+ worksheets", "PreK–Grade 3", "Subject organized", "US Letter + A4"],
  },
  {
    id: "p18",
    title: "Telehealth Practice Starter Documents",
    slug: "telehealth-practice-starter-documents",
    shortDescription:
      "Consent forms, policies, and intake docs to launch a telehealth practice.",
    description:
      "Launch your telehealth or coaching practice with confidence. This document pack includes a telehealth consent form, privacy policy, intake questionnaire, no-show policy, and welcome packet. Editable in Word and Google Docs.",
    images: [img("photo-1559757148-5c350d0d3c56"), img("photo-1576765608535-5f04d1e3f289"), img("photo-1551076805-e1869033e561")],
    category: "medical-documents",
    tags: ["telehealth", "consent form", "policy", "practice", "editable"],
    featured: false,
    bestseller: false,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000018/digitalhive-telehealth-docs",
    rating: 4.6,
    reviewCount: 97,
    price: 22.0,
    features: ["Consent + policies", "Intake questionnaire", "Welcome packet", "Word + Google Docs"],
  },
  {
    id: "p19",
    title: "Email Newsletter Template Library",
    slug: "email-newsletter-template-library",
    shortDescription:
      "25 high-converting email templates for Mailchimp, Klaviyo, and Canva.",
    description:
      "Send emails people actually open. This library includes 25 proven email templates — welcome series, product launches, abandoned cart, and re-engagement — with copy frameworks and subject-line swipe files. Compatible with Mailchimp, Klaviyo, and Canva.",
    images: [img("photo-1596526131083-e8c633c948d2"), img("photo-1633265486064-086b219458ec"), img("photo-1526628953301-3e589a6a8b74")],
    category: "marketing-resources",
    tags: ["email", "newsletter", "mailchimp", "klaviyo", "templates"],
    featured: true,
    bestseller: false,
    newArrival: true,
    etsyUrl: "https://www.etsy.com/listing/000000019/digitalhive-email-templates",
    rating: 4.8,
    reviewCount: 184,
    price: 15.0,
    features: ["25 templates", "Copy frameworks", "Subject-line swipes", "Mailchimp + Klaviyo"],
  },
  {
    id: "p20",
    title: "Self-Care & Wellness Journal (Printable)",
    slug: "self-care-wellness-journal-printable",
    shortDescription:
      "A 50-page printable journal for mood, gratitude, and habit tracking.",
    description:
      "Prioritize your wellbeing with this beautifully designed 50-page printable wellness journal. Includes mood trackers, gratitude prompts, habit grids, meal and water logs, and weekly reflections. Print at home or use on your tablet as a PDF.",
    images: [img("photo-1517842645767-c639042777db"), img("photo-1499728603263-13726abce5fd"), img("photo-1506784983877-45594efa4cbe")],
    category: "ebooks",
    tags: ["journal", "wellness", "self-care", "printable", "gratitude"],
    featured: false,
    bestseller: false,
    newArrival: false,
    etsyUrl: "https://www.etsy.com/listing/000000020/digitalhive-wellness-journal",
    rating: 4.9,
    reviewCount: 612,
    price: 8.0,
    features: ["50 pages", "Mood + habit trackers", "Gratitude prompts", "Print or tablet"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(
      products.filter(
        (p) => p.id !== product.id && p.category !== product.category,
      ),
    )
    .slice(0, limit);
}

export const featuredProducts = products.filter((p) => p.featured);
export const bestsellerProducts = products.filter((p) => p.bestseller);
export const newArrivals = products.filter((p) => p.newArrival);
