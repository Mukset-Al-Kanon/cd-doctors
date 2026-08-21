import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { FALLBACK_DONORS } from '@/lib/staticHospitalData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const area = searchParams.get('area');
    const q = searchParams.get('q');

    // Check if requester is logged in
    const session = await getSession().catch(() => null);
    const isAuthenticated = Boolean(session);

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

    // Privacy Protection: Mask phone numbers for visitors who are not logged in
    const processedDonors = donors.map((donor) => {
      if (isAuthenticated) {
        return {
          ...donor,
          isPhoneMasked: false,
        };
      } else {
        const rawPhone = donor.phone || '01XXXXXXXXX';
        const masked = rawPhone.length >= 11
          ? rawPhone.slice(0, 3) + '••••••' + rawPhone.slice(-2)
          : '017•••••XXX';
        return {
          ...donor,
          phone: masked,
          isPhoneMasked: true,
        };
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: processedDonors.length, 
      isAuthenticated,
      donors: processedDonors 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blood donors' },
      { status: 500 }
    );
  }
}
