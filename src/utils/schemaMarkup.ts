// Schema.org structured data generators

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "CPN Credit Boost",
  "description": "Transform your credit with aged tradelines, clean CPNs & credit boosting kits. Fast delivery, 24/7 support, money-back guarantee.",
  "url": "https://cpncreditboost.com",
  "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/iabNJmNHqJcI1x1JEE3RO3brdso1/uploads/1759254015551-Gold Luxury Initial Circle Logo.png",
  "image": "https://storage.googleapis.com/gpt-engineer-file-uploads/iabNJmNHqJcI1x1JEE3RO3brdso1/social-images/social-1759248811286-Gold Luxury Initial Circle Logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+1 (904) 243-5425",
    "email": "support@cpncreditboost.com",
    "availableLanguage": "English",
    "areaServed": "US"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "serviceType": ["Credit Repair Services", "Tradeline Services", "Credit Enhancement"],
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "10000",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const serviceSchema = (service: {
  name: string;
  description: string;
  price?: string;
  url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": service.name,
  "description": service.description,
  "provider": {
    "@type": "FinancialService",
    "name": "CPN Credit Boost",
    "url": "https://cpncreditboost.com"
  },
  ...(service.price && {
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "USD"
    }
  }),
  ...(service.url && { "url": service.url })
});

export const blogPostSchema = (post: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  url: string;
  imageUrl?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.description,
  "author": {
    "@type": "Person",
    "name": post.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "CPN Credit Boost",
    "logo": {
      "@type": "ImageObject",
      "url": "https://storage.googleapis.com/gpt-engineer-file-uploads/iabNJmNHqJcI1x1JEE3RO3brdso1/uploads/1759254015551-Gold Luxury Initial Circle Logo.png"
    }
  },
  "datePublished": post.publishDate,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": post.url
  },
  ...(post.imageUrl && {
    "image": {
      "@type": "ImageObject",
      "url": post.imageUrl
    }
  })
});

export const productSchema = (product: {
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "CPN Credit Boost"
    }
  },
  ...(product.imageUrl && {
    "image": product.imageUrl
  }),
  ...(product.rating && product.reviewCount && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    }
  })
});