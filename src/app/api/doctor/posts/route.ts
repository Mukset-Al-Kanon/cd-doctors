import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

async function ensureTables() {
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
  } catch (e) {}
}

// 1. GET: Fetch posts for a doctor
export async function GET(request: Request) {
  try {
    await ensureTables();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'doctorId is required' }, { status: 400 });
    }

    const doctor = await db.doctor.findFirst({
      where: {
        OR: [{ id: doctorId }, { slug: doctorId }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        photoUrl: true,
        specialization: true,
        degrees: true,
        followersCount: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
    }

    let posts = await db.doctorPost.findMany({
      where: {
        doctorId: doctor.id,
        isPublished: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // If no posts exist yet, auto-seed realistic demo posts with real database comments
    if (posts.length === 0) {
      const post1 = await db.doctorPost.create({
        data: {
          doctorId: doctor.id,
          content: 'উচ্চ রক্তচাপ (Hypertension) নিয়ন্ত্রণ রাখার সহজ উপায়গুলো জেনে নিন। নিয়মিত প্রেশার মেপে নিয়ন্ত্রণে রাখুন। লবণ কম খাওয়ার অভ্যাস করুন এবং প্রতিদিন অন্তত ৩০ মিনিট হাঁটুন।',
          mediaType: 'IMAGE',
          mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
          helpfulCount: 40,
          sharesCount: 3,
        },
      });

      const post2 = await db.doctorPost.create({
        data: {
          doctorId: doctor.id,
          content: 'তীব্র গরমে হিটস্ট্রোক ও ডিহাইড্রেশন থেকে সতর্ক থাকুন! প্রতিদিন পর্যাপ্ত বিশুদ্ধ পানি পান করুন এবং তীব্র রোদ এড়িয়ে চলুন।',
          mediaType: 'YOUTUBE',
          mediaUrl: 'r5XTTeP039Q',
          videoTitle: 'উচ্চ রক্তচাপ ও হার্ট ভালো রাখার কার্যকর নিয়ম',
          helpfulCount: 65,
          sharesCount: 2,
        },
      });

      // Seed real comments in SQLite for post 1
      const comment1Id = crypto.randomUUID();
      await db.$executeRawUnsafe(`
        INSERT INTO "DoctorPostComment" ("id", "postId", "userName", "userAvatar", "content", "likesCount", "parentId", "createdAt")
        VALUES (
          '${comment1Id}',
          '${post1.id}',
          'তানভীর আহমেদ',
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          'স্যার, প্রেসারের ওষুধ কি প্রতিদিন নির্দিষ্ট সময়ে খাওয়া ভালো?',
          4,
          NULL,
          datetime('now', '-2 hours')
        )
      `);

      const reply1Id = crypto.randomUUID();
      await db.$executeRawUnsafe(`
        INSERT INTO "DoctorPostComment" ("id", "postId", "userName", "userAvatar", "content", "likesCount", "parentId", "createdAt")
        VALUES (
          '${reply1Id}',
          '${post1.id}',
          '${doctor.name}',
          '${doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}',
          'জি তানভীর সাহেব, প্রতিদিন নির্দিষ্ট সময়ে খাওয়া সবচেয়ে কার্যকর ও নিরাপদ।',
          7,
          '${comment1Id}',
          datetime('now', '-1 hour')
        )
      `);

      const comment2Id = crypto.randomUUID();
      await db.$executeRawUnsafe(`
        INSERT INTO "DoctorPostComment" ("id", "postId", "userName", "userAvatar", "content", "likesCount", "parentId", "createdAt")
        VALUES (
          '${comment2Id}',
          '${post1.id}',
          'সালমা খাতুন',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          'অসাধারণ এবং অত্যন্ত প্রয়োজনীয় পরামর্শ! অনেক ধন্যবাদ স্যার।',
          2,
          NULL,
          datetime('now', '-30 minutes')
        )
      `);

      // Seed real comments for post 2
      const comment3Id = crypto.randomUUID();
      await db.$executeRawUnsafe(`
        INSERT INTO "DoctorPostComment" ("id", "postId", "userName", "userAvatar", "content", "likesCount", "parentId", "createdAt")
        VALUES (
          '${comment3Id}',
          '${post2.id}',
          'ফারহানা রহমান',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          'বাচ্চাদের জন্য ওআরএস স্যালাইন কতটুকু খাওয়ানো নিরাপদ?',
          5,
          NULL,
          datetime('now', '-3 hours')
        )
      `);

      const reply2Id = crypto.randomUUID();
      await db.$executeRawUnsafe(`
        INSERT INTO "DoctorPostComment" ("id", "postId", "userName", "userAvatar", "content", "likesCount", "parentId", "createdAt")
        VALUES (
          '${reply2Id}',
          '${post2.id}',
          '${doctor.name}',
          '${doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}',
          'বাচ্চার বয়স ও ওজনের ওপর ভিত্তি করে চিকিৎসকের পরামর্শে পরিমিত খাওয়াতে পারেন।',
          3,
          '${comment3Id}',
          datetime('now', '-2 hours')
        )
      `);

      posts = await db.doctorPost.findMany({
        where: {
          doctorId: doctor.id,
          isPublished: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const formattedPosts = await Promise.all(
      posts.map(async (p: any) => {
        try {
          const countRes: any[] = await db.$queryRawUnsafe(`
            SELECT COUNT(*) as total FROM "DoctorPostComment"
            WHERE "postId" = '${p.id}'
          `);
          const realCommentsCount = Number(countRes?.[0]?.total || 0);
          return {
            ...p,
            helpfulCount: p.helpfulCount || 0,
            sharesCount: realCommentsCount,
            commentsCount: realCommentsCount,
          };
        } catch {
          return {
            ...p,
            helpfulCount: p.helpfulCount || 0,
            sharesCount: 0,
            commentsCount: 0,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      doctor,
      followersCount: doctor.followersCount || 0,
      posts: formattedPosts,
    });
  } catch (error: any) {
    console.error('Error fetching doctor posts:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch doctor posts' }, { status: 500 });
  }
}

// 2. POST: Create a new health awareness post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorId, content, mediaType = 'NONE', mediaUrl, videoTitle } = body;

    if (!doctorId || !content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'ডাক্তারের আইডি এবং পোস্টের বিষয়বস্তু আবশ্যক।' },
        { status: 400 }
      );
    }

    const doctor = await db.doctor.findFirst({
      where: {
        OR: [{ id: doctorId }, { slug: doctorId }],
      },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'ডাক্তার পাওয়া যায়নি।' }, { status: 404 });
    }

    let finalMediaType = mediaType;
    let finalMediaUrl = mediaUrl ? mediaUrl.trim() : null;

    // Check if mediaUrl is a YouTube or Facebook URL
    if (finalMediaUrl) {
      const ytId = extractYouTubeId(finalMediaUrl);
      if (ytId) {
        finalMediaType = 'YOUTUBE';
        finalMediaUrl = ytId;
      } else if (
        finalMediaUrl.includes('facebook.com') ||
        finalMediaUrl.includes('fb.watch') ||
        finalMediaUrl.includes('fb.com')
      ) {
        finalMediaType = 'FACEBOOK';
      }
    }

    const post = await db.doctorPost.create({
      data: {
        doctorId: doctor.id,
        content: content.trim(),
        mediaType: finalMediaType,
        mediaUrl: finalMediaUrl,
        videoTitle: videoTitle ? videoTitle.trim() : null,
        helpfulCount: 0,
        sharesCount: 0,
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error creating doctor post:', error);
    return NextResponse.json({ success: false, error: 'পোস্ট তৈরি করা যায়নি।' }, { status: 500 });
  }
}

// 3. PATCH: Reactions (Helpful, Follow, Share)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { action, postId, doctorId } = body;

    // A. Helpful Reaction (Toggle on/off)
    if (action === 'HELPFUL' && postId) {
      const updatedPost = await db.doctorPost.update({
        where: { id: postId },
        data: {
          helpfulCount: { increment: 1 },
        },
      });
      return NextResponse.json({ success: true, helpfulCount: updatedPost.helpfulCount });
    }

    if (action === 'UNHELPFUL' && postId) {
      const post = await db.doctorPost.findUnique({ where: { id: postId }, select: { helpfulCount: true } });
      const newCount = Math.max(0, (post?.helpfulCount || 1) - 1);
      const updatedPost = await db.doctorPost.update({
        where: { id: postId },
        data: { helpfulCount: newCount },
      });
      return NextResponse.json({ success: true, helpfulCount: updatedPost.helpfulCount });
    }

    // B. Share Increment
    if (action === 'SHARE' && postId) {
      const updatedPost = await db.doctorPost.update({
        where: { id: postId },
        data: {
          sharesCount: { increment: 1 },
        },
      });
      return NextResponse.json({ success: true, sharesCount: updatedPost.sharesCount });
    }

    // C. Follow / Unfollow Doctor (Authentication required)
    if (action === 'FOLLOW' && doctorId) {
      const session = await getSession();
      const cookieStore = cookies();
      const isDoctor = Boolean(cookieStore.get('cddoctor_session')?.value);

      if (!session && !isDoctor) {
        return NextResponse.json({ success: false, error: 'ফলো করতে অনুগ্রহ করে লগইন করুন।' }, { status: 401 });
      }

      const updatedDoc = await db.doctor.update({
        where: { id: doctorId },
        data: {
          followersCount: { increment: 1 },
        },
      });
      return NextResponse.json({ success: true, followersCount: updatedDoc.followersCount });
    }

    if (action === 'UNFOLLOW' && doctorId) {
      const session = await getSession();
      const cookieStore = cookies();
      const isDoctor = Boolean(cookieStore.get('cddoctor_session')?.value);

      if (!session && !isDoctor) {
        return NextResponse.json({ success: false, error: 'অনুগ্রহ করে লগইন করুন।' }, { status: 401 });
      }

      const doc = await db.doctor.findUnique({ where: { id: doctorId }, select: { followersCount: true } });
      const newCount = Math.max(0, (doc?.followersCount || 1) - 1);
      const updatedDoc = await db.doctor.update({
        where: { id: doctorId },
        data: { followersCount: newCount },
      });
      return NextResponse.json({ success: true, followersCount: updatedDoc.followersCount });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating doctor reaction:', error);
    return NextResponse.json({ success: false, error: 'অ্যাকশন সম্পন্ন করা যায়নি।' }, { status: 500 });
  }
}
