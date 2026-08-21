import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FALLBACK_DONORS } from '@/lib/staticHospitalData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const area = searchParams.get('area');
    const q = searchParams.get('q');

    let donors: any[] = [];

    try {
      const whereClause: any = {
        status: 'approved',
      };

      if (bloodGroup && bloodGroup !== 'All') {
        whereClause.bloodGroup = bloodGroup;
      }

      if (area && area !== 'All') {
        whereClause.area = area;
      }

      if (q && q.trim() !== '') {
        whereClause.OR = [
          { fullName: { contains: q.trim() } },
          { address: { contains: q.trim() } },
          { note: { contains: q.trim() } },
        ];
      }

      const dbDonors = await db.bloodDonor.findMany({
        where: whereClause,
        select: {
          id: true,
          fullName: true,
          bloodGroup: true,
          age: true,
          gender: true,
          area: true,
          address: true,
          phone: true,
          availability: true,
          lastDonationDate: true,
          note: true,
          createdAt: true,
        },
        orderBy: [
          { availability: 'asc' },
          { createdAt: 'desc' },
        ],
      }).catch(() => []);

      donors = dbDonors || [];
    } catch (err) {
      console.error('Error querying blood donors from DB:', err);
    }

    if (donors.length === 0) {
      donors = FALLBACK_DONORS.filter((donor) => {
        if (bloodGroup && bloodGroup !== 'All' && donor.bloodGroup !== bloodGroup) return false;
        if (area && area !== 'All' && donor.area !== area) return false;
        if (q && q.trim() !== '') {
          const term = q.trim().toLowerCase();
          return (
            donor.fullName.toLowerCase().includes(term) ||
            donor.address.toLowerCase().includes(term) ||
            (donor.note && donor.note.toLowerCase().includes(term))
          );
        }
        return true;
      });
    }

    return NextResponse.json({ success: true, count: donors.length, donors });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blood donors' },
      { status: 500 }
    );
  }
}
