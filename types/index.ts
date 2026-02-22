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

export interface LandingPage {
  headline: string;
  subheadline: string;
  features: { title: string; description: string }[];
  cta: string;
}