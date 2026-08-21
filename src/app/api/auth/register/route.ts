import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { normalizeBdPhoneNumber, isPhoneVerified, verifyOtpCode } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const { name, phone, password, otpCode } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'পুরো নাম, মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।' }, { status: 400 });
    }

    const normalizedPhone = normalizeBdPhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json({ error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন।' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' }, { status: 400 });
    }

    // Verify Phone OTP (either directly pre-verified or passed via otpCode)
    let phoneIsVerified = await isPhoneVerified(normalizedPhone);
    if (!phoneIsVerified && otpCode) {
      const verifyRes = await verifyOtpCode(normalizedPhone, otpCode);
      if (verifyRes.success) {
        phoneIsVerified = true;
      }
    }

    if (!phoneIsVerified) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বরটি ওটিপি (OTP) দ্বারা যাচাই করা হয়নি। অনুগ্রহ করে ওটিপি যাচাই সম্পন্ন করুন।' },
        { status: 400 }
      );
    }

    const systemEmail = `${normalizedPhone}@cddoctors.com`;

    const existingPhoneUser = await db.user.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { email: systemEmail },
        ],
      },
    }).catch(() => null);

    if (existingPhoneUser) {
      return NextResponse.json({ error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    let newUser: any = null;
    try {
      newUser = await db.user.create({
        data: {
          name,
          email: systemEmail,
          phone: normalizedPhone,
          phoneVerified: true,
          passwordHash,
          role: 'PATIENT',
        },
      });
    } catch (e) {
      // Fallback in-memory user for serverless without persistent DB
      newUser = {
        id: `user-${Date.now()}`,
        name,
        email: systemEmail,
        phone: normalizedPhone,
        role: 'PATIENT',
      };
    }

    const sessionData = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: normalizedPhone,
      role: 'PATIENT' as const,
      hospitalId: null,
    };

    const token = signToken(sessionData);

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: 'রেজিস্ট্রেশন সফল হয়েছে!',
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
