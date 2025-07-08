import { BlogPost } from "@/types/blog";
import { allBlogPosts } from "@/data/blogPosts";

export const getAllBlogPosts = (): BlogPost[] => {
  return allBlogPosts;
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return allBlogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return allBlogPosts.filter(post => post.featured);
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return allBlogPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  // This could be extended to filter by category if we add categories to BlogPost interface
  return allBlogPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
  );
};

export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  return allBlogPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
};