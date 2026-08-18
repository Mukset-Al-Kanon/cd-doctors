import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const userRecord = await db.user.findUnique({
    where: { id: session.userId },
    select: { phone: true, name: true, email: true },
  });

  let isDonor = false;
  let donorStatus: string | null = null;
  let donorBloodGroup: string | null = null;
  let donorAvailability: string | null = null;

  if (userRecord?.phone) {
    const existingDonorByPhone = await db.bloodDonor.findFirst({
      where: {
        OR: [
          { phone: userRecord.phone },
          { fullName: userRecord.name },
        ],
      },
      select: { id: true, status: true, bloodGroup: true, availability: true },
    });

    if (existingDonorByPhone) {
      isDonor = true;
      donorStatus = existingDonorByPhone.status;
      donorBloodGroup = existingDonorByPhone.bloodGroup;
      donorAvailability = existingDonorByPhone.availability;
    }
  }

  let hospital = null;
  if (session.hospitalId) {
    hospital = await db.hospital.findUnique({
      where: { id: session.hospitalId },
      select: { id: true, name: true, slug: true, status: true, logoUrl: true },
    });
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
}
