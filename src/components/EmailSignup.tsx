import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EmailSignupProps {
  variant?: "default" | "inline" | "popup";
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
}

const EmailSignup = ({
  variant = "default",
  title = "Get 10 Free Credit Boosting Tips",
  description = "Join 10,000+ clients receiving weekly credit tips, exclusive offers, and tradeline alerts.",
  buttonText = "Get Free Tips",
  placeholder = "Enter your email address"
}: EmailSignupProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Integrate with email marketing service (Mailchimp, SendGrid, etc.)
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Success! Check your inbox for your free credit tips.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : buttonText}
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-background"
            required
          />
          <Button 
            type="submit" 
            disabled={loading}
            size="lg"
            className="bg-gradient-cta hover:scale-105 transition-transform"
          >
            {loading ? "Sending..." : buttonText}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time. No spam, ever.
        </p>
      </div>
    </div>
  );
};

export default EmailSignup;