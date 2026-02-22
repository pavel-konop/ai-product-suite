import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/ai-providers';
import { prisma, serializeForDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { context, model } = await req.json();
    
    if (!context || context.trim().length < 10) {
      return NextResponse.json({ error: 'Context too short' }, { status: 400 });
    }

    const provider = getProvider(model);
    const result = await provider.generateLanding(context);
    
    // Save to database
    const saved = await prisma.project.create({
      data: {
        type: 'landing',
        title: result.title,
        input: context,
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
    console.error('Landing generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}