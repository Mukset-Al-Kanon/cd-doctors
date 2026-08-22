import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = await db.doctor.findUnique({
      where: { id: params.id },
      include: {
        hospital: { select: { id: true, name: true, phone: true } },
        department: true,
        schedules: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, doctor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const body = await request.json();
    const {
      name,
      photoUrl,
      posterUrl,
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
      departmentId,
      status,
      availableDays, // Array of numbers e.g. [6, 0, 1, 2, 3, 4]
    } = body;

    // Verify doctor exists before updating
    const existingDoctor = await db.doctor.findUnique({
      where: { id: params.id },
    });

    if (!existingDoctor) {
      return NextResponse.json({ 
        error: 'Doctor record not found in database. Please refresh the page to reload active doctor profiles.' 
      }, { status: 404 });
    }

    // Auto-generate slug if missing or changed
    let doctorSlug = existingDoctor.slug;
    if (name && name !== existingDoctor.name) {
      let baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (!baseSlug) baseSlug = 'doctor';
      doctorSlug = baseSlug;
      let counter = 1;
      while (await db.doctor.findFirst({ where: { slug: doctorSlug, NOT: { id: params.id } } })) {
        doctorSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updateData: any = {
      name: name || existingDoctor.name,
      slug: doctorSlug,
      degrees: degrees || existingDoctor.degrees,
      specialization: specialization || existingDoctor.specialization,
      bmdcNumber: bmdcNumber || existingDoctor.bmdcNumber,
      experienceYears: experienceYears !== undefined ? Number(experienceYears) : existingDoctor.experienceYears,
      bio: bio !== undefined ? bio : existingDoctor.bio,
      treatedDiseases: treatedDiseases !== undefined ? treatedDiseases : (existingDoctor as any).treatedDiseases || null,
      consultationFee: consultationFee !== undefined ? Number(consultationFee) : existingDoctor.consultationFee,
      chamberRoom: chamberRoom || existingDoctor.chamberRoom,
      phone: phone || existingDoctor.phone,
      photoUrl: photoUrl || existingDoctor.photoUrl,
      posterUrl: posterUrl !== undefined ? (posterUrl || null) : (existingDoctor as any).posterUrl,
      status: status || existingDoctor.status,
    };

    if (hospitalId && hospitalId !== existingDoctor.hospitalId) {
      updateData.hospital = { connect: { id: hospitalId } };
    }

    if (departmentId && departmentId !== existingDoctor.departmentId) {
      updateData.department = { connect: { id: departmentId } };
    }

    const doctor = await db.doctor.update({
      where: { id: params.id },
      data: updateData,
    });

    // Update schedules if availableDays is provided
    if (Array.isArray(availableDays) && availableDays.length > 0) {
      await db.doctorSchedule.deleteMany({ where: { doctorId: params.id } });
      for (const day of availableDays) {
        await db.doctorSchedule.create({
          data: {
            doctorId: params.id,
            dayOfWeek: day,
            startTime: '17:00',
            endTime: '20:00',
            slotDurationMinutes: 20,
            maxPatients: 15,
          },
        });
      }
    }

    try {
      await db.auditLog.create({
        data: {
          userId: user.userId,
          hospitalId: doctor.hospitalId,
          action: 'DOCTOR_UPDATED_BY_ADMIN',
          details: `Updated doctor ${name} details and schedules.`,
        },
      });
    } catch (e) {
      console.log('Audit log skipped');
    }

    return NextResponse.json({ success: true, doctor });
  } catch (error: any) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: error.message || 'Server error while updating doctor.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);

    const existingDoctor = await db.doctor.findUnique({
      where: { id: params.id },
    });

    if (!existingDoctor) {
      return NextResponse.json({ 
        error: 'Doctor record not found or already deleted. Please refresh the page.' 
      }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.doctorSchedule.deleteMany({ where: { doctorId: params.id } });
      await tx.appointment.deleteMany({ where: { doctorId: params.id } });
      await tx.review.deleteMany({ where: { doctorId: params.id } });
      await tx.doctor.delete({ where: { id: params.id } });

      try {
        await tx.auditLog.create({
          data: {
            userId: user.userId,
            action: 'DOCTOR_DELETED_BY_ADMIN',
            details: `Deleted doctor ID ${params.id}`,
          },
        });
      } catch (e) {
        console.log('Audit log skipped');
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: error.message || 'Server error while deleting doctor.' }, { status: 500 });
  }
}
