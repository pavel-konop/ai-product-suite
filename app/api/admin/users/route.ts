import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      _count: { select: { projects: true } },
    },
  });

  return NextResponse.json({
    total: users.length,
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      verified: !!u.emailVerified,
      projects: u._count.projects,
    })),
  });
}
