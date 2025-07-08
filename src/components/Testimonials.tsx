import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marcus Johnson",
      location: "Atlanta, GA",
      score: "580 → 780",
      rating: 5,
      text: "CPN Credit Boost completely transformed my financial life. Within 45 days, I went from a 580 to 780 credit score and qualified for a $50K business loan!",
      verified: true,
      package: "Credit Boost Combo"
    },
    {
      name: "Sarah Chen", 
      location: "Los Angeles, CA",
      score: "520 → 720",
      rating: 5,
      text: "I was skeptical at first, but the results speak for themselves. The team was professional, the process was smooth, and my credit is now excellent.",
      verified: true,
      package: "Business Builder"
    },
    {
      name: "David Rodriguez",
      location: "Miami, FL", 
      score: "610 → 760",
      rating: 5,
      text: "Outstanding service! Got approved for my dream home after using their Elite Profile package. The investment paid for itself within weeks.",
      verified: true,
      package: "Elite Profile"
    },
    {
      name: "Jennifer Williams",
      location: "Chicago, IL",
      score: "550 → 740",
      rating: 5,
      text: "Fast, reliable, and exactly as promised. Their tradelines reported quickly and my score jumped 190 points. Highly recommend!",
      verified: true,
      package: "Credit Boost Combo"
    },
    {
      name: "Robert Kim",
      location: "Seattle, WA",
      score: "590 → 790", 
      rating: 5,
      text: "Professional team that delivers results. Used their business package and now have access to $100K+ in business credit lines.",
      verified: true,
      package: "Business Builder"
    },
    {
      name: "Amanda Thompson",
      location: "Houston, TX",
      score: "540 → 710",
      rating: 5,
      text: "Life-changing experience! From poor credit to excellent in just 2 months. The support team guided me through every step.",
      verified: true,
      package: "Basic CPN Kit"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Client{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from real clients. See how CPN Credit Boost has helped thousands 
            achieve their credit and funding goals.
          </p>
          
          {/* Trust Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">180+</div>
              <div className="text-sm text-muted-foreground">Avg Score Increase</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="surface-elevated rounded-2xl p-6 hover:scale-105 transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-current" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              {/* Client Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Package: {testimonial.package}
                  </div>
                </div>
                
                <div className="text-right">
                  {/* Score Improvement */}
                  <div className="text-lg font-bold text-accent mb-1">
                    {testimonial.score}
                  </div>
                  {/* Verified Badge */}
                  {testimonial.verified && (
                    <Badge variant="outline" className="text-xs border-primary text-primary">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join thousands of satisfied clients who have transformed their credit profiles
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            Over 98% customer satisfaction rate
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;