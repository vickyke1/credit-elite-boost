// SEO Content Strategy & Guidelines for CPNcreditboost.com

export interface SEOGuidelines {
  eeat: {
    experience: string[];
    expertise: string[];
    authoritativeness: string[];
    trustworthiness: string[];
  };
  coreWebVitals: {
    lcp: string[];
    fid: string[];
    cls: string[];
  };
  intentMatching: {
    informational: string[];
    commercial: string[];
    transactional: string[];
  };
  contentQuality: string[];
  internalLinking: string[];
  ctaStrategy: string[];
}

export const seoGuidelines: SEOGuidelines = {
  eeat: {
    experience: [
      "Demonstrate real-world knowledge of CPN and tradeline processes",
      "Share specific examples and case scenarios",
      "Reference actual client outcomes (anonymized)",
      "Explain nuanced details only experts would know",
      "Show understanding of credit bureau mechanics"
    ],
    expertise: [
      "Provide comprehensive, detailed explanations",
      "Cover all aspects of topic thoroughly",
      "Anticipate and answer follow-up questions",
      "Use industry-specific terminology correctly",
      "Demonstrate knowledge of credit laws and regulations"
    ],
    authoritativeness: [
      "Position as definitive guide on topic",
      "Use confident, knowledgeable language",
      "Cite relevant laws and regulations",
      "Provide most comprehensive content available",
      "Establish thought leadership in niche"
    ],
    trustworthiness: [
      "Include clear, prominent legal disclaimers",
      "Be transparent about risks and gray areas",
      "Avoid unrealistic promises",
      "Use professional, non-sensational tone",
      "Provide honest assessments of limitations",
      "Link to authoritative external sources",
      "Display security badges and trust indicators"
    ]
  },
  coreWebVitals: {
    lcp: [
      "Keep blog posts text-heavy with minimal large images",
      "Optimize hero images (WebP format, lazy loading)",
      "Ensure fast server response times",
      "Use CDN for static assets"
    ],
    fid: [
      "Use clean, lightweight theme",
      "Minimize JavaScript execution",
      "Avoid intrusive pop-ups on load",
      "Ensure responsive interactions"
    ],
    cls: [
      "Define dimensions for all images and CTAs",
      "Reserve space for dynamic content",
      "Avoid inserting content above existing content",
      "Use proper font loading strategies"
    ]
  },
  intentMatching: {
    informational: [
      "Provide complete, satisfying answers first",
      "Focus on education and explanation",
      "Use FAQ format for question-based queries",
      "Include step-by-step guides",
      "Only introduce commercial CTAs after value delivery"
    ],
    commercial: [
      "Compare options and alternatives",
      "Provide decision-making frameworks",
      "Include pros/cons analysis",
      "Address buyer concerns and objections",
      "Feature trust signals and social proof"
    ],
    transactional: [
      "Clear product/service descriptions",
      "Prominent pricing information",
      "Strong, benefit-oriented CTAs",
      "Reduce friction in conversion path",
      "Display guarantees and support options"
    ]
  },
  contentQuality: [
    "Target 1,500-2,000 words for pillar content",
    "Use clear heading hierarchy (H1 > H2 > H3)",
    "Break content into scannable sections",
    "Include bullet points and numbered lists",
    "Add relevant internal and external links",
    "Optimize images with descriptive alt text",
    "Ensure mobile responsiveness",
    "Maintain consistent brand voice"
  ],
  internalLinking: [
    "Link pillar pages to related cluster pages",
    "Use descriptive anchor text with target keywords",
    "Create topic hubs with strong internal link structure",
    "Link from high-authority pages to new content",
    "Ensure all blog posts link to relevant service pages",
    "Create breadcrumb navigation",
    "Link related blog posts in sidebar or footer"
  ],
  ctaStrategy: [
    "Place CTAs contextually after value delivery",
    "Use benefit-oriented language (outcome focus)",
    "Include action-oriented verbs",
    "Create visual distinction for CTAs",
    "Test multiple CTA placements (top, middle, bottom)",
    "A/B test CTA copy and design",
    "Track CTA click-through rates"
  ]
};

// CTA Templates
export interface CTATemplate {
  id: string;
  type: 'soft' | 'medium' | 'hard';
  placement: 'inline' | 'end' | 'sidebar';
  copy: string;
  context: string;
}

export const ctaTemplates: CTATemplate[] = [
  {
    id: "cta-soft-1",
    type: "soft",
    placement: "inline",
    copy: "Want to learn more? Explore our comprehensive CPN & Tradeline packages.",
    context: "Use mid-article after explaining a concept"
  },
  {
    id: "cta-medium-1",
    type: "medium",
    placement: "inline",
    copy: "Ready to boost your credit score? See which tradeline package is right for you.",
    context: "Use after explaining benefits/results"
  },
  {
    id: "cta-hard-1",
    type: "hard",
    placement: "end",
    copy: "Start Your Journey to a 700+ Score Today! Click Here to Explore Our Legit CPN & Tradeline Packages.",
    context: "Use at end of pillar content"
  },
  {
    id: "cta-hard-2",
    type: "hard",
    placement: "end",
    copy: "Don't Wait. Transform Your Credit in 30-60 Days. Get Your Free Consultation Now!",
    context: "Use for high-intent commercial content"
  },
  {
    id: "cta-sidebar-1",
    type: "medium",
    placement: "sidebar",
    copy: "Free Credit Assessment - Find Out Which Package Fits Your Goals",
    context: "Persistent sidebar CTA"
  }
];

// Legal Disclaimer Templates
export const legalDisclaimers = {
  cpnGeneral: "Important Disclaimer: The information provided is for educational purposes only. Using a CPN to apply for credit under false pretenses or to misrepresent your SSN is illegal and constitutes federal fraud. CPN Credit Boost provides services for establishing legal secondary credit files for permissible purposes. We strongly advise all clients to seek independent legal counsel to understand applicable laws.",
  
  tradelines: "Tradeline Disclaimer: Adding authorized users to credit accounts is a legal practice. Results may vary based on individual credit profiles, and we make no guarantees of specific score increases. All services are provided for lawful purposes only.",
  
  results: "Results Disclaimer: Individual results may vary. Credit score improvements depend on multiple factors including current credit profile, tradeline quality, and bureau reporting. Timelines provided are estimates based on typical reporting cycles."
};

// Internal Linking Structure Map
export interface InternalLinkMap {
  pillarPage: string;
  linkedClusterPages: string[];
  linkedServicePages: string[];
}

export const internalLinkingMap: InternalLinkMap[] = [
  {
    pillarPage: "How Do CPNs and Tradelines Work? (Blog Post #1)",
    linkedClusterPages: [
      "Are CPNs and Tradelines Legal? (Blog Post #3)",
      "Authorized User vs. Primary Tradelines (Blog Post #2)",
      "How to Build a Bulletproof CPN Profile (Blog Post #4)"
    ],
    linkedServicePages: [
      "/cpn-packages",
      "/tradeline-marketplace"
    ]
  },
  {
    pillarPage: "Legit Tradeline Companies 2025 (Blog Post #5)",
    linkedClusterPages: [
      "Top 10 Tradeline Questions Answered (Blog Post #8)",
      "Authorized User vs. Primary Tradelines (Blog Post #2)"
    ],
    linkedServicePages: [
      "/tradeline-marketplace",
      "/about"
    ]
  },
  {
    pillarPage: "CPN Credit Repair Blueprint (Blog Post #9)",
    linkedClusterPages: [
      "How to Build a Bulletproof CPN Profile (Blog Post #4)",
      "How Many Tradelines for CPN (Blog Post #10)"
    ],
    linkedServicePages: [
      "/cpn-packages"
    ]
  }
];
