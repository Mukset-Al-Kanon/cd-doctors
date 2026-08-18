import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const hospital = await db.hospital.findUnique({
      where: { id: params.id },
      include: {
        facilities: true,
        district: true,
        doctors: {
          include: {
            department: true,
            schedules: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { doctors: true, departments: true } },
      },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json({ hospital });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const body = await request.json();
    const {
      name,
      hospitalType,
      address,
      phone,
      emergencyPhone,
      email,
      website,
      googleMapUrl,
      licenseNumber,
      description,
      status,
      isFeatured,
      facilitiesText,
      logoUrl,
      coverUrl,
    } = body;

    const hospital = await db.$transaction(async (tx) => {
      const updated = await tx.hospital.update({
        where: { id: params.id },
        data: {
          name,
          hospitalType,
          address,
          phone,
          emergencyPhone,
          email,
          website,
          googleMapUrl: googleMapUrl !== undefined ? googleMapUrl : undefined,
          licenseNumber,
          description,
          logoUrl: logoUrl !== undefined ? logoUrl : undefined,
          coverUrl: coverUrl !== undefined ? coverUrl : undefined,
          status,
          isFeatured: Boolean(isFeatured),
        },
      });

      if (facilitiesText !== undefined) {
        await tx.hospitalFacility.deleteMany({ where: { hospitalId: params.id } });
        const facs = facilitiesText.split(',').map((s: string) => s.trim()).filter(Boolean);
        for (const f of facs) {
          await tx.hospitalFacility.create({
            data: {
              hospitalId: params.id,
              facilityName: f,
              isAvailable: true,
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: user.userId,
          hospitalId: params.id,
          action: 'HOSPITAL_UPDATED_BY_ADMIN',
          details: `Updated hospital profile/cover photos and details for ${name}.`,
        },
      });

      return updated;
    });

    return NextResponse.json({ hospital });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);

    await db.$transaction(async (tx) => {
      await tx.hospitalFacility.deleteMany({ where: { hospitalId: params.id } });
      await tx.doctorSchedule.deleteMany({ where: { doctor: { hospitalId: params.id } } });
      await tx.doctor.deleteMany({ where: { hospitalId: params.id } });
      await tx.department.deleteMany({ where: { hospitalId: params.id } });
      await tx.appointment.deleteMany({ where: { hospitalId: params.id } });
      await tx.review.deleteMany({ where: { hospitalId: params.id } });

      await tx.hospital.delete({
        where: { id: params.id },
      });

      await tx.auditLog.create({
        data: {
          userId: user.userId,
          action: 'HOSPITAL_DELETED_BY_ADMIN',
          details: `Deleted hospital ID ${params.id}`,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
