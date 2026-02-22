import { NextRequest, NextResponse } from 'next/server';
import { prisma, parseFromDb } from '@/lib/db';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // TypeScript knows the type automatically - no annotation needed
    const parsedProjects = projects.map((p: typeof projects[number]) => ({
      ...p,
      output: parseFromDb(p.output)
    }));

    return NextResponse.json(parsedProjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}