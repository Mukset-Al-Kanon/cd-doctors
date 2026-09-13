import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: {
        hospital: { select: { id: true, name: true, address: true, phone: true } },
        department: { select: { id: true, nameBn: true, nameEn: true } },
        schedules: {
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 15,
        },
        campaigns: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        withdrawalRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        appointments: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        slug: doctor.slug,
        email: doctor.email,
        phone: doctor.phone,
        degrees: doctor.degrees,
        specialization: doctor.specialization,
        bmdcNumber: doctor.bmdcNumber,
        experienceYears: doctor.experienceYears,
        consultationFee: doctor.consultationFee,
        chamberRoom: doctor.chamberRoom,
        chamberAddress: doctor.chamberAddress || doctor.hospital?.address || 'চুয়াডাঙ্গা',
        treatedDiseases: doctor.treatedDiseases,
        photoUrl: doctor.photoUrl,
        posterUrl: doctor.posterUrl,
        walletBalance: doctor.walletBalance,
        activePackageName: doctor.activePackageName,
        packageExpiresAt: doctor.packageExpiresAt,
        subscriptionTier: doctor.subscriptionTier,
        subscriptionExpiresAt: doctor.subscriptionExpiresAt,
        remainingPosts: doctor.remainingPosts,
        remainingBoostDays: doctor.remainingBoostDays,
        isTelemedicineAvailable: doctor.isTelemedicineAvailable,
        telemedicineFee: doctor.telemedicineFee || 500,
        hospital: doctor.hospital,
        department: doctor.department,
        schedules: doctor.schedules,
        walletTransactions: doctor.walletTransactions,
        campaigns: doctor.campaigns,
        withdrawalRequests: doctor.withdrawalRequests,
        appointments: doctor.appointments,
      },
    });
  } catch (error: any) {
    console.error('Fetch me error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('cddoctor_session');
  return response;
}
