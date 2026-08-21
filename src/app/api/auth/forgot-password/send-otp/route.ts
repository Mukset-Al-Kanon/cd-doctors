import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeBdPhoneNumber, generateAndSendOtp } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'অনুগ্রহ করে আপনার মোবাইল নম্বর প্রদান করুন।' }, { status: 400 });
    }

    const normalizedPhone = normalizeBdPhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন।' }, { status: 400 });
    }

    // Check if user exists with this phone number
    let userExists = false;
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [
            { phone: normalizedPhone },
            { email: `${normalizedPhone}@cddoctors.com` },
          ],
        },
      }).catch(() => null);

      if (user) userExists = true;
    } catch (e) {
      // In serverless without persistent DB, allow reset flow
      userExists = true;
    }

    // Always dispatch OTP
    const otpResult = await generateAndSendOtp(normalizedPhone);

    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.message || 'ওটিপি পাঠাতে সমস্যা হয়েছে।' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      phone: normalizedPhone,
      message: `পাসওয়ার্ড রিসেটের জন্য ${normalizedPhone} নম্বরে ৪ ডিজিটের ওটিপি কোড পাঠানো হয়েছে।`,
      devOtp: otpResult.devOtp,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
