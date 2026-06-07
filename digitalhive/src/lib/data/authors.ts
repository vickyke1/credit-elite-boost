import type { Author } from "@/lib/types";

export const authors: Record<string, Author> = {
  maya: {
    name: "Maya Chen",
    role: "Founder & Digital Strategist",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    bio: "Maya founded DigitalHive after a decade building digital product shops. She writes about selling on Etsy and growing a creator business.",
  },
  jordan: {
    name: "Jordan Blake",
    role: "Content & SEO Lead",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bio: "Jordan helps creators get found on Google. He covers SEO, content marketing, and traffic strategy for digital sellers.",
  },
  priya: {
    name: "Priya Nair",
    role: "Design & Templates Editor",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    bio: "Priya is a product designer obsessed with beautiful, usable templates. She reviews the tools and assets that creators love.",
  },
};
