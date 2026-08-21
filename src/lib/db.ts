import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Ensure SQLite DATABASE_URL resolves accurately in Vercel Serverless environment
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  const cwd = process.cwd();
  const prismaDbPath = path.join(cwd, 'prisma', 'dev.db');
  const rootDbPath = path.join(cwd, 'dev.db');

  if (fs.existsSync(prismaDbPath)) {
    process.env.DATABASE_URL = `file:${prismaDbPath}`;
  } else if (fs.existsSync(rootDbPath)) {
    process.env.DATABASE_URL = `file:${rootDbPath}`;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
