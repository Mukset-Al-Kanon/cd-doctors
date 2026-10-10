import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: 'হাসপাতাল আইডি প্রদান করুন।' }, { status: 400 });
    }

    const hospital = await db.hospital.findFirst({
      where: {
        OR: [
          { id: hospitalId },
          { slug: hospitalId },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
      },
    });

    if (!hospital) {
      return NextResponse.json({ success: false, error: 'হাসপাতাল খুঁজে পাওয়া যায়নি।' }, { status: 404 });
    }

    const doctors = await db.doctor.findMany({
      where: { hospitalId: hospital.id, status: 'ACTIVE' },
      include: {
        department: { select: { nameBn: true, nameEn: true } },
      },
      orderBy: { name: 'asc' },
    });

    const appointments = await db.appointment.findMany({
      where: {
        hospitalId: hospital.id,
        appointmentDate: date,
      },
      orderBy: { serialNumber: 'asc' },
    });

    let grandTotalPatients = 0;
    let grandCompletedPatients = 0;
    let grandWaitingPatients = 0;
    let grandCancelledPatients = 0;
    let grandTotalRevenue = 0;
    let grandWalkInCount = 0;
    let grandOnlinePhoneCount = 0;

    const doctorReports = doctors.map((doc) => {
      const docAppts = appointments.filter((a) => a.doctorId === doc.id);
      const total = docAppts.length;
      const completed = docAppts.filter((a) => a.queueStatus === 'COMPLETED').length;
      const waiting = docAppts.filter((a) => a.queueStatus === 'WAITING' || a.queueStatus === 'CALLING' || a.queueStatus === 'IN_CONSULTATION').length;
      const cancelled = docAppts.filter((a) => a.queueStatus === 'CANCELLED' || a.queueStatus === 'SKIPPED').length;
      const walkIns = docAppts.filter((a) => a.isWalkIn).length;
      const onlinePhone = total - walkIns;
      const collectedFee = completed * (doc.consultationFee || 0);

      grandTotalPatients += total;
      grandCompletedPatients += completed;
      grandWaitingPatients += waiting;
      grandCancelledPatients += cancelled;
      grandTotalRevenue += collectedFee;
      grandWalkInCount += walkIns;
      grandOnlinePhoneCount += onlinePhone;

      return {
        doctorId: doc.id,
        name: doc.name,
        degrees: doc.degrees,
        specialization: doc.specialization,
        chamberRoom: doc.chamberRoom,
        consultationFee: doc.consultationFee || 0,
        totalPatients: total,
        completedPatients: completed,
        waitingPatients: waiting,
        cancelledPatients: cancelled,
        walkInCount: walkIns,
        onlinePhoneCount: onlinePhone,
        totalRevenue: collectedFee,
      };
    });

    return NextResponse.json({
      success: true,
      hospital,
      date,
      dateBangla: toBanglaDigits(date),
      summary: {
        grandTotalPatients,
        grandCompletedPatients,
        grandWaitingPatients,
        grandCancelledPatients,
        grandTotalRevenue,
        grandWalkInCount,
        grandOnlinePhoneCount,
        activeDoctorsCount: doctors.length,
      },
      doctorReports,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Daily report error:', error);
    return NextResponse.json({ success: false, error: error.message || 'রিপোর্ট তৈরি ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
