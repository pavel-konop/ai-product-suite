export interface RequirementsAnalysis {
  projectName: string;
  summary: string;
  functionalRequirements: string[];
  userStories: { role: string; action: string; benefit: string }[];
  acceptanceCriteria: string[];
  technicalRecommendations: string[];
  mvpScope: string;
  estimatedComplexity: 'Low' | 'Medium' | 'High';
  risks: string[];
  aiOpportunities: string[];
}

export interface LandingPageFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface LandingPageTestimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

export interface LandingPageStat {
  value: string;
  label: string;
}

export interface LandingPagePricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface LandingPage {
  // Navigation
  navLogo?: string;
  navLinks?: string[];
  
  // Hero Section
  headline: string;
  subheadline: string;
  heroCta: string;
  heroSecondaryCta?: string;
  heroImage?: string;
  
  // Problem/Solution Section
  problemStatement?: string;
  solutionStatement?: string;
  
  // Features Section
  featuresSectionTitle?: string;
  featuresSectionSubtitle?: string;
  features: LandingPageFeature[];
  
  // How It Works Section
  howItWorks?: {
    title: string;
    steps: { step: number; title: string; description: string }[];
  };
  
  // Social Proof
  testimonials?: LandingPageTestimonial[];
  stats?: LandingPageStat[];
  trustedBy?: string[];
  
  // Pricing (optional)
  pricing?: {
    title: string;
    subtitle: string;
    plans: LandingPagePricingPlan[];
  };
  
  // FAQ Section
  faq?: {
    question: string;
    answer: string;
  }[];
  
  // Final CTA Section
  finalCta?: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  
  // Footer
  footerTagline?: string;
  footerLinks?: { category: string; links: string[] }[];
  copyright?: string;
}
