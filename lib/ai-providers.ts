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
- userStories: array of objects with {role: string, action: string, benefit: string}
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
    const systemPrompt = `You are an expert copywriter. Generate a landing page as a JSON object with exactly these fields:
- headline: string (attention-grabbing main headline)
- subheadline: string (supporting subheadline)
- features: array of objects with {title: string, description: string} (3-4 key features)
- cta: string (call to action button text)

Requirements: Return valid JSON only. No markdown code blocks.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
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
            content: 'Generate landing page JSON with: headline, subheadline, features (array of {title, description}), cta (string). Return valid JSON only.'
          },
          { role: 'user', content: context }
        ],
        temperature: 0.7,
        max_tokens: 2000,
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