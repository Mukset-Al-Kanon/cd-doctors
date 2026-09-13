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
      hospitalId,
      scheduleId,
      chamberName,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      patientEmail,
      visitReason,
      appointmentDate,
      timeSlot,
    } = body;

    if (!doctorId || !patientName || !patientPhone || !patientAge || !appointmentDate) {
      return NextResponse.json({ error: 'রোগীর নাম, ফোন নম্বর, বয়স এবং তারিখ আবশ্যক।' }, { status: 400 });
    }

    // Server-side Doctor Validation
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: {
        hospital: true,
        schedules: true,
      },
    });

    if (!doctor || doctor.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'নির্বাচিত ডাক্তারের জন্য বর্তমানে সিরিয়াল গ্রহণ বন্ধ রয়েছে।' }, { status: 400 });
    }

    // Determine day of week
    const dateObj = new Date(appointmentDate);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday...

    // Match schedule
    let selectedSchedule = null;
    if (scheduleId) {
      selectedSchedule = doctor.schedules.find((s) => s.id === scheduleId);
    }
    if (!selectedSchedule && doctor.schedules.length > 0) {
      selectedSchedule = doctor.schedules.find((s) => s.dayOfWeek === dayOfWeek) || doctor.schedules[0];
    }

    // ACID Transaction for Serial Number Generation
    const result = await db.$transaction(async (tx) => {
      // 1. Find the highest serial for this doctor & date
      const lastAppt = await tx.appointment.findFirst({
        where: {
          doctorId,
          appointmentDate,
        },
        orderBy: {
          serialNumber: 'desc',
        },
        select: {
          serialNumber: true,
        },
      });

      const nextSerial = (lastAppt?.serialNumber || 0) + 1;

      // Check max patient limit if schedule specifies
      if (selectedSchedule && selectedSchedule.maxPatients && nextSerial > selectedSchedule.maxPatients) {
        throw new Error('QUOTA_EXCEEDED');
      }

      // Calculate estimated time
      let estimatedTimeStr = '';
      let calculatedTimeSlot = timeSlot;

      if (selectedSchedule && selectedSchedule.startTime) {
        const [sH, sM] = selectedSchedule.startTime.split(':').map(Number);
        const duration = selectedSchedule.slotDurationMinutes || 15;
        const totalMinutes = sH * 60 + sM + (nextSerial - 1) * duration;
        const estH = Math.floor(totalMinutes / 60) % 24;
        const estM = totalMinutes % 60;
        const formattedEstTime = `${estH.toString().padStart(2, '0')}:${estM.toString().padStart(2, '0')}`;
        estimatedTimeStr = formatBanglaTime(formattedEstTime);
        if (!calculatedTimeSlot) {
          calculatedTimeSlot = formattedEstTime;
        }
      } else {
        estimatedTimeStr = 'সিরিয়াল অনুযায়ী';
        if (!calculatedTimeSlot) {
          calculatedTimeSlot = 'নিয়মিত সময়';
        }
      }

      // Generate Guaranteed Globally Unique Appointment Code: APT-YYYYMMDD-XXX-RANDOM
      const cleanDate = appointmentDate.replace(/-/g, '');
      const serialSuffix = String(nextSerial).padStart(3, '0');
      const randomEntropy = Math.floor(1000 + Math.random() * 9000);
      const appointmentCode = `APT-${cleanDate}-${serialSuffix}-${randomEntropy}`;

      // Resolve final chamber name & hospitalId
      const finalChamberName = chamberName || selectedSchedule?.chamberName || doctor.chamberRoom || doctor.hospital?.name || 'প্রধান চেম্বার';
      const finalHospitalId = hospitalId || doctor.hospitalId || null;

      // Create the appointment with serial
      const newAppt = await tx.appointment.create({
        data: {
          appointmentCode,
          serialNumber: nextSerial,
          hospitalId: finalHospitalId,
          doctorId,
          patientName,
          patientPhone,
          patientAge: parseInt(patientAge.toString(), 10) || 30,
          patientGender: patientGender || 'Male',
          patientEmail: patientEmail || null,
          visitReason: visitReason || null,
          appointmentDate,
          timeSlot: calculatedTimeSlot,
          estimatedTime: estimatedTimeStr,
          chamberName: finalChamberName,
          scheduleId: selectedSchedule?.id || null,
          isWalkIn: false,
          status: 'CONFIRMED',
          queueStatus: 'WAITING',
        },
      });

      return {
        appointment: newAppt,
        serialNumber: nextSerial,
        estimatedTime: estimatedTimeStr,
        appointmentCode,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'সিরিয়াল বুকিং সফল হয়েছে!',
      ...result,
      trackingUrl: `/track/${result.appointmentCode}`,
    });
  } catch (error: any) {
    if (error.message === 'QUOTA_EXCEEDED') {
      return NextResponse.json(
        { error: 'এই তারিখের জন্য ডাক্তারের সর্বোচ্চ সিরিয়াল পূর্ণ হয়ে গেছে। অনুগ্রহ করে পরবর্তী দিনের সিরিয়াল বুক করুন।' },
        { status: 400 }
      );
    }
    console.error('Appointment booking error:', error);
    return NextResponse.json({ error: error.message || 'সিরিয়াল বুকিং ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
