import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { normalizeBdPhoneNumber, verifyOtpCode } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const { phone, otpCode, newPassword } = await request.json();

    if (!phone || !otpCode || !newPassword) {
      return NextResponse.json({ error: 'মোবাইল নম্বর, ওটিপি কোড এবং নতুন পাসওয়ার্ড প্রদান করুন।' }, { status: 400 });
    }

    const normalizedPhone = normalizeBdPhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন।' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' }, { status: 400 });
    }

    // Verify OTP Code
    const verifyResult = await verifyOtpCode(normalizedPhone, otpCode);
    if (!verifyResult.success) {
      return NextResponse.json({ error: (verifyResult as any).error || verifyResult.message || 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড।' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);

    try {
      const user = await db.user.findFirst({
        where: {
          OR: [
            { phone: normalizedPhone },
            { email: `${normalizedPhone}@cddoctors.com` },
          ],
        },
      }).catch(() => null);

      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: { passwordHash },
        });
      }
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
