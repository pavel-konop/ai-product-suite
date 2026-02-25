import { NextResponse } from 'next/server';
import { prisma, parseFromDb } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const parsedProjects = projects.map((p) => ({
      ...p,
      output: parseFromDb(p.output)
    }));

    return NextResponse.json(parsedProjects);
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch history',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
