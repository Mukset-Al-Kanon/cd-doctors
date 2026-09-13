import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const phone = searchParams.get('phone');
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    let targetAppointment: any = null;
    let targetDoctorId = doctorId;
    let targetDate = date;

    // 1. If code or phone provided, look up the patient appointment
    if (code) {
      targetAppointment = await db.appointment.findUnique({
        where: { appointmentCode: code },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              degrees: true,
              chamberRoom: true,
              photoUrl: true,
              phone: true,
              hospital: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      if (targetAppointment) {
        targetDoctorId = targetAppointment.doctorId;
        targetDate = targetAppointment.appointmentDate;
      }
    } else if (phone) {
      targetAppointment = await db.appointment.findFirst({
        where: {
          patientPhone: phone,
          appointmentDate: date,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              degrees: true,
              chamberRoom: true,
              photoUrl: true,
              phone: true,
              hospital: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      if (targetAppointment) {
        targetDoctorId = targetAppointment.doctorId;
        targetDate = targetAppointment.appointmentDate;
      }
    }

    if (!targetDoctorId) {
      return NextResponse.json(
        { error: 'ডাক্তারের আইডি বা অ্যাপয়েন্টমেন্ট কোড দেওয়া আবশ্যক।' },
        { status: 400 }
      );
    }

    // 2. Fetch doctor info if not loaded
    const doctor = targetAppointment?.doctor || await db.doctor.findUnique({
      where: { id: targetDoctorId },
      select: {
        id: true,
        name: true,
        specialization: true,
        degrees: true,
        chamberRoom: true,
        photoUrl: true,
        phone: true,
        hospital: {
          select: {
            name: true,
            phone: true,
          },
        },
        schedules: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'ডাক্তার পাওয়া যায়নি।' }, { status: 404 });
    }

    // 3. Fetch all appointments for this doctor & date
    const allAppointments = await db.appointment.findMany({
      where: {
        doctorId: targetDoctorId,
        appointmentDate: targetDate,
      },
      orderBy: [
        { serialNumber: 'asc' },
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        appointmentCode: true,
        serialNumber: true,
        patientName: true,
        patientPhone: true,
        patientAge: true,
        patientGender: true,
        chamberName: true,
        timeSlot: true,
        estimatedTime: true,
        status: true,
        queueStatus: true,
        calledAt: true,
        completedAt: true,
        isWalkIn: true,
      },
    });

    // 4. Calculate Queue States
    // Currently Active: IN_CONSULTATION or CALLING
    const activeAppointment = allAppointments.find(
      (a) => a.queueStatus === 'IN_CONSULTATION' || a.queueStatus === 'CALLING'
    );

    // If none active, find last completed or first waiting
    const lastCompleted = allAppointments
      .filter((a) => a.queueStatus === 'COMPLETED')
      .pop();

    const currentServingSerial = activeAppointment
      ? activeAppointment.serialNumber
      : lastCompleted
      ? lastCompleted.serialNumber
      : (allAppointments.find((a) => a.queueStatus === 'WAITING')?.serialNumber ? 0 : 0);

    const totalCount = allAppointments.length;
    const completedCount = allAppointments.filter((a) => a.queueStatus === 'COMPLETED').length;
    const waitingCount = allAppointments.filter((a) => a.queueStatus === 'WAITING').length;
    const skippedCount = allAppointments.filter((a) => a.queueStatus === 'SKIPPED').length;

    // 5. Patient Specific Position
    let patientPositionInfo = null;
    if (targetAppointment && targetAppointment.serialNumber) {
      const mySerial = targetAppointment.serialNumber;
      
      // Count waiting patients before this patient
      const patientsAhead = allAppointments.filter(
        (a) =>
          (a.serialNumber || 0) < mySerial &&
          (a.queueStatus === 'WAITING' || a.queueStatus === 'CALLING' || a.queueStatus === 'IN_CONSULTATION')
      ).length;

      const slotDuration = 15; // default 15 min per patient
      const estimatedWaitMinutes = patientsAhead * slotDuration;

      patientPositionInfo = {
        serialNumber: mySerial,
        appointmentCode: targetAppointment.appointmentCode,
        patientName: targetAppointment.patientName,
        patientPhone: targetAppointment.patientPhone,
        queueStatus: targetAppointment.queueStatus,
        estimatedTime: targetAppointment.estimatedTime,
        chamberName: targetAppointment.chamberName,
        patientsAhead,
        estimatedWaitMinutes,
        isNextInLine: patientsAhead <= 1 && targetAppointment.queueStatus === 'WAITING',
      };
    }

    return NextResponse.json({
      success: true,
      date: targetDate,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        degrees: doctor.degrees,
        chamberRoom: doctor.chamberRoom,
        photoUrl: doctor.photoUrl,
        phone: doctor.phone || doctor.hospital?.phone,
        hospitalName: doctor.hospital?.name,
      },
      currentServing: {
        serialNumber: currentServingSerial || (activeAppointment?.serialNumber || 0),
        status: activeAppointment?.queueStatus || (lastCompleted ? 'COMPLETED' : 'WAITING_TO_START'),
        patientName: activeAppointment ? activeAppointment.patientName : null,
        calledAt: activeAppointment?.calledAt || null,
      },
      stats: {
        total: totalCount,
        completed: completedCount,
        waiting: waitingCount,
        skipped: skippedCount,
      },
      patientInfo: patientPositionInfo,
      queueList: allAppointments.map((a) => ({
        serialNumber: a.serialNumber,
        appointmentCode: a.appointmentCode,
        patientName: a.patientName ? `${a.patientName.slice(0, 1)}***` : 'রোগী',
        queueStatus: a.queueStatus,
        estimatedTime: a.estimatedTime,
        isWalkIn: a.isWalkIn,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Live queue error:', error);
    return NextResponse.json({ error: error.message || 'লাইভ কিউ লোড করতে ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
