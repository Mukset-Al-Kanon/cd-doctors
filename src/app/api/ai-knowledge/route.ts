import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Live real-time data always

const DAY_NAMES_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

export async function GET() {
  try {
    const [hospitals, doctors, bloodDonors, emergencyHelplines, tests] = await Promise.all([
      db.hospital.findMany({
        where: { status: 'APPROVED' },
        include: {
          facilities: { select: { facilityName: true, isAvailable: true } },
          departments: { select: { nameEn: true, nameBn: true } },
        },
        orderBy: { name: 'asc' },
      }),
      db.doctor.findMany({
        where: { status: 'ACTIVE' },
        include: {
          hospital: { select: { name: true, phone: true, emergencyPhone: true, address: true } },
          department: { select: { nameBn: true, nameEn: true } },
          schedules: {
            select: { dayOfWeek: true, startTime: true, endTime: true },
            orderBy: { dayOfWeek: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      }),
      db.bloodDonor.findMany({
        where: { status: 'approved' },
        select: {
          fullName: true,
          phone: true,
          bloodGroup: true,
          area: true,
          availability: true,
          address: true,
        },
        orderBy: { bloodGroup: 'asc' },
      }),
      db.emergencyHelpline.findMany({
        where: { isAvailable: true },
        orderBy: { orderIndex: 'asc' },
      }),
      db.diagnosticTest.findMany({
        where: { isActive: true },
        include: {
          availabilities: {
            where: { availabilityStatus: 'AVAILABLE' },
            include: { hospital: { select: { name: true } } },
          },
        },
      }),
    ]);

    // Format doctors with human-friendly Bangla schedule
    const formattedDoctors = doctors.map((d) => {
      const scheduleDays = d.schedules.map(
        (s) => `${DAY_NAMES_BN[s.dayOfWeek]} (${s.startTime} - ${s.endTime})`
      );
      return {
        id: d.id,
        name: d.name,
        degrees: d.degrees,
        specialization: d.specialization,
        department: d.department?.nameBn || d.specialization,
        experienceYears: d.experienceYears,
        consultationFee: d.consultationFee,
        hospitalName: d.hospital?.name || 'চুয়াডাঙ্গা',
        hospitalAddress: d.hospital?.address || '',
        chamberRoom: d.chamberRoom,
        serialPhone: d.phone || d.hospital?.phone || d.hospital?.emergencyPhone,
        schedules: scheduleDays.length > 0 ? scheduleDays.join(', ') : 'সপ্তাহের নির্ধারিত দিনসমূহ',
        bio: d.bio || '',
        treatedDiseases: d.treatedDiseases || '',
      };
    });

    const formattedHospitals = hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      type: h.hospitalType,
      address: h.address,
      phone: h.phone,
      emergencyPhone: h.emergencyPhone,
      facilities: h.facilities.filter((f) => f.isAvailable).map((f) => f.facilityName),
      departments: h.departments.map((d) => d.nameBn),
      description: h.description,
    }));

    const formattedTests = tests.map((t) => ({
      name: t.name,
      category: t.category,
      availableAt: t.availabilities.map((a) => ({
        hospital: a.hospital.name,
        price: a.price ? `${a.price} টাকা` : 'ফি প্রযোজ্য',
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        district: 'Chuadanga',
        lastUpdated: new Date().toISOString(),
        totalDoctors: formattedDoctors.length,
        totalHospitals: formattedHospitals.length,
        totalBloodDonors: bloodDonors.length,
        totalEmergencyHelplines: emergencyHelplines.length,
        hospitals: formattedHospitals,
        doctors: formattedDoctors,
        bloodDonors: bloodDonors,
        emergencyHelplines: emergencyHelplines.map((e) => ({
          title: e.title,
          number: e.number,
          desc: e.desc,
          badge: e.badge,
        })),
        diagnosticTests: formattedTests,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('AI Knowledge API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch AI master data' },
      { status: 500 }
    );
  }
}
