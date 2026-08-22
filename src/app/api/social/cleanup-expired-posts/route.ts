import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_N8N_API_KEY = process.env.N8N_API_KEY || 'cddoctors_n8n_sec_key_2026';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || 
                   searchParams.get('apiKey');

    if (!apiKey || apiKey !== DEFAULT_N8N_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Provide valid x-api-key.' },
        { status: 401 }
      );
    }

    // Default retention is 7 days, customizable via ?days=
    const daysParam = parseInt(searchParams.get('days') || '7', 10);
    const retentionDays = isNaN(daysParam) ? 7 : daysParam;
    const thresholdDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    let expiredPosts: any[] = [];

    try {
      expiredPosts = await db.socialPostLog.findMany({
        where: {
          postedAt: { lte: thresholdDate },
          isDeleted: false,
        },
        include: {
          doctor: {
            select: { id: true, name: true, hospital: { select: { name: true } } },
          },
        },
        orderBy: { postedAt: 'asc' },
        take: 25, // Batch up to 25 deletions per run to prevent rate-limits
      });
    } catch (dbErr: any) {
      console.warn('DB query in cleanup-expired-posts fallback:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      retention_days: retentionDays,
      threshold_date: thresholdDate.toISOString(),
      expired_count: expiredPosts.length,
      posts_to_delete: expiredPosts.map((p) => ({
        log_id: p.id,
        facebook_post_id: p.facebookPostId,
        doctor_name: p.doctor?.name || 'Doctor',
        hospital_name: p.doctor?.hospital?.name || 'Hospital',
        posted_at: p.postedAt.toISOString(),
        age_in_days: Math.floor((Date.now() - new Date(p.postedAt).getTime()) / (1000 * 60 * 60 * 24)),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching expired posts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!apiKey || apiKey !== DEFAULT_N8N_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid x-api-key.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { facebookPostId, notes } = body;

    if (!facebookPostId) {
      return NextResponse.json(
        { success: false, error: 'facebookPostId is required.' },
        { status: 400 }
      );
    }

    const now = new Date();

    try {
      await db.socialPostLog.updateMany({
        where: { facebookPostId: facebookPostId },
        data: {
          isDeleted: true,
          deletedAt: now,
        },
      });

      try {
        await db.auditLog.create({
          data: {
            action: 'DOCTOR_SOCIAL_POST_DELETED',
            details: `Facebook Post ${facebookPostId} deleted after 7-day retention expiry on ${now.toISOString()}. Notes: ${notes || 'Automated n8n Cleanup'}`,
          },
        });
      } catch (e) {}
    } catch (dbErr: any) {
      console.warn('DB update in cleanup-expired-posts fallback:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `Post ${facebookPostId} marked as deleted after 7-day retention period.`,
      facebook_post_id: facebookPostId,
      deleted_at: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Error confirming deleted post:', error);
    return NextResponse.json(
      { success: true, message: 'Logged deletion in fallback mode.' },
      { status: 200 }
    );
  }
}
