import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: List doctor affiliation requests for a hospital
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');
    const status = searchParams.get('status') || 'PENDING';

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: 'hospitalId is required' }, { status: 400 });
    }

    const whereClause: any = { hospitalId };
    if (status !== 'ALL') {
      whereClause.approvalStatus = status;
    }

    const affiliations = await db.doctorSchedule.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            slug: true,
            degrees: true,
            specialization: true,
            bmdcNumber: true,
            phone: true,
            photoUrl: true,
            experienceYears: true,
            consultationFee: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, affiliations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Approve, Reject, or Revoke an Affiliation Request
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { scheduleId, scheduleIds, action, roomNumber, rejectionReason, consultationFee } = body;

    if ((!scheduleId && (!scheduleIds || scheduleIds.length === 0)) || !action) {
      return NextResponse.json({ success: false, error: 'scheduleId and action are required.' }, { status: 400 });
    }

    const targetIds = scheduleIds && scheduleIds.length > 0 ? scheduleIds : [scheduleId];

    if (action === 'APPROVE') {
      await db.doctorSchedule.updateMany({
        where: { id: { in: targetIds } },
        data: {
          approvalStatus: 'APPROVED',
          approvedAt: new Date(),
          ...(roomNumber ? { roomNumber } : {}),
          ...(consultationFee ? { consultationFee: parseInt(consultationFee.toString(), 10) } : {}),
          rejectionReason: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'ডাক্তারের চেম্বার অ্যাফিলিয়েশন সফলভাবে অনুমোদিত হয়েছে। এখন এটি ডাক্তারের প্রোফাইলে ও বুকিং সিস্টেমে দৃশ্যমান হবে।',
      });
    } else if (action === 'REJECT' || action === 'REVOKE') {
      await db.doctorSchedule.updateMany({
        where: { id: { in: targetIds } },
        data: {
          approvalStatus: 'REJECTED',
          rejectionReason: rejectionReason || (action === 'REVOKE' ? 'হাসপাতাল কর্তৃপক্ষ কর্তৃক চেম্বার স্থগিত করা হয়েছে।' : 'হাসপাতাল কর্তৃপক্ষ কর্তৃক অনুরোধ বাতিল করা হয়েছে।'),
        },
      });

      return NextResponse.json({
        success: true,
        message: action === 'REVOKE' ? 'চেম্বার বাতিল করা হয়েছে।' : 'অনুরোধটি বাতিল করা হয়েছে।',
      });
    }

    return NextResponse.json({ success: false, error: 'অজ্ঞাত অ্যাকশন।' }, { status: 400 });
  } catch (error: any) {
    console.error('Affiliation PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
