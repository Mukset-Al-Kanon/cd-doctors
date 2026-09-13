import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      phone,
      degrees,
      specialization,
      bmdcNumber,
      experienceYears,
      consultationFee,
      chamberRoom,
      chamberAddress,
      photoUrl,
      bio,
      treatedDiseases,
      schedules, // array of dayOfWeek integers [0, 1, 2, ...]
      visitingHours,
      startTime,
      endTime,
      isTelemedicineAvailable,
      telemedicineFee,
    } = body;

    // Update Doctor Profile Details
    const updatedDoctor = await db.doctor.update({
      where: { id: doctorId },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(phone !== undefined && { phone: String(phone).trim() }),
        ...(degrees !== undefined && { degrees: String(degrees).trim() }),
        ...(specialization !== undefined && { specialization: String(specialization).trim() }),
        ...(bmdcNumber !== undefined && { bmdcNumber: String(bmdcNumber).trim() }),
        ...(experienceYears !== undefined && { experienceYears: Math.max(0, parseInt(String(experienceYears), 10) || 0) }),
        ...(consultationFee !== undefined && { consultationFee: Math.max(0, parseInt(String(consultationFee), 10) || 0) }),
        ...(chamberRoom !== undefined && { chamberRoom: String(chamberRoom).trim() }),
        ...(chamberAddress !== undefined && { chamberAddress: String(chamberAddress).trim() }),
        ...(photoUrl !== undefined && { photoUrl: String(photoUrl).trim() }),
        ...(bio !== undefined && { bio: String(bio).trim() }),
        ...(treatedDiseases !== undefined && { treatedDiseases: String(treatedDiseases).trim() }),
        ...(isTelemedicineAvailable !== undefined && { isTelemedicineAvailable: Boolean(isTelemedicineAvailable) }),
        ...(telemedicineFee !== undefined && { telemedicineFee: Math.max(0, parseInt(String(telemedicineFee), 10) || 0) }),
      },
      include: {
        hospital: { select: { id: true, name: true, address: true, phone: true } },
        department: { select: { id: true, nameBn: true, nameEn: true } },
        schedules: true,
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        campaigns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    // If schedules array provided, synchronize doctor schedules
    if (Array.isArray(schedules)) {
      await db.doctorSchedule.deleteMany({
        where: { doctorId },
      });

      if (schedules.length > 0) {
        const timeText = visitingHours ? String(visitingHours).trim() : (startTime ? String(startTime).trim() : 'প্রতিদিন বিকাল ৫:০০ টা - রাত ৯:০০ টা');
        await db.doctorSchedule.createMany({
          data: schedules.map((dayNum: number) => ({
            doctorId,
            dayOfWeek: dayNum,
            startTime: timeText,
            endTime: endTime ? String(endTime).trim() : '',
            slotDurationMinutes: 20,
            maxPatients: 10,
          })),
        });
      }
    }

    // Refetch updated doctor with fresh schedules
    const finalDoctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: {
        hospital: { select: { id: true, name: true, address: true, phone: true } },
        department: { select: { id: true, nameBn: true, nameEn: true } },
        schedules: true,
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        campaigns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      doctor: finalDoctor,
    });
  } catch (error: any) {
    console.error('Update doctor profile error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
