import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/ai-providers';
import { prisma, serializeForDb } from '@/lib/db';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { context, model } = await req.json();

    if (!context || context.trim().length < 10) {
      return NextResponse.json({ error: 'Context too short' }, { status: 400 });
    }

    const provider = getProvider(model);
    const result = await provider.generateLanding(context);

    const saved = await prisma.project.create({
      data: {
        type: 'landing',
        title: result.title,
        input: context,
        output: serializeForDb(result.content),
        modelUsed: result.model,
        userId: session.user.id,
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
