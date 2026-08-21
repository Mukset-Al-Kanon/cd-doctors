import { NextResponse } from 'next/server';
import { generateAndSendOtp, normalizeBdPhoneNumber } from '@/lib/otpService';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const phone = body?.phone;

    if (!phone) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর প্রদান করা বাধ্যতামূলক।' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeBdPhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 01711223344)।' },
        { status: 400 }
      );
    }

    // Check if phone number is already registered
    const existingUser = await db.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে।' },
        { status: 400 }
      );
    }

    const result = await generateAndSendOtp(normalizedPhone);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      phone: normalizedPhone,
      devOtp: result.devOtp, // Returned only in development mode for instant easy testing
    });
  } catch (error: any) {
    console.error('Error in /api/auth/otp/send:', error);
    return NextResponse.json(
      { error: 'ওটিপি পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
