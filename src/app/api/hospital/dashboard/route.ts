import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalIdParam = searchParams.get('hospitalId');
    const session = await getSession().catch(() => null);

    // 1. Fetch all hospitals for quick switching/picker
    const allHospitals = await db.hospital.findMany({
      where: { status: { in: ['ACTIVE', 'PENDING'] } },
      select: {
        id: true,
        name: true,
        slug: true,
        hospitalType: true,
        address: true,
        phone: true,
        emergencyPhone: true,
        email: true,
        logoUrl: true,
        coverUrl: true,
        licenseNumber: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    });

    if (allHospitals.length === 0) {
      return NextResponse.json({ success: false, error: 'কোনো হাসপাতাল ডাটাবেজে পাওয়া যায়নি।' }, { status: 404 });
    }

    // Determine targeted hospital
    let targetHospitalId = hospitalIdParam;
    if (!targetHospitalId && session?.hospitalId) {
      targetHospitalId = session.hospitalId;
    }
    if (!targetHospitalId) {
      // Find Chuadanga Medical Center first, or first hospital
      const cmc = allHospitals.find((h) => h.slug.includes('chuadanga-medical-center') || h.name.includes('Chuadanga Medical Center'));
      targetHospitalId = cmc ? cmc.id : allHospitals[0].id;
    }

    const hospital = await db.hospital.findUnique({
      where: { id: targetHospitalId },
      include: {
        facilities: true,
        departments: true,
        testAvailabilities: {
          include: { test: true },
        },
      },
    });

    if (!hospital) {
      return NextResponse.json({ success: false, error: 'হাসপাতাল পাওয়া যায়নি।' }, { status: 404 });
    }

    // 2. Fetch pending affiliation requests for this hospital
    const pendingAffiliations = await db.doctorSchedule.findMany({
      where: {
        hospitalId: hospital.id,
        approvalStatus: 'PENDING',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            slug: true,
            bmdcNumber: true,
            degrees: true,
            specialization: true,
            photoUrl: true,
            phone: true,
            email: true,
            experienceYears: true,
            consultationFee: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Fetch approved doctors & schedules for this hospital
    const approvedSchedules = await db.doctorSchedule.findMany({
      where: {
        hospitalId: hospital.id,
        approvalStatus: 'APPROVED',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            slug: true,
            bmdcNumber: true,
            degrees: true,
            specialization: true,
            photoUrl: true,
            phone: true,
            consultationFee: true,
          },
        },
      },
      orderBy: [{ roomNumber: 'asc' }, { dayOfWeek: 'asc' }],
    });

    // Also include direct hospital doctors if they don't have explicit schedules yet
    const directDoctors = await db.doctor.findMany({
      where: {
        hospitalId: hospital.id,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bmdcNumber: true,
        degrees: true,
        specialization: true,
        photoUrl: true,
        phone: true,
        chamberRoom: true,
        consultationFee: true,
      },
    });

    // 4. Today's appointments count
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointmentsCount = await db.appointment.count({
      where: {
        hospitalId: hospital.id,
        appointmentDate: todayStr,
      },
    }).catch(() => 0);

    // Group approved doctors uniquely
    const approvedDoctorsMap = new Map<string, any>();
    
    // Add direct doctors
    directDoctors.forEach((doc) => {
      approvedDoctorsMap.set(doc.id, {
        ...doc,
        source: 'DIRECT',
        schedules: [],
      });
    });

    // Merge approved schedules
    approvedSchedules.forEach((sch) => {
      if (sch.doctor) {
        if (!approvedDoctorsMap.has(sch.doctor.id)) {
          approvedDoctorsMap.set(sch.doctor.id, {
            ...sch.doctor,
            chamberRoom: sch.roomNumber || 'চেম্বার রুম',
            source: 'AFFILIATED',
            schedules: [sch],
          });
        } else {
          const existing = approvedDoctorsMap.get(sch.doctor.id);
          existing.schedules.push(sch);
        }
      }
    });

    const approvedDoctors = Array.from(approvedDoctorsMap.values());

    return NextResponse.json({
      success: true,
      hospital,
      hospitalsList: allHospitals,
      stats: {
        totalDoctors: approvedDoctors.length,
        pendingRequestsCount: pendingAffiliations.length,
        todayAppointmentsCount,
        facilitiesCount: hospital.facilities.length,
      },
      pendingAffiliations,
      approvedDoctors,
      approvedSchedules,
    });
  } catch (error: any) {
    console.error('Hospital dashboard API error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
