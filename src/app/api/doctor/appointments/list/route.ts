import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const appointments = await db.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: date,
      },
      orderBy: [
        { serialNumber: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // Compute stats
    const total = appointments.length;
    const completed = appointments.filter((a) => a.queueStatus === 'COMPLETED').length;
    const waiting = appointments.filter((a) => a.queueStatus === 'WAITING').length;
    const calling = appointments.filter((a) => a.queueStatus === 'CALLING').length;
    const inConsultation = appointments.filter((a) => a.queueStatus === 'IN_CONSULTATION').length;
    const skipped = appointments.filter((a) => a.queueStatus === 'SKIPPED').length;

    const currentActive = appointments.find(
      (a) => a.queueStatus === 'IN_CONSULTATION' || a.queueStatus === 'CALLING'
    ) || null;

    return NextResponse.json({
      success: true,
      date,
      appointments,
      stats: {
        total,
        completed,
        waiting,
        calling,
        inConsultation,
        skipped,
      },
      currentActive,
    });
  } catch (error: any) {
    console.error('Doctor appointments list error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch appointments' }, { status: 500 });
  }
}
