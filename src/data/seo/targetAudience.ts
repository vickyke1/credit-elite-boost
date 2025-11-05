// Target Audience Segmentation for CPNcreditboost.com

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  creditScoreRange: string;
  painPoints: string[];
  motivations: string[];
  primaryIntent: string;
  focusAreas: string[];
  contentTone: string;
  messagingThemes: string[];
}

export const audienceSegments: AudienceSegment[] = [
  {
    id: "segment-a",
    name: "The Credit-Damaged Individual",
    description: "Individuals with poor credit scores due to defaults, bankruptcies, or charge-offs seeking a fresh start",
    creditScoreRange: "Below 580",
    painPoints: [
      "Trapped by financial past",
      "Unable to qualify for loans or credit cards",
      "Facing high interest rates and rejections",
      "Traditional credit repair takes too long",
      "Feel hopeless about credit recovery"
    ],
    motivations: [
      "Rapid credit transformation",
      "Bypass traditional slow credit repair",
      "Start fresh with clean slate",
      "Qualify for essential financing quickly",
      "Escape the credit score prison"
    ],
    primaryIntent: "Solution and Escape",
    focusAreas: [
      "CPNs as new financial identity",
      "Tradelines as instant boost",
      "Fast results and timeline",
      "Transformation stories",
      "Breaking free from past mistakes"
    ],
    contentTone: "Empowering, hopeful, solution-oriented, understanding",
    messagingThemes: [
      "You deserve a second chance",
      "Your past doesn't define your future",
      "Fast, powerful solutions exist",
      "Take control of your financial destiny",
      "Transform your credit in weeks, not years"
    ]
  },
  {
    id: "segment-b",
    name: "The Credit-Ambitious Individual",
    description: "Individuals with fair-to-good credit seeking optimization and strategic advantage",
    creditScoreRange: "600-720",
    painPoints: [
      "Stuck just below threshold for best rates",
      "Need significant boost for major purchase",
      "Traditional methods too slow for timeline",
      "Want to optimize existing good credit",
      "Frustrated by slow incremental progress"
    ],
    motivations: [
      "Qualify for mortgage with best rates",
      "Secure business financing",
      "Optimize credit strategy",
      "Leverage advanced credit tactics",
      "Achieve elite credit status (700+)"
    ],
    primaryIntent: "Optimization and Leverage",
    focusAreas: [
      "Mechanics of tradeline impact",
      "Age, limits, and utilization ratios",
      "Legal compliance and best practices",
      "Strategic tradeline selection",
      "Data-driven credit building"
    ],
    contentTone: "Educational, strategic, detailed, transparent, professional",
    messagingThemes: [
      "Strategic credit optimization for the informed",
      "Advanced tactics for serious credit builders",
      "Data-backed credit strategies",
      "Maximize your credit potential",
      "The smart way to reach 700+"
    ]
  }
];

// Content recommendations by segment
export const getContentRecommendations = (segmentId: string): string[] => {
  const recommendations: Record<string, string[]> = {
    "segment-a": [
      "Success stories and testimonials",
      "Before/after credit transformations",
      "Simple, step-by-step guides",
      "Empowering 'fresh start' messaging",
      "FAQ addressing fears and concerns",
      "Clear timelines and expectations"
    ],
    "segment-b": [
      "In-depth mechanic explanations",
      "Legal analysis and compliance guides",
      "Strategic decision frameworks",
      "Data and case studies",
      "Advanced optimization tactics",
      "Expert insights and analysis"
    ]
  };
  
  return recommendations[segmentId] || [];
};

// Get segment by credit score
export const getSegmentByScore = (score: number): AudienceSegment | undefined => {
  if (score < 580) return audienceSegments[0]; // Segment A
  if (score >= 600 && score <= 720) return audienceSegments[1]; // Segment B
  return undefined;
};
