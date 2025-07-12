import { useParams, Link, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug, getAllBlogPosts } from "@/utils/blogHelpers";
import { ChevronLeft } from "lucide-react";
import { SecureContent } from "@/components/SecureContent";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Get related posts (same tags, excluding current post)
  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      <Navigation />
      
      <article className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Hero Image */}
          <div className="aspect-video bg-muted rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-8xl opacity-20">📊</span>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {post.author}</span>
              <span>•</span>
              <time>{post.publishDate}</time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-xl text-muted-foreground mb-8 italic border-l-4 border-muted pl-6">
              {post.excerpt}
            </div>
            
            <SecureContent 
              content={post.content}
              className="blog-content"
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Tags:</span>
              {post.tags.map((tag) => (
                <Link 
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                >
                  <Badge variant="outline" className="hover:bg-muted hover:text-foreground transition-colors">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Link to="/blog">
                <Button variant="outline">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Published on {post.publishDate}
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-16 px-6 border-t border-border">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center mt-16">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-card rounded-lg p-6 border hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold mb-2 group-hover:text-foreground transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{relatedPost.readTime}</span>
                      <span>•</span>
                      <span>{relatedPost.publishDate}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;