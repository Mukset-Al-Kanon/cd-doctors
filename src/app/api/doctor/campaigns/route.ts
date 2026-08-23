import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await db.doctorCampaign.findMany({
      where: { doctorId: doctorId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      campaigns: campaigns,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { campaignId, scheduledDate, notes } = body;

    if (!scheduledDate) {
      return NextResponse.json({ success: false, error: 'শিডিউল তারিখ নির্বাচন করুন।' }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.remainingBoostDays <= 0) {
      return NextResponse.json(
        { success: false, error: 'আপনার বর্তমান প্যাকেজে কোনো অবশিষ্ট বুস্ট দিন নেই। নতুন প্যাকেজ নিন।' },
        { status: 403 }
      );
    }

    let campaign = null;
    if (campaignId) {
      campaign = await db.doctorCampaign.update({
        where: { id: campaignId },
        data: {
          scheduledDate: new Date(scheduledDate),
          status: 'SCHEDULED',
        },
      });
    } else {
      campaign = await db.doctorCampaign.create({
        data: {
          doctorId: doctorId,
          packageName: doctor.activePackageName || 'CUSTOM_BOOST',
          priceBdt: 0,
          scheduledDate: new Date(scheduledDate),
          status: 'SCHEDULED',
          boostDays: 1,
          totalPosts: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'ফেসবুক স্পন্সরড বুস্টের তারিখ সফলভাবে শিডিউল করা হয়েছে!',
      campaign: campaign,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
