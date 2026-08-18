import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN', 'HOSPITAL_ADMIN', 'HOSPITAL_STAFF']);
    const doctors = await db.doctor.findMany({
      include: {
        hospital: { select: { id: true, name: true, hospitalType: true } },
        department: { select: { id: true, nameEn: true } },
        schedules: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ doctors });
  } catch (error: any) {
    // Return empty doctors list with 200 instead of breaking page if auth fails or fallback
    return NextResponse.json({ doctors: [], error: error.message || 'Unauthorized' });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const body = await request.json();
    const {
      name,
      photoUrl,
      degrees,
      specialization,
      bmdcNumber,
      experienceYears,
      bio,
      treatedDiseases,
      consultationFee,
      chamberRoom,
      phone,
      hospitalId,
      assignedHospitalIds, // Array of hospital IDs selected by admin
      availableDays, // Array of numbers e.g. [6, 0, 1, 2, 3, 4] (6=Sat, 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri)
      departmentId,
      status,
    } = body;

    if (!name || !degrees || !specialization || !bmdcNumber) {
      return NextResponse.json({ error: 'Please fill in all required doctor fields.' }, { status: 400 });
    }

    // Target hospitals list
    const targetHospitalIds: string[] = Array.isArray(assignedHospitalIds) && assignedHospitalIds.length > 0
      ? assignedHospitalIds
      : hospitalId ? [hospitalId] : [];

    if (targetHospitalIds.length === 0) {
      return NextResponse.json({ error: 'Please select at least one hospital for the doctor.' }, { status: 400 });
    }

    // Selected available days of the week (default Sat-Thu if none selected)
    const daysToSchedule: number[] = Array.isArray(availableDays) && availableDays.length > 0
      ? availableDays
      : [6, 0, 1, 2, 3, 4];

    // Reference department name
    let departmentName = specialization;
    if (departmentId) {
      const refDept = await db.department.findUnique({ where: { id: departmentId } });
      if (refDept) departmentName = refDept.nameEn;
    }

    const createdDoctors = [];

    // Create doctor for each assigned hospital
    for (const hId of targetHospitalIds) {
      // Find or create matching department in target hospital
      let targetDept = await db.department.findFirst({
        where: { hospitalId: hId, nameEn: departmentName },
      });

      if (!targetDept) {
        targetDept = await db.department.findFirst({ where: { hospitalId: hId } });
      }

      if (!targetDept) {
        targetDept = await db.department.create({
          data: {
            hospitalId: hId,
            nameEn: departmentName,
            nameBn: departmentName,
            description: `${departmentName} Department`,
          },
        });
      }

      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

      const doctor = await db.doctor.create({
        data: {
          hospitalId: hId,
          departmentId: targetDept.id,
          name,
          slug,
          degrees,
          specialization,
          bmdcNumber,
          experienceYears: Number(experienceYears) || 5,
          bio: bio || `Senior consultant in ${specialization}.`,
          treatedDiseases: treatedDiseases || null,
          consultationFee: Number(consultationFee) || 800,
          chamberRoom: chamberRoom || 'Chamber 101',
          phone: phone || '+880 1800-000000',
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
          status: status || 'ACTIVE',
        },
      });

      // Create weekly schedules for the selected available days
      for (const day of daysToSchedule) {
        await db.doctorSchedule.create({
          data: {
            doctorId: doctor.id,
            dayOfWeek: day,
            startTime: '17:00',
            endTime: '20:00',
            slotDurationMinutes: 20,
            maxPatients: 15,
          },
        });
      }

      try {
        await db.auditLog.create({
          data: {
            userId: user.userId,
            hospitalId: hId,
            action: 'DOCTOR_ASSIGNED_BY_ADMIN',
            details: `Assigned doctor ${name} with ${daysToSchedule.length} available days to hospital.`,
          },
        });
      } catch (e) {
        console.log('Audit log skipped');
      }

      createdDoctors.push(doctor);
    }

    return NextResponse.json({ success: true, count: createdDoctors.length, doctors: createdDoctors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
