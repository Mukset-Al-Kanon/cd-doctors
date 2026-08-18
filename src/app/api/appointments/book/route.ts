import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      doctorId,
      hospitalId,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      patientEmail,
      visitReason,
      appointmentDate,
      timeSlot,
    } = body;

    if (!doctorId || !hospitalId || !patientName || !patientPhone || !patientAge || !patientGender || !appointmentDate || !timeSlot) {
      return NextResponse.json({ error: 'Missing required appointment fields.' }, { status: 400 });
    }

    // Server-side Doctor & Hospital Validation
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: { hospital: true },
    });

    if (!doctor || doctor.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Selected doctor is currently not accepting appointments.' }, { status: 400 });
    }

    if (doctor.hospital.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Selected hospital is not active.' }, { status: 400 });
    }

    // ACID Transaction for Double-Booking Prevention
    const appointment = await db.$transaction(async (tx) => {
      // 1. Check existing booking on exact doctor, date, and time slot
      const existing = await tx.appointment.findFirst({
        where: {
          doctorId,
          appointmentDate,
          timeSlot,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      });

      if (existing) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      // Generate Appointment Code: APT-YYYYMMDD-XXXXX
      const cleanDate = appointmentDate.replace(/-/g, '');
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const appointmentCode = `APT-${cleanDate}-${randomSuffix}`;

      // 2. Create the appointment
      const newAppt = await tx.appointment.create({
        data: {
          appointmentCode,
          hospitalId,
          doctorId,
          patientName,
          patientPhone,
          patientAge: parseInt(patientAge.toString()),
          patientGender,
          patientEmail: patientEmail || null,
          visitReason: visitReason || null,
          appointmentDate,
          timeSlot,
          status: 'CONFIRMED',
        },
      });

      return newAppt;
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment,
    });
  } catch (error: any) {
    if (error.message === 'SLOT_ALREADY_BOOKED' || error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This time slot was just booked by another patient. Please select another slot.' },
        { status: 409 }
      );
    }
    console.error('Appointment booking error:', error);
    return NextResponse.json({ error: error.message || 'Failed to book appointment' }, { status: 500 });
  }
}
