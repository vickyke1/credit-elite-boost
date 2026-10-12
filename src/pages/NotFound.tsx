import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page Not Found | CPN Credit Boost</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navigation />
      <main id="main-content" className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-2 text-sm font-semibold text-primary">404</p>
        <h1 className="mb-4 text-4xl font-bold text-foreground">Page not found</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          We couldn't find <span className="break-all font-medium text-foreground">{location.pathname}</span>. It may have moved or never existed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="min-h-11"><Link to="/">Return to Home</Link></Button>
          <Button asChild variant="outline" className="min-h-11"><Link to="/tradelines">Browse Tradelines</Link></Button>
          <Button asChild variant="outline" className="min-h-11"><Link to="/blog">Read the Blog</Link></Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
