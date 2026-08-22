import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Resolve SQLite DATABASE_URL accurately across Vercel Lambda Serverless environments
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  const cwd = process.cwd();
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isVercel) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const sourceDbPaths = [
      path.join(cwd, 'prisma', 'dev.db'),
      path.join(cwd, 'dev.db'),
      path.join('/var/task', 'prisma', 'dev.db'),
      path.join('/var/task', 'dev.db'),
    ];

    const sourceDb = sourceDbPaths.find((p) => fs.existsSync(p));
    if (sourceDb && !fs.existsSync(tmpDbPath)) {
      try {
        fs.copyFileSync(sourceDb, tmpDbPath);
      } catch (e) {
        console.error('Failed to copy SQLite DB to /tmp:', e);
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    } else if (sourceDb) {
      process.env.DATABASE_URL = `file:${sourceDb}`;
    }
  } else {
    const potentialPaths = [
      path.join(cwd, 'prisma', 'dev.db'),
      path.join(cwd, 'dev.db'),
      path.resolve('./prisma/dev.db'),
      path.resolve('./dev.db'),
    ];
    const found = potentialPaths.find((p) => fs.existsSync(p));
    process.env.DATABASE_URL = `file:${found || path.join(cwd, 'prisma', 'dev.db')}`;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
