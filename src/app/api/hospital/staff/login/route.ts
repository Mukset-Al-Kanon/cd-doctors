import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { phone, password, hospitalId } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন।' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Find active staff member
    const staff = await db.hospitalStaff.findFirst({
      where: {
        phone: cleanPhone,
        ...(hospitalId ? { hospitalId } : {}),
      },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            chamberRoom: true,
            photoUrl: true,
          },
        },
      },
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'এই নম্বরে কোনো স্টাফ অ্যাকাউন্ট পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    if (!staff.isActive) {
      return NextResponse.json(
        { success: false, error: 'এই অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয় রয়েছে। হাসপাতাল অ্যাডমিনের সাথে যোগাযোগ করুন।' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, staff.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'ভুল পাসওয়ার্ড! পুনরায় চেষ্টা করুন।' },
        { status: 401 }
      );
    }

    // Update last login
    await db.hospitalStaff.update({
      where: { id: staff.id },
      data: { lastLoginAt: new Date() },
    });

    // Determine target redirect
    let redirectUrl = `/hospital/reception?hospitalId=${staff.hospitalId}`;
    if (staff.role === 'DOCTOR_ASSISTANT' && staff.doctorId) {
      redirectUrl = `/hospital/reception?hospitalId=${staff.hospitalId}&doctorId=${staff.doctorId}`;
    }

    return NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        name: staff.name,
        phone: staff.phone,
        role: staff.role,
        hospitalId: staff.hospitalId,
        hospitalName: staff.hospital.name,
        doctorId: staff.doctorId,
        doctorName: staff.doctor?.name || null,
        redirectUrl,
      },
    });
  } catch (error: any) {
    console.error('Error logging in hospital staff:', error);
    return NextResponse.json(
      { success: false, error: 'লগইন প্রক্রিয়ায় সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
