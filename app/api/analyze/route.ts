import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/ai-providers';
import { prisma, serializeForDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { brief, model = 'claude-sonnet-4-5' } = await req.json();
    
    if (!brief || brief.trim().length < 10) {
      return NextResponse.json(
        { error: 'Brief too short' }, 
        { status: 400 }
      );
    }

    const provider = getProvider(model);
    const result = await provider.analyzeRequirements(brief);
    
    // Save to database
    const saved = await prisma.project.create({
      data: {
        type: 'requirements',
        title: result.title,
        input: brief,
        output: serializeForDb(result.content),
        modelUsed: result.model,
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: result.content, 
      id: saved.id 
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' }, 
      { status: 500 }
    );
  }
}