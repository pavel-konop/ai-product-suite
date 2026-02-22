import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper to serialize data before saving
export function serializeForDb(data: any): string {
  return JSON.stringify(data)
}

// Helper to parse data after reading
export function parseFromDb(data: string): any {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}