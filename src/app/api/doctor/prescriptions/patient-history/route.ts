import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const doctorId = searchParams.get('doctorId');

    if (!phone) {
      return NextResponse.json({ error: 'Phone parameter is required' }, { status: 400 });
    }

    const cleanPhone = phone.trim();

    const prescriptions = await (db as any).prescription.findMany({
      where: {
        patientPhone: {
          contains: cleanPhone
        },
        ...(doctorId ? { doctorId } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        doctor: true,
      }
    });

    return NextResponse.json({
      success: true,
      prescriptions,
      total: prescriptions.length,
    });
  } catch (error: any) {
    console.error('Error fetching patient history:', error);
    return NextResponse.json({ error: error?.message || 'সার্ভার এরর' }, { status: 500 });
  }
}
