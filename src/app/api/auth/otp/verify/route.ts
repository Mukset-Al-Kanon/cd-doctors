import { NextResponse } from 'next/server';
import { verifyOtpCode, normalizeBdPhoneNumber } from '@/lib/otpService';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { phone, code } = body || {};

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর এবং ওটিপি কোড প্রদান করুন।' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeBdPhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'সঠিক মোবাইল নম্বর প্রদান করুন।' },
        { status: 400 }
      );
    }

    const result = await verifyOtpCode(normalizedPhone, code);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      phone: normalizedPhone,
    });
  } catch (error: any) {
    console.error('Error in /api/auth/otp/verify:', error);
    return NextResponse.json(
      { error: 'ওটিপি যাচাই করতে সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
