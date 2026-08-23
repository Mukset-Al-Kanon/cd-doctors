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
    const {
      name,
      email,
      password,
      phone,
      degrees,
      specialization,
      bmdcNumber,
      experienceYears,
      consultationFee,
      chamberRoom,
      chamberAddress,
      treatedDiseases,
      photoUrl,
      schedules,
    } = body;

    if (!name || !email || !password || !phone || !specialization) {
      return NextResponse.json(
        { success: false, error: 'অনুগ্রহ করে নাম, ইমেইল, পাসওয়ার্ড, ফোন নম্বর ও বিশেষত্ব প্রদান করুন।' },
        { status: 400 }
      );
    }

    const existingDoctor = await db.doctor.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { phone: phone.trim() },
        ],
      },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { success: false, error: 'এই ইমেইল বা ফোন নম্বর দিয়ে ইতিমধ্যে একটি ডাক্তার অ্যাকাউন্ট খোলা হয়েছে।' },
        { status: 409 }
      );
    }

    const slug = (name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000))
      .replace(/-+/g, '-');

    const newDoctor = await db.doctor.create({
      data: {
        name: name.trim(),
        slug: slug,
        email: email.trim().toLowerCase(),
        passwordHash: hashPassword(password),
        phone: phone.trim(),
        degrees: degrees || 'MBBS',
        specialization: specialization.trim(),
        bmdcNumber: bmdcNumber || 'A-Pending',
        experienceYears: Number(experienceYears) || 5,
        consultationFee: Number(consultationFee) || 500,
        chamberRoom: chamberRoom || 'রুম ১',
        chamberAddress: chamberAddress || 'ব্যক্তিগত চেম্বার, চুয়াডাঙ্গা',
        treatedDiseases: treatedDiseases || 'বিশেষজ্ঞ চিকিৎসাসেবা ও সার্বিক স্বাস্থ্য পরামর্শ',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
        isIndependent: true,
        status: 'ACTIVE',
        walletBalance: 0,
      },
    });

    // Create default schedules if provided
    if (Array.isArray(schedules) && schedules.length > 0) {
      for (const s of schedules) {
        await db.doctorSchedule.create({
          data: {
            doctorId: newDoctor.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime || '16:00',
            endTime: s.endTime || '20:00',
          },
        });
      }
    } else {
      // Default schedules (Sat to Thu, 4 PM to 8 PM)
      const defaultDays = [6, 0, 1, 2, 3, 4];
      for (const day of defaultDays) {
        await db.doctorSchedule.create({
          data: {
            doctorId: newDoctor.id,
            dayOfWeek: day,
            startTime: '16:00',
            endTime: '20:00',
          },
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'ডাক্তার রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।',
      doctor: {
        id: newDoctor.id,
        name: newDoctor.name,
        email: newDoctor.email,
        slug: newDoctor.slug,
      },
    });

    // Set auth cookie
    response.cookies.set('cddoctor_session', newDoctor.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Doctor registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'রেজিস্ট্রেশন প্রক্রিয়ায় ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
