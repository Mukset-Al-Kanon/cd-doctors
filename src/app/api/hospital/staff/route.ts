import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: 'hospitalId is required' }, { status: 400 });
    }

    const staffList = await db.hospitalStaff.findMany({
      where: { hospitalId },
      include: {
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, staff: staffList });
  } catch (error: any) {
    console.error('Error fetching hospital staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hospitalId, name, phone, role, password, doctorId, notes } = body;

    if (!hospitalId || !name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'নাম, মোবাইল নম্বর এবং পাসওয়ার্ড আবশ্যক।' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Check if staff already exists with same phone in this hospital
    const existing = await db.hospitalStaff.findFirst({
      where: { hospitalId, phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'এই মোবাইল নম্বরে ইতোমধ্যে একজন স্টাফ নিবন্ধিত রয়েছে।' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const staff = await db.hospitalStaff.create({
      data: {
        hospitalId,
        name: name.trim(),
        phone: cleanPhone,
        role: role === 'DOCTOR_ASSISTANT' ? 'DOCTOR_ASSISTANT' : 'CENTRAL_RECEPTIONIST',
        doctorId: role === 'DOCTOR_ASSISTANT' && doctorId ? doctorId : null,
        passwordHash,
        notes: notes ? notes.trim() : null,
        isActive: true,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            chamberRoom: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    console.error('Error creating hospital staff:', error);
    return NextResponse.json({ success: false, error: 'স্টাফ অ্যাকাউন্ট তৈরি করা যায়নি।' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { staffId, name, phone, role, doctorId, password, isActive, notes } = body;

    if (!staffId) {
      return NextResponse.json({ success: false, error: 'staffId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (role !== undefined) {
      updateData.role = role === 'DOCTOR_ASSISTANT' ? 'DOCTOR_ASSISTANT' : 'CENTRAL_RECEPTIONIST';
      updateData.doctorId = role === 'DOCTOR_ASSISTANT' && doctorId ? doctorId : null;
    } else if (doctorId !== undefined) {
      updateData.doctorId = doctorId || null;
    }
    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updated = await db.hospitalStaff.update({
      where: { id: staffId },
      data: updateData,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            chamberRoom: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (error: any) {
    console.error('Error updating hospital staff:', error);
    return NextResponse.json({ success: false, error: 'স্টাফ তথ্য আপডেট করা যায়নি।' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ success: false, error: 'staffId is required' }, { status: 400 });
    }

    await db.hospitalStaff.delete({
      where: { id: staffId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting hospital staff:', error);
    return NextResponse.json({ success: false, error: 'স্টাফ অ্যাকাউন্ট ডিলিট করা যায়নি।' }, { status: 500 });
  }
}
