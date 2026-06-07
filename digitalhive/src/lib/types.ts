export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: string; // category slug
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  etsyUrl: string;
  rating: number;
  reviewCount: number;
  price?: number;
  features?: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  image?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown-ish
  category: string;
  coverImage: string;
  author: Author;
  publishedAt: string; // ISO date
  readingMinutes: number;
  tags: string[];
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type SortOption =
  | "featured"
  | "newest"
  | "rating"
  | "popular"
  | "title-asc"
  | "title-desc";
