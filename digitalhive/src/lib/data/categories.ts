import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "business-templates",
    name: "Business Templates",
    description:
      "Pitch decks, invoices, proposals, and pro documents to run and grow your business.",
    icon: "Briefcase",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "medical-documents",
    name: "Medical Documents",
    description:
      "Clinical forms, intake sheets, and healthcare templates for practices and patients.",
    icon: "Stethoscope",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "education-resources",
    name: "Education Resources",
    description:
      "Lesson plans, worksheets, and classroom tools for teachers and learners.",
    icon: "GraduationCap",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "resume-templates",
    name: "Resume Templates",
    description:
      "ATS-friendly resumes and cover letters that help you land the interview.",
    icon: "FileText",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "digital-planners",
    name: "Digital Planners",
    description:
      "GoodNotes & iPad planners, calendars, and trackers to organize your life.",
    icon: "CalendarDays",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "printable-forms",
    name: "Printable Forms",
    description:
      "Ready-to-print checklists, trackers, and forms for home and office.",
    icon: "Printer",
    image:
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "ebooks",
    name: "Ebooks",
    description:
      "Guides and ebooks packed with actionable knowledge across every niche.",
    icon: "BookOpen",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "ai-prompts",
    name: "AI Prompts",
    description:
      "Curated prompt packs for ChatGPT, Midjourney, and other AI tools.",
    icon: "Sparkles",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "design-assets",
    name: "Design Assets",
    description:
      "Fonts, icons, mockups, and graphics to power your next creative project.",
    icon: "Palette",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "marketing-resources",
    name: "Marketing Resources",
    description:
      "Social media kits, email templates, and content calendars that convert.",
    icon: "Megaphone",
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=900&q=80",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
