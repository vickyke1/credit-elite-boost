import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllBlogPosts, getFeaturedPosts, getPostsByTag } from "@/utils/blogHelpers";
import SEOHead from "@/components/SEOHead";
import EmailSignup from "@/components/EmailSignup";
import { Search, X } from "lucide-react";

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedPosts();
  
  const displayPosts = selectedTag ? getPostsByTag(selectedTag) : allPosts;
  
  // Filter by search query
  const filteredPosts = displayPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get all unique tags and organize by category
  const allTags = Array.from(
    new Set(allPosts.flatMap(post => post.tags))
  ).sort();
  
  // Categorize tags
  const tagCategories = {
    "Credit Building": allTags.filter(tag => 
      ["Credit Building", "Credit Score", "Credit Reports", "Credit Monitoring", "Credit Management", "Credit Strategy", "Credit Utilization", "Credit Recovery"].includes(tag)
    ),
    "Credit Repair": allTags.filter(tag =>
      ["Credit Repair", "Credit Disputes", "Dispute Letters", "Credit Repair Companies", "Credit Report Errors", "Goodwill Letters", "Pay for Delete", "DIY"].includes(tag)
    ),
    "Business Credit": allTags.filter(tag =>
      ["Business Credit", "Business Credit Cards", "Business Credit Scores", "Business Credit Monitoring", "Business Credit Repair", "EIN", "D-U-N-S Number", "LLC", "Vendor Credit", "SBA Loans"].includes(tag)
    ),
    "Credit Cards": allTags.filter(tag =>
      ["Credit Cards", "Rewards", "Cash Back", "Travel Rewards", "Balance Transfer", "Secured Cards", "Student Cards", "Annual Fees", "APR"].includes(tag)
    ),
    "Mortgages & Loans": allTags.filter(tag =>
      ["Mortgage", "FHA Loans", "VA Loans", "Conventional Loans", "Jumbo Loans", "Refinancing", "Pre-approval", "Down Payment", "Home Buying"].includes(tag)
    ),
    "Financial Wellness": allTags.filter(tag =>
      ["Financial Planning", "Budgeting", "Savings", "Emergency Fund", "Debt Management", "Financial Goals", "Financial Literacy", "Mental Health", "Anxiety Management"].includes(tag)
    ),
    "Tradelines & CPNs": allTags.filter(tag =>
      ["Tradelines", "CPN", "COVID-19", "Identity Protection", "SSN", "FCRA"].includes(tag)
    ),
  };
  
  const popularTags = allTags.slice(0, 12);

  return (
    <>
      <SEOHead
        title="Credit & Finance Blog - Expert Credit Tips | CPN Credit Boost"
        description="Expert insights, tips, and strategies to help you master your credit and achieve financial success. Learn about CPNs, tradelines, and credit building."
        keywords="credit tips, credit building, CPN guide, tradeline education, credit repair advice, financial success, credit score tips"
        canonicalUrl="https://cpncreditboost.com/blog"
      />
      <div className="min-h-screen bg-background relative">
        <ParticlesBackground />
        <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Credit & Finance Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Expert insights, tips, and strategies to help you master your credit and achieve financial success.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-6xl opacity-20">📊</span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.publishDate}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles by title, topic, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Active Filter Display */}
              {selectedTag && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filtered by:</span>
                  <Badge variant="default" className="gap-2">
                    {selectedTag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSelectedTag(null)}
                    />
                  </Badge>
                </div>
              )}

              {/* Tag Categories */}
              <Tabs defaultValue="popular" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="credit">Credit</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>

                <TabsContent value="popular" className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedTag === null ? "default" : "outline"}
                      onClick={() => setSelectedTag(null)}
                      size="sm"
                    >
                      All Posts
                    </Button>
                    {popularTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        onClick={() => setSelectedTag(tag)}
                        size="sm"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="credit" className="space-y-4">
                  {Object.entries(tagCategories).filter(([cat]) => 
                    ["Credit Building", "Credit Repair", "Tradelines & CPNs", "Credit Cards"].includes(cat)
                  ).map(([category, tags]) => (
                    tags.length > 0 && (
                      <div key={category}>
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Button
                              key={tag}
                              variant={selectedTag === tag ? "default" : "outline"}
                              onClick={() => setSelectedTag(tag)}
                              size="sm"
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </TabsContent>

                <TabsContent value="business" className="space-y-4">
                  {tagCategories["Business Credit"].length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Business Credit Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {tagCategories["Business Credit"].map((tag) => (
                          <Button
                            key={tag}
                            variant={selectedTag === tag ? "default" : "outline"}
                            onClick={() => setSelectedTag(tag)}
                            size="sm"
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="finance" className="space-y-4">
                  {Object.entries(tagCategories).filter(([cat]) => 
                    ["Mortgages & Loans", "Financial Wellness"].includes(cat)
                  ).map(([category, tags]) => (
                    tags.length > 0 && (
                      <div key={category}>
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Button
                              key={tag}
                              variant={selectedTag === tag ? "default" : "outline"}
                              onClick={() => setSelectedTag(tag)}
                              size="sm"
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </section>

      {/* All Posts */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {selectedTag 
                ? `${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} tagged "${selectedTag}"` 
                : searchQuery
                ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `All Articles (${filteredPosts.length})`
              }
            </h2>
          </div>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No articles found matching your criteria.</p>
              <Button onClick={() => { setSelectedTag(null); setSearchQuery(""); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-4xl opacity-20">📈</span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Email Signup */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <EmailSignup />
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default Blog;