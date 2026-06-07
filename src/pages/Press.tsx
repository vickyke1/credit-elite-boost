import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const Press = () => {
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null);
  const pressReleases = [
    {
      title: "CPN Credit Boost Reaches 10,000 Successful Client Milestone",
      date: "March 15, 2024",
      category: "Company News",
      excerpt: "Leading credit enhancement company celebrates major achievement in helping clients improve their financial standing through ethical tradeline services.",
      content: "CPN Credit Boost announced today that it has successfully helped over 10,000 clients improve their credit profiles through its comprehensive credit enhancement services..."
    },
    {
      title: "New Compliance Standards Implementation Strengthens Client Protection",
      date: "February 28, 2024",
      category: "Regulatory",
      excerpt: "Company implements enhanced FCRA compliance measures and introduces new client protection protocols to maintain industry-leading standards.",
      content: "In response to evolving regulatory requirements, CPN Credit Boost has implemented additional compliance measures that exceed industry standards..."
    },
    {
      title: "CPN Credit Boost Expands Tradeline Marketplace with Premium Options",
      date: "January 10, 2024",
      category: "Product Launch",
      excerpt: "Enhanced marketplace now offers wider selection of aged tradelines from top-tier financial institutions with improved vetting processes.",
      content: "The expanded marketplace features carefully selected tradelines from premium financial institutions, providing clients with more options..."
    },
    {
      title: "Industry Recognition: Named Top Credit Enhancement Service Provider",
      date: "December 5, 2023",
      category: "Awards",
      excerpt: "CPN Credit Boost receives industry recognition for outstanding client service and ethical business practices in credit enhancement sector.",
      content: "The Financial Services Excellence Awards recognized CPN Credit Boost for its commitment to ethical practices and client success..."
    }
  ];

  const mediaKit = [
    {
      title: "Company Logos",
      description: "High-resolution logos in various formats",
      type: "ZIP Package"
    },
    {
      title: "Executive Photos", 
      description: "Professional headshots of leadership team",
      type: "Image Gallery"
    },
    {
      title: "Company Fact Sheet",
      description: "Key statistics and company information",
      type: "PDF Document"
    },
    {
      title: "Brand Guidelines",
      description: "Official brand colors, fonts, and usage rules",
      type: "PDF Document"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Press Center
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Latest news, media coverage, and press releases about CPN Credit Boost's 
                achievements and industry recognition.
              </p>
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="bg-surface-elevated p-8 rounded-lg max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Media Inquiries</h2>
              <p className="text-muted-foreground mb-6">
                For press inquiries, interviews, or media kit requests, please contact our press team.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Telegram:</strong> <a href="https://t.me/cpncreditboost" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@cpncreditboost</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Recent Press Releases
            </h2>
            <div className="max-w-4xl mx-auto space-y-8">
              {pressReleases.map((release, index) => (
                <article key={index} className="bg-background border border-border p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center gap-4 mb-2 md:mb-0">
                      <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded">
                        {release.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                    <button
                      onClick={() => setExpandedRelease(expandedRelease === index ? null : index)}
                      aria-expanded={expandedRelease === index}
                      className="text-primary hover:text-primary/80 font-semibold text-sm"
                    >
                      {expandedRelease === index ? "Show Less ↑" : "Read Full Release →"}
                    </button>
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {release.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {release.excerpt}
                  </p>

                  {expandedRelease === index && (
                    <p className="text-muted-foreground leading-relaxed mt-4 pt-4 border-t border-border">
                      {release.content}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Media Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {mediaKit.map((resource, index) => (
                <div key={index} className="bg-surface-elevated p-6 rounded-lg text-center hover:shadow-elegant transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📁</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{resource.type}</span>
                  <a
                    href="https://t.me/cpncreditboost"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-4 text-primary hover:text-primary/80 font-semibold text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Awards & Recognition
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-primary-foreground">🏆</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Excellence Award 2024</h3>
                <p className="text-sm text-muted-foreground">Financial Services Excellence</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-primary-foreground">⭐</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">BBB A+ Rating</h3>
                <p className="text-sm text-muted-foreground">Better Business Bureau</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-primary-foreground">🛡️</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Compliance Leader</h3>
                <p className="text-sm text-muted-foreground">Industry Standards Board</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Press;