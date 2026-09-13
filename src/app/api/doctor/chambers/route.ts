import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET all schedules/chambers for the current doctor
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const schedules = await db.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: [{ chamberName: 'asc' }, { dayOfWeek: 'asc' }],
    });

    return NextResponse.json({ success: true, schedules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add or update chamber schedules (supports single day, multi-day, or multi-shift schedules)
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      chamberName,
      chamberAddress,
      division,
      district,
      shifts, // Array of shifts e.g. [{ daysOfWeek: [6, 0, 1], startTime: "04:00 PM", endTime: "08:00 PM", consultationFee: 800 }]
      dayOfWeek,
      daysOfWeek,
      startTime,
      endTime,
      consultationFee,
      slotDurationMinutes,
      maxPatients,
      isTelemedicine,
    } = body;

    const createdSchedules = [];

    if (Array.isArray(shifts) && shifts.length > 0) {
      for (const shift of shifts) {
        const sDays: number[] = Array.isArray(shift.daysOfWeek) && shift.daysOfWeek.length > 0 ? shift.daysOfWeek : [5];
        const sStart = shift.startTime || '04:00 PM';
        const sEnd = shift.endTime || '08:00 PM';
        const sFee = shift.consultationFee ? parseInt(shift.consultationFee.toString(), 10) : (consultationFee ? parseInt(consultationFee.toString(), 10) : 800);

        for (const day of sDays) {
          const schedule = await db.doctorSchedule.create({
            data: {
              doctorId,
              chamberName: chamberName || 'প্রধান চেম্বার',
              chamberAddress: chamberAddress || null,
              division: division || null,
              district: district || null,
              dayOfWeek: parseInt(day.toString(), 10),
              startTime: sStart,
              endTime: sEnd,
              consultationFee: sFee,
              slotDurationMinutes: slotDurationMinutes ? parseInt(slotDurationMinutes.toString(), 10) : 20,
              maxPatients: maxPatients ? parseInt(maxPatients.toString(), 10) : 20,
              isTelemedicine: Boolean(isTelemedicine),
            },
          });
          createdSchedules.push(schedule);
        }
      }
    } else {
      if (!startTime || !endTime) {
        return NextResponse.json({ success: false, error: 'শুরুর সময় ও শেষের সময় দেওয়া আবশ্যক।' }, { status: 400 });
      }

      const targetDays: number[] = Array.isArray(daysOfWeek) && daysOfWeek.length > 0 
        ? daysOfWeek 
        : dayOfWeek !== undefined ? [parseInt(dayOfWeek.toString(), 10)] : [5];

      if (targetDays.length === 0) {
        return NextResponse.json({ success: false, error: 'কমপক্ষে একটি দিন নির্বাচন করুন।' }, { status: 400 });
      }

      for (const day of targetDays) {
        const schedule = await db.doctorSchedule.create({
          data: {
            doctorId,
            chamberName: chamberName || 'প্রধান চেম্বার',
            chamberAddress: chamberAddress || null,
            division: division || null,
            district: district || null,
            dayOfWeek: parseInt(day.toString(), 10),
            startTime,
            endTime,
            consultationFee: consultationFee ? parseInt(consultationFee.toString(), 10) : 500,
            slotDurationMinutes: slotDurationMinutes ? parseInt(slotDurationMinutes.toString(), 10) : 20,
            maxPatients: maxPatients ? parseInt(maxPatients.toString(), 10) : 20,
            isTelemedicine: Boolean(isTelemedicine),
          },
        });
        createdSchedules.push(schedule);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdSchedules.length} টি চেম্বার শিডিউল সফলভাবে যুক্ত হয়েছে।`,
      schedules: createdSchedules,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a specific schedule or all schedules under a chamber
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');
    const chamberName = searchParams.get('chamberName');

    if (scheduleId) {
      // Verify ownership & delete single schedule
      const schedule = await db.doctorSchedule.findFirst({
        where: { id: scheduleId, doctorId },
      });

      if (!schedule) {
        return NextResponse.json({ success: false, error: 'শিডিউলটি পাওয়া যায়নি।' }, { status: 404 });
      }

      await db.doctorSchedule.delete({ where: { id: scheduleId } });
      return NextResponse.json({ success: true, message: 'শিডিউল মুছে ফেলা হয়েছে।' });
    }

    if (chamberName) {
      // Delete all schedules matching chamberName for this doctor
      await db.doctorSchedule.deleteMany({
        where: { doctorId, chamberName },
      });
      return NextResponse.json({ success: true, message: `"${chamberName}" চেম্বারের সকল শিডিউল মুছে ফেলা হয়েছে।` });
    }

    return NextResponse.json({ success: false, error: 'Schedule ID or Chamber Name is required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
