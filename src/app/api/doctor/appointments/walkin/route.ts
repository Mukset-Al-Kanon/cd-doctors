import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function formatBanglaTime(timeStr: string): string {
  if (!timeStr) return '';
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return timeStr;
  let hour = parseInt(match[1], 10);
  const min = match[2];
  let period = 'সকাল';
  if (hour >= 12 && hour < 15) period = 'দুপুর';
  else if (hour >= 15 && hour < 18) period = 'বিকাল';
  else if (hour >= 18 && hour < 20) period = 'সন্ধ্যা';
  else if (hour >= 20 || hour < 5) period = 'রাত';
  
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  const toBangla = (n: number | string) => n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
  return `${period} ${toBangla(displayHour)}:${toBangla(min)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      doctorId,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      chamberName,
      visitReason,
      appointmentDate,
    } = body;

    if (!doctorId || !patientName) {
      return NextResponse.json({ error: 'রোগীর নাম আবশ্যক।' }, { status: 400 });
    }

    const todayDate = appointmentDate || new Date().toISOString().split('T')[0];

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: {
        schedules: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'ডাক্তার পাওয়া যায়নি।' }, { status: 404 });
    }

    const dateObj = new Date(todayDate);
    const dayOfWeek = dateObj.getDay();
    const schedule = doctor.schedules.find((s) => s.dayOfWeek === dayOfWeek) || doctor.schedules[0];

    const result = await db.$transaction(async (tx) => {
      const lastAppt = await tx.appointment.findFirst({
        where: {
          doctorId,
          appointmentDate: todayDate,
        },
        orderBy: {
          serialNumber: 'desc',
        },
        select: {
          serialNumber: true,
        },
      });

      const nextSerial = (lastAppt?.serialNumber || 0) + 1;
      const cleanDate = todayDate.replace(/-/g, '');
      const serialSuffix = String(nextSerial).padStart(3, '0');
      const randomEntropy = Math.floor(1000 + Math.random() * 9000);
      const appointmentCode = `APT-${cleanDate}-${serialSuffix}-${randomEntropy}`;

      let estimatedTimeStr = '';
      if (schedule && schedule.startTime) {
        const [sH, sM] = schedule.startTime.split(':').map(Number);
        const duration = schedule.slotDurationMinutes || 15;
        const totalMinutes = sH * 60 + sM + (nextSerial - 1) * duration;
        const estH = Math.floor(totalMinutes / 60) % 24;
        const estM = totalMinutes % 60;
        const formattedEstTime = `${estH.toString().padStart(2, '0')}:${estM.toString().padStart(2, '0')}`;
        estimatedTimeStr = formatBanglaTime(formattedEstTime);
      } else {
        estimatedTimeStr = 'সিরিয়াল অনুযায়ী';
      }

      const finalChamber = chamberName || schedule?.chamberName || doctor.chamberAddress || doctor.chamberRoom || 'চেম্বার কাউন্টার';

      const appointment = await tx.appointment.create({
        data: {
          appointmentCode,
          serialNumber: nextSerial,
          hospitalId: doctor.hospitalId || null,
          doctorId,
          patientName,
          patientPhone: patientPhone || 'N/A',
          patientAge: parseInt((patientAge || 30).toString(), 10),
          patientGender: patientGender || 'Male',
          visitReason: visitReason || 'সরাসরি চেম্বার সিরিয়াল (Walk-in)',
          appointmentDate: todayDate,
          timeSlot: 'সরাসরি সিরিয়াল',
          estimatedTime: estimatedTimeStr,
          chamberName: finalChamber,
          scheduleId: schedule?.id || null,
          isWalkIn: true,
          status: 'CONFIRMED',
          queueStatus: 'WAITING',
        },
      });

      return {
        appointment,
        serialNumber: nextSerial,
        appointmentCode,
        estimatedTime: estimatedTimeStr,
      };
    });

    return NextResponse.json({
      success: true,
      message: `সিরিয়াল #${result.serialNumber} সফলভাবে যোগ করা হয়েছে।`,
      ...result,
    });
  } catch (error: any) {
    console.error('Walk-in booking error:', error);
    return NextResponse.json({ error: error.message || 'ওয়াক-ইন সিরিয়াল দিতে ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
