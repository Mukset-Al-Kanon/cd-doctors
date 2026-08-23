import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = body;

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { success: false, error: 'ইমেইল/ফোন ও পাসওয়ার্ড উভয়ই প্রদান করুন।' },
        { status: 400 }
      );
    }

    const input = emailOrPhone.trim().toLowerCase();
    const hashedPassword = hashPassword(password);

    const doctor = await db.doctor.findFirst({
      where: {
        OR: [
          { email: input },
          { phone: emailOrPhone.trim() },
        ],
      },
      include: {
        hospital: { select: { id: true, name: true, address: true } },
        department: { select: { id: true, nameBn: true, nameEn: true } },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'এই ইমেইল বা ফোন নম্বরের কোনো ডাক্তার অ্যাকাউন্ট পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    if (doctor.passwordHash && doctor.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { success: false, error: 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `স্বাগতম, ${doctor.name}!`,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        degrees: doctor.degrees,
        photoUrl: doctor.photoUrl,
        walletBalance: doctor.walletBalance,
        activePackageName: doctor.activePackageName,
        remainingPosts: doctor.remainingPosts,
        remainingBoostDays: doctor.remainingBoostDays,
      },
    });

    // Set secure auth cookie
    response.cookies.set('cddoctor_session', doctor.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Doctor login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'লগইন প্রক্রিয়ায় ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
