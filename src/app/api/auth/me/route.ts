import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    let userRecord: any = null;
    try {
      userRecord = await db.user.findUnique({
        where: { id: session.userId },
        select: { phone: true, name: true, email: true },
      }).catch(() => null);
    } catch (e) {
      // Ignore
    }

    let isDonor = false;
    let donorStatus: string | null = null;
    let donorBloodGroup: string | null = null;
    let donorAvailability: string | null = null;

    if (userRecord?.phone) {
      try {
        const existingDonorByPhone = await db.bloodDonor.findFirst({
          where: {
            OR: [
              { phone: userRecord.phone },
              { fullName: userRecord.name },
            ],
          },
          select: { id: true, status: true, bloodGroup: true, availability: true },
        }).catch(() => null);

        if (existingDonorByPhone) {
          isDonor = true;
          donorStatus = existingDonorByPhone.status;
          donorBloodGroup = existingDonorByPhone.bloodGroup;
          donorAvailability = existingDonorByPhone.availability;
        }
      } catch (e) {
        // Ignore
      }
    }

    let hospital = null;
    if (session.hospitalId) {
      try {
        hospital = await db.hospital.findUnique({
          where: { id: session.hospitalId },
          select: { id: true, name: true, slug: true, status: true, logoUrl: true },
        }).catch(() => null);
      } catch (e) {
        // Ignore
      }
    }

    return NextResponse.json({
      user: {
        ...session,
        phone: userRecord?.phone || null,
        isDonor,
        donorStatus,
        donorBloodGroup,
        donorAvailability,
      },
      hospital,
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
