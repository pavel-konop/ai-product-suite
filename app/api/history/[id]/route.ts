import { NextRequest, NextResponse } from 'next/server';
import { prisma, parseFromDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Extract ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const parsedOutput = parseFromDb(project.output);

    return NextResponse.json({
      id: project.id,
      type: project.type,
      title: project.title,
      input: project.input,
      output: parsedOutput,
      modelUsed: project.modelUsed,
      createdAt: project.createdAt,
      parentId: project.parentId
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' }, 
      { status: 500 }
    );
  }
}