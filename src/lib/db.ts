import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Resolve SQLite DATABASE_URL accurately across Vercel Lambda Serverless environments
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  const cwd = process.cwd();
  const potentialPaths = [
    path.join(cwd, 'prisma', 'dev.db'),
    path.join(cwd, 'dev.db'),
    path.join('/var/task', 'prisma', 'dev.db'),
    path.join('/var/task', 'dev.db'),
    path.resolve('./prisma/dev.db'),
    path.resolve('./dev.db'),
  ];

  let foundDb = false;
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      process.env.DATABASE_URL = `file:${p}`;
      foundDb = true;
      break;
    }
  }

  if (!foundDb) {
    process.env.DATABASE_URL = `file:${path.join(cwd, 'prisma', 'dev.db')}`;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
