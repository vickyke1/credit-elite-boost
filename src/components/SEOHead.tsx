import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  schemaData?: unknown;
}

const SEOHead = ({
  title = "CPN Credit Boost - Elite Credit Profiles & Aged Tradelines | Boost Your Credit Fast",
  description = "Transform your credit with aged tradelines, clean CPNs & credit boosting kits. Fast delivery, 24/7 support, money-back guarantee. 10,000+ satisfied clients. Boost credit score instantly.",
  keywords = "credit repair, aged tradelines, CPN numbers, credit boost, credit score improvement, authorized user tradelines, business credit, credit building, fast credit repair, clean credit profiles",
  canonicalUrl,
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/iabNJmNHqJcI1x1JEE3RO3brdso1/social-images/social-1759248811286-Gold Luxury Initial Circle Logo.png",
  ogType = "website",
  schemaData
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org structured data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;