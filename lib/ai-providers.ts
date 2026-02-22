import Anthropic from '@anthropic-ai/sdk';

export interface GenerationResult {
  title: string;
  content: any;
  model: string;
}

export interface AIProvider {
  analyzeRequirements(brief: string): Promise<GenerationResult>;
  generateLanding(context: string): Promise<GenerationResult>;
}

export class ClaudeProvider implements AIProvider {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  private model = 'claude-sonnet-4-5';

  async analyzeRequirements(brief: string): Promise<GenerationResult> {
    const systemPrompt = `You are a Senior Technical Project Manager specializing in AI-first MVP development. Analyze the provided client project brief and return a structured JSON object with exactly these fields:
- projectName: string (short project title)
- summary: string (2-3 sentence overview)
- functionalRequirements: string[] (list of key features)
- userStories: array of objects with {role: string; action: string; benefit: string}
- acceptanceCriteria: string[] (testable criteria)
- technicalRecommendations: string[] (tech stack suggestions)
- mvpScope: string (recommended MVP description)
- estimatedComplexity: "Low" | "Medium" | "High"
- risks: string[] (potential risks)
- aiOpportunities: string[] (where AI can add value)

Requirements: Return valid JSON only. No markdown code blocks, no explanation text.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: brief }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Extract JSON from markdown if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : text.trim();
    
    const parsed = JSON.parse(cleanJson);

    return {
      title: parsed.projectName || 'Untitled Project',
      content: parsed,
      model: this.model
    };
  }

  async generateLanding(context: string): Promise<GenerationResult> {
    const systemPrompt = `You are an expert conversion-focused copywriter and landing page designer. Generate a comprehensive, high-converting landing page as a JSON object with these detailed fields:

- navLogo: string (brand/product name for the navigation)
- navLinks: string[] (4-5 navigation links like ["Features", "How It Works", "Pricing", "Testimonials"])
- headline: string (powerful, benefit-driven main headline that grabs attention)
- subheadline: string (compelling subheadline that explains the value proposition)
- heroCta: string (primary call-to-action button text)
- heroSecondaryCta: string (optional secondary CTA like "Watch Demo" or "Learn More")
- problemStatement: string (describe the pain point your target audience faces)
- solutionStatement: string (how your product/service solves the problem)
- featuresSectionTitle: string (section heading like "Everything You Need to Succeed")
- featuresSectionSubtitle: string (supporting text for features section)
- features: array of 4-6 feature objects, each with {title: string, description: string, icon: string} - icon should be a Lucide icon name like "Zap", "Shield", "Users", "BarChart", "Clock", "Star", etc.
- howItWorks: object with {title: string, steps: array of 3-4 steps, each with {step: number, title: string, description: string}}
- testimonials: array of 2-3 testimonial objects, each with {quote: string, author: string, role: string, company: string}
- stats: array of 3-4 impressive statistics, each with {value: string (e.g., "98%"), label: string (e.g., "Customer Satisfaction")}
- trustedBy: string[] (3-4 fictitious company names that appear to use the product)
- faq: array of 4-5 FAQ objects, each with {question: string, answer: string}
- finalCta: object with {title: string, subtitle: string, buttonText: string}
- footerTagline: string (short tagline for the footer)
- copyright: string (e.g., "© 2025 Company Name. All rights reserved.")

Requirements:
- Return ONLY valid JSON, no markdown code blocks
- Write compelling, conversion-focused copy
- Include specific benefits, not just features
- Use persuasive language that drives action
- Make the content feel professional and trustworthy`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: context }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : text.trim();
    
    const parsed = JSON.parse(cleanJson);

    return {
      title: parsed.headline || 'Landing Page',
      content: parsed,
      model: this.model
    };
  }
}

export class GroqProvider implements AIProvider {
  private apiKey = process.env.GROQ_API_KEY!;
  private model = 'llama-3.3-70b-versatile';

  async analyzeRequirements(brief: string): Promise<GenerationResult> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a Technical Project Manager. Analyze requirements and return JSON with: projectName, summary, functionalRequirements (array), userStories (array with role/action/benefit), acceptanceCriteria (array), technicalRecommendations (array), mvpScope, estimatedComplexity (Low/Medium/High), risks (array), aiOpportunities (array). Return valid JSON only.'
          },
          { role: 'user', content: brief }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      title: parsed.projectName || 'Untitled Project',
      content: parsed,
      model: this.model
    };
  }

  async generateLanding(context: string): Promise<GenerationResult> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: `You are an expert conversion-focused copywriter. Generate a comprehensive landing page as JSON with these fields:
- navLogo: string (brand name)
- navLinks: string[] (4-5 nav items)
- headline: string (attention-grabbing main headline)
- subheadline: string (value proposition)
- heroCta: string (primary CTA button)
- heroSecondaryCta: string (secondary CTA)
- problemStatement: string (pain point description)
- solutionStatement: string (solution description)
- featuresSectionTitle: string
- featuresSectionSubtitle: string
- features: array of 4-6 objects with {title, description, icon} - icon should be Lucide icon names like "Zap", "Shield", "Users", "BarChart", "Clock", "Star", etc.
- howItWorks: object with {title, steps: array of 3-4 {step: number, title, description}}
- testimonials: array of 2-3 {quote, author, role, company}
- stats: array of 3-4 {value, label}
- trustedBy: string[] (3-4 company names)
- faq: array of 4-5 {question, answer}
- finalCta: object with {title, subtitle, buttonText}
- footerTagline: string
- copyright: string

Return valid JSON only. Write compelling, conversion-focused copy.`
          },
          { role: 'user', content: context }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      title: parsed.headline || 'Landing Page',
      content: parsed,
      model: this.model
    };
  }
}

export function getProvider(model: string): AIProvider {
  if (model === 'groq' || model === 'llama-3.3-70b-versatile') {
    return new GroqProvider();
  }
  return new ClaudeProvider();
}
