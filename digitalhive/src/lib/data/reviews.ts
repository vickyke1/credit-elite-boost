import type { Review } from "@/lib/types";

// A small pool of sample reviews reused on product pages for demo purposes.
export const sampleReviews: Review[] = [
  {
    id: "r1",
    author: "Jessica P.",
    rating: 5,
    date: "2026-05-18",
    title: "Exceeded my expectations",
    body: "Absolutely beautiful and so easy to customize. Downloaded instantly from Etsy with zero issues. Will buy again!",
  },
  {
    id: "r2",
    author: "Michael B.",
    rating: 5,
    date: "2026-05-09",
    title: "Worth every penny",
    body: "Professional quality and saved me hours of work. The instructions were clear and the files opened perfectly.",
  },
  {
    id: "r3",
    author: "Hannah G.",
    rating: 4,
    date: "2026-04-30",
    title: "Great value",
    body: "Really happy with this. Took me a few minutes to figure out the editing, but the result looks fantastic.",
  },
  {
    id: "r4",
    author: "Tom R.",
    rating: 5,
    date: "2026-04-21",
    title: "Highly recommend",
    body: "Exactly as described. Clean design, easy to use, and the seller was super responsive on Etsy.",
  },
];
