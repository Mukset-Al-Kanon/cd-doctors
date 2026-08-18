import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'You must log in to update donor availability.' }, { status: 401 });
    }

    const body = await req.json();
    const { availability } = body;

    if (!availability || !['available', 'unavailable'].includes(availability)) {
      return NextResponse.json({ error: 'Invalid availability status.' }, { status: 400 });
    }

    // Find user record to get phone / name
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { phone: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Find corresponding donor profile
    const donor = await db.bloodDonor.findFirst({
      where: {
        OR: [
          ...(user.phone ? [{ phone: user.phone }] : []),
          { fullName: user.name },
        ],
      },
    });

    if (!donor) {
      return NextResponse.json({ error: 'No registered blood donor profile found for your account.' }, { status: 404 });
    }

    // Update availability
    const updatedDonor = await db.bloodDonor.update({
      where: { id: donor.id },
      data: {
        availability,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Your blood donor status has been set to ${availability}.`,
      donor: updatedDonor,
    });
  } catch (error: any) {
    console.error('Failed to update donor availability:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
