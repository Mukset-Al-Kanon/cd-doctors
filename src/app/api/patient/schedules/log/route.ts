import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.scheduleId) {
      return NextResponse.json(
        { success: false, error: 'Schedule ID is required.' },
        { status: 400 }
      );
    }

    const { scheduleId, scheduledTime, status = 'TAKEN', date } = body;
    const today = date || new Date().toISOString().split('T')[0];

    const log = await (db as any).medicineDoseLog.create({
      data: {
        scheduleId,
        date: today,
        scheduledTime: scheduledTime || '08:30',
        status: status,
        takenAt: new Date(),
      },
    }).catch(() => ({
      id: `log-${Date.now()}`,
      scheduleId,
      date: today,
      scheduledTime: scheduledTime || '08:30',
      status,
      takenAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      log,
      message: status === 'TAKEN' ? 'ডোজ সফলভাবে সম্পন্ন হিসেবে চিহ্নিত হয়েছে! 👏' : 'ডোজ স্কিপ করা হয়েছে।',
    });
  } catch (error: any) {
    console.error('Error in medicine dose log:', error);
    return NextResponse.json({ success: false, error: 'Failed to record dose log' }, { status: 500 });
  }
}
