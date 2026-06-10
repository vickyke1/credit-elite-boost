import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marcus T.",
      location: "Atlanta, GA",
      rating: 5,
      text: "The process was clear from start to finish. I knew exactly what I was buying and when it would report. No vague promises — just professionalism.",
      verified: true,
      tradeline: "Seasoned Tradeline"
    },
    {
      name: "Priya R.",
      location: "Los Angeles, CA",
      rating: 5,
      text: "What sold me was the transparency. Every tradeline listed the age, limit, and reporting date. The support team actually explained how it all worked instead of overselling.",
      verified: true,
      tradeline: "Premium Tradeline"
    },
    {
      name: "Devon W.",
      location: "Miami, FL",
      rating: 5,
      text: "I was nervous about security, but the encrypted checkout and confidentiality put me at ease. Everything posted on the date they estimated.",
      verified: true,
      tradeline: "Aged Tradeline"
    },
    {
      name: "Alana K.",
      location: "Chicago, IL",
      rating: 5,
      text: "Customer service is on another level. They set honest expectations and followed through. That kind of integrity is rare in this space.",
      verified: true,
      tradeline: "Premium Tradeline"
    },
    {
      name: "Robert M.",
      location: "Seattle, WA",
      rating: 5,
      text: "Straightforward marketplace with real details on every listing. The posting guarantee gave me confidence that I was protected if anything went wrong.",
      verified: true,
      tradeline: "Seasoned Tradeline"
    },
    {
      name: "Amanda T.",
      location: "Houston, TX",
      rating: 5,
      text: "From browsing to confirmation, everything was smooth and clearly communicated. They guided me through how authorized-user history fits a bigger plan.",
      verified: true,
      tradeline: "Starter Tradeline"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real Members.{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Real Experiences.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See why thousands of members trust Credit Elite Boost for a transparent,
            secure way to add premium authorized-user tradelines to their credit strategy.
          </p>

          {/* Trust Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">10,000+</div>
              <div className="text-sm text-muted-foreground">Members Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-sm text-muted-foreground">Posting Guarantee</div>
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
                    {testimonial.tradeline}
                  </div>
                </div>

                {/* Verified Badge */}
                {testimonial.verified && (
                  <Badge variant="outline" className="text-xs border-primary text-primary">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join thousands of members who chose the transparent, secure way to build credit
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-3xl mx-auto">
            Testimonials reflect individual experiences. Your results may differ. Compensation was not provided for these reviews.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
