import { BlogPost } from "@/types/blog";
import { creditBasicsPosts } from "./creditBasics";
import { tradelinesPosts } from "./tradelines";
import { covidAndCpnPosts } from "./covidAndCpn";
import { creditCardsPosts } from "./creditCards";
import { businessCreditPosts } from "./businessCredit";
import { creditRepairPosts } from "./creditRepair";
import { mortgageCreditPosts } from "./mortgageCredit";
import { personalFinancePosts } from "./personalFinance";

// Combine all blog posts from different categories
export const allBlogPosts: BlogPost[] = [
  ...creditBasicsPosts,
  ...tradelinesPosts,
  ...covidAndCpnPosts,
  ...creditCardsPosts,
  ...businessCreditPosts,
  ...creditRepairPosts,
  ...mortgageCreditPosts,
  ...personalFinancePosts,
];

// Export individual categories for organization
export { 
  creditBasicsPosts, 
  tradelinesPosts, 
  covidAndCpnPosts,
  creditCardsPosts,
  businessCreditPosts,
  creditRepairPosts,
  mortgageCreditPosts,
  personalFinancePosts
};