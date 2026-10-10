import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

// GET: Fetch all doctors and their live queues for a hospital
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalIdParam = searchParams.get('hospitalId');
    const hospitalSlug = searchParams.get('hospitalSlug');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get list of hospitals for switcher
    const allHospitals = await db.hospital.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        _count: { select: { doctors: true } },
      },
      orderBy: { name: 'asc' },
    });

    // Determine target hospital
    let hospital: any = null;
    if (hospitalIdParam) {
      hospital = allHospitals.find((h) => h.id === hospitalIdParam);
    } else if (hospitalSlug) {
      hospital = allHospitals.find((h) => h.slug === hospitalSlug);
    }
    if (!hospital && allHospitals.length > 0) {
      hospital = allHospitals[0];
    }

    if (!hospital) {
      return NextResponse.json({ success: false, error: 'কোনো সক্রিয় হাসপাতাল পাওয়া যায়নি।' }, { status: 404 });
    }

    // Fetch all active doctors for this hospital
    const doctors = await db.doctor.findMany({
      where: {
        hospitalId: hospital.id,
        status: 'ACTIVE',
      },
      include: {
        department: { select: { id: true, nameBn: true, nameEn: true } },
        schedules: true,
      },
      orderBy: { name: 'asc' },
    });

    // Fetch all appointments for these doctors on the selected date
    const doctorIds = doctors.map((d) => d.id);
    const appointments = await db.appointment.findMany({
      where: {
        doctorId: { in: doctorIds },
        appointmentDate: date,
      },
      orderBy: { serialNumber: 'asc' },
    });

    // Group appointments by doctor
    const apptMap: Record<string, any[]> = {};
    for (const appt of appointments) {
      if (!apptMap[appt.doctorId]) apptMap[appt.doctorId] = [];
      apptMap[appt.doctorId].push(appt);
    }

    let totalToday = 0;
    let waitingToday = 0;
    let callingToday = 0;
    let inConsultationToday = 0;
    let completedToday = 0;
    let totalRevenueToday = 0;

    const doctorQueues = doctors.map((doc) => {
      const docAppts = apptMap[doc.id] || [];
      const total = docAppts.length;
      const waiting = docAppts.filter((a) => a.queueStatus === 'WAITING').length;
      const calling = docAppts.filter((a) => a.queueStatus === 'CALLING');
      const inConsultation = docAppts.filter((a) => a.queueStatus === 'IN_CONSULTATION');
      const completed = docAppts.filter((a) => a.queueStatus === 'COMPLETED').length;
      const skipped = docAppts.filter((a) => a.queueStatus === 'SKIPPED').length;
      const cancelled = docAppts.filter((a) => a.queueStatus === 'CANCELLED').length;

      // Currently active serial: either currently in consultation or currently calling
      const activeAppt = inConsultation[0] || calling[0] || null;
      const runningSerial = activeAppt ? activeAppt.serialNumber : null;

      totalToday += total;
      waitingToday += waiting;
      callingToday += calling.length;
      inConsultationToday += inConsultation.length;
      completedToday += completed;
      totalRevenueToday += completed * (doc.consultationFee || 0);

      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        degrees: doc.degrees,
        chamberRoom: doc.chamberRoom,
        consultationFee: doc.consultationFee,
        phone: doc.phone,
        photoUrl: doc.photoUrl,
        department: doc.department,
        schedules: doc.schedules,
        stats: {
          total,
          waiting,
          calling: calling.length,
          inConsultation: inConsultation.length,
          completed,
          skipped,
          cancelled,
        },
        runningSerial,
        activeAppointment: activeAppt,
        appointments: docAppts,
      };
    });

    return NextResponse.json({
      success: true,
      hospital: {
        id: hospital.id,
        name: hospital.name,
        slug: hospital.slug,
        address: hospital.address,
        phone: hospital.phone,
      },
      hospitalsList: allHospitals,
      date,
      overallStats: {
        totalToday,
        waitingToday,
        callingToday,
        inConsultationToday,
        completedToday,
        totalRevenueToday,
        totalDoctors: doctors.length,
      },
      doctors: doctorQueues,
    });
  } catch (error: any) {
    console.error('Hospital reception queue error:', error);
    return NextResponse.json({ success: false, error: error.message || 'সার্ভার ত্রুটি হয়েছে।' }, { status: 500 });
  }
}

// POST: Rapid Walk-in or Phone Booking for any doctor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      hospitalId,
      doctorId,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      appointmentDate,
      visitReason,
      isWalkIn = true,
    } = body;

    if (!doctorId || !patientName || !patientPhone) {
      return NextResponse.json(
        { success: false, error: 'ডাক্তার, রোগীর নাম ও মোবাইল নম্বর আবশ্যক।' },
        { status: 400 }
      );
    }

    const date = appointmentDate || new Date().toISOString().split('T')[0];

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: { hospital: true, schedules: true },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'ডাক্তার খুঁজে পাওয়া যায়নি।' }, { status: 404 });
    }

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const schedule = doctor.schedules.find((s) => s.dayOfWeek === dayOfWeek) || doctor.schedules[0];

    // Atomically generate serial number and create appointment
    const newAppointment = await db.$transaction(async (tx) => {
      const lastAppt = await tx.appointment.findFirst({
        where: { doctorId, appointmentDate: date },
        orderBy: { serialNumber: 'desc' },
        select: { serialNumber: true },
      });

      const nextSerial = (lastAppt?.serialNumber || 0) + 1;

      let estimatedTimeStr = '';
      let calculatedTimeSlot = '16:00';

      if (schedule && schedule.startTime) {
        const [sH, sM] = schedule.startTime.split(':').map(Number);
        const duration = schedule.slotDurationMinutes || 15;
        const totalMinutes = sH * 60 + sM + (nextSerial - 1) * duration;
        const calcH = Math.floor(totalMinutes / 60);
        const calcM = totalMinutes % 60;
        calculatedTimeSlot = `${calcH.toString().padStart(2, '0')}:${calcM.toString().padStart(2, '0')}`;
        estimatedTimeStr = formatBanglaTime(calculatedTimeSlot);
      }

      const dateStr = date.replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const appointmentCode = `APT-${dateStr}-${nextSerial.toString().padStart(2, '0')}-${randomSuffix}`;

      const created = await tx.appointment.create({
        data: {
          appointmentCode,
          serialNumber: nextSerial,
          doctorId,
          hospitalId: doctor.hospitalId || hospitalId,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          patientAge: Number(patientAge) || 28,
          patientGender: patientGender || 'Male',
          visitReason: visitReason || (isWalkIn ? 'চেম্বার ওয়াক-ইন ভিজিট' : 'ফোন বুকিং'),
          appointmentDate: date,
          timeSlot: calculatedTimeSlot,
          estimatedTime: estimatedTimeStr,
          chamberName: doctor.hospital?.name || doctor.chamberAddress || 'হাসপাতাল চেম্বার',
          scheduleId: schedule?.id || null,
          isWalkIn,
          status: 'CONFIRMED',
          queueStatus: 'WAITING',
          paymentStatus: 'PENDING',
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      message: `সিরিয়াল নং ${newAppointment.serialNumber} সফলভাবে নিশ্চিত হয়েছে!`,
      appointment: newAppointment,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        degrees: doctor.degrees,
        chamberRoom: doctor.chamberRoom,
        consultationFee: doctor.consultationFee,
        hospitalName: doctor.hospital?.name,
        hospitalAddress: doctor.hospital?.address,
      },
    });
  } catch (error: any) {
    console.error('Fast booking error:', error);
    return NextResponse.json({ success: false, error: error.message || 'বুকিং সম্পন্ন করা সম্ভব হয়নি।' }, { status: 500 });
  }
}

// PATCH: Update Appointment Queue Status (CALLING, IN_CONSULTATION, COMPLETED, SKIPPED, CANCELLED)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, queueStatus } = body;

    if (!appointmentId || !queueStatus) {
      return NextResponse.json(
        { success: false, error: 'অ্যাপয়েন্টমেন্ট আইডি ও নতুন স্ট্যাটাস আবশ্যক।' },
        { status: 400 }
      );
    }

    const dataToUpdate: any = { queueStatus };
    if (queueStatus === 'CALLING') {
      dataToUpdate.calledAt = new Date();
    } else if (queueStatus === 'COMPLETED') {
      dataToUpdate.completedAt = new Date();
      dataToUpdate.status = 'COMPLETED';
      dataToUpdate.paymentStatus = 'PAID';
    } else if (queueStatus === 'CANCELLED') {
      dataToUpdate.status = 'CANCELLED';
    }

    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: dataToUpdate,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            chamberRoom: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'স্ট্যাটাস আপডেট সফল হয়েছে।',
      appointment: updated,
    });
  } catch (error: any) {
    console.error('Status update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
