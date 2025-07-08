import { BlogPost } from "@/types/blog";
import { creditBasicsPosts } from "./creditBasics";
import { tradelinesPosts } from "./tradelines";
import { covidAndCpnPosts } from "./covidAndCpn";

// Combine all blog posts from different categories
export const allBlogPosts: BlogPost[] = [
  ...creditBasicsPosts,
  ...tradelinesPosts,
  ...covidAndCpnPosts,
  // Additional categories can be added here as separate imports
];

// Export individual categories for organization
export { creditBasicsPosts, tradelinesPosts, covidAndCpnPosts };