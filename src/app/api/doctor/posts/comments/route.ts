import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Ensure table exists in SQLite
let tableVerified = false;
async function ensureTable() {
  if (tableVerified) return;
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "DoctorPostComment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "postId" TEXT NOT NULL,
        "userId" TEXT,
        "userName" TEXT NOT NULL DEFAULT 'User',
        "userAvatar" TEXT,
        "content" TEXT NOT NULL,
        "likesCount" INTEGER NOT NULL DEFAULT 0,
        "dislikesCount" INTEGER NOT NULL DEFAULT 0,
        "parentId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    tableVerified = true;
  } catch (e) {
    console.error('Error ensuring DoctorPostComment table:', e);
  }
}

// 1. GET: Fetch comments for a post
export async function GET(request: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const sort = searchParams.get('sort') || 'newest'; // 'newest' | 'popular'

    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 });
    }

    const orderSql =
      sort === 'popular'
        ? 'ORDER BY "likesCount" DESC, "createdAt" DESC'
        : 'ORDER BY "createdAt" DESC';

    // Fetch top-level comments
    const topComments: any[] = await db.$queryRawUnsafe(`
      SELECT * FROM "DoctorPostComment"
      WHERE "postId" = '${postId}' AND "parentId" IS NULL
      ${orderSql}
    `);

    // For each comment, fetch replies and count
    const commentsWithReplies = await Promise.all(
      topComments.map(async (c) => {
        const replies: any[] = await db.$queryRawUnsafe(`
          SELECT * FROM "DoctorPostComment"
          WHERE "parentId" = '${c.id}'
          ORDER BY "createdAt" ASC
        `);
        return {
          ...c,
          replies: replies || [],
          _count: {
            replies: replies.length,
          },
        };
      })
    );

    const countRes: any[] = await db.$queryRawUnsafe(`
      SELECT COUNT(*) as total FROM "DoctorPostComment"
      WHERE "postId" = '${postId}'
    `);
    const totalCount = Number(countRes?.[0]?.total || commentsWithReplies.length);

    return NextResponse.json({
      success: true,
      count: totalCount,
      comments: commentsWithReplies,
    });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// 2. POST: Create a new comment or reply
export async function POST(request: Request) {
  try {
    await ensureTable();
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      try {
        const text = await request.text();
        body = JSON.parse(text);
      } catch {
        body = {};
      }
    }
    const { postId, content, parentId } = body;

    if (!postId || !content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Post ID and comment text are required.' },
        { status: 400 }
      );
    }

    let userName = 'Anonymous Patient';
    let userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    let userId: string | null = null;

    const session = await getSession();
    const cookieStore = cookies();
    const doctorSessionCookie = cookieStore.get('cddoctor_session')?.value;

    if (session?.userId) {
      userName = session.name || 'User';
      userId = session.userId || null;
    } else if (doctorSessionCookie) {
      try {
        const decoded = JSON.parse(Buffer.from(doctorSessionCookie, 'base64').toString('utf-8'));
        if (decoded?.id) {
          const doc = await db.doctor.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, photoUrl: true },
          });
          if (doc) {
            userName = doc.name;
            userAvatar = doc.photoUrl || userAvatar;
            userId = doc.id;
          }
        }
      } catch (e) {}
    }

    const commentId = crypto.randomUUID();
    const safeContent = content.trim().replace(/'/g, "''");
    const safeName = userName.replace(/'/g, "''");
    const parentSql = parentId ? `'${parentId}'` : 'NULL';
    const userSql = userId ? `'${userId}'` : 'NULL';
    const avatarSql = userAvatar ? `'${userAvatar}'` : 'NULL';

    await db.$executeRawUnsafe(`
      INSERT INTO "DoctorPostComment" ("id", "postId", "userId", "userName", "userAvatar", "content", "likesCount", "dislikesCount", "parentId", "createdAt", "updatedAt")
      VALUES ('${commentId}', '${postId}', ${userSql}, '${safeName}', ${avatarSql}, '${safeContent}', 0, 0, ${parentSql}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    // Increment share/comment count on post
    await db.$executeRawUnsafe(`
      UPDATE "DoctorPost" SET "sharesCount" = "sharesCount" + 1 WHERE "id" = '${postId}'
    `).catch(() => {});

    const newComment = {
      id: commentId,
      postId,
      userId,
      userName,
      userAvatar,
      content: content.trim(),
      likesCount: 0,
      dislikesCount: 0,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
      replies: [],
      _count: { replies: 0 },
    };

    return NextResponse.json({
      success: true,
      comment: newComment,
    });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}

// 3. PATCH: Reaction on a comment (Like, Dislike)
export async function PATCH(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();
    const { commentId, action } = body;

    if (!commentId || !action) {
      return NextResponse.json(
        { success: false, error: 'Comment ID and action are required.' },
        { status: 400 }
      );
    }

    let updateSql = '';
    if (action === 'LIKE') {
      updateSql = '"likesCount" = "likesCount" + 1';
    } else if (action === 'UNLIKE') {
      updateSql = '"likesCount" = MAX(0, "likesCount" - 1)';
    } else if (action === 'DISLIKE') {
      updateSql = '"dislikesCount" = "dislikesCount" + 1';
    } else if (action === 'UNDISLIKE') {
      updateSql = '"dislikesCount" = MAX(0, "dislikesCount" - 1)';
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    await db.$executeRawUnsafe(`
      UPDATE "DoctorPostComment" SET ${updateSql} WHERE "id" = '${commentId}'
    `);

    const updated: any[] = await db.$queryRawUnsafe(`
      SELECT "likesCount", "dislikesCount" FROM "DoctorPostComment" WHERE "id" = '${commentId}'
    `);

    return NextResponse.json({
      success: true,
      likesCount: updated?.[0]?.likesCount ?? 0,
      dislikesCount: updated?.[0]?.dislikesCount ?? 0,
    });
  } catch (error: any) {
    console.error('Error updating comment reaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reaction' },
      { status: 500 }
    );
  }
}

