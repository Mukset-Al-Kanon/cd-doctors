import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEFAULT_DISEASE_TEMPLATES } from '@/lib/medicineDatabase';

export const dynamic = 'force-dynamic';

// GET: Return system default templates + doctor's custom templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    let customTemplates: any[] = [];
    if (doctorId) {
      customTemplates = await (db as any).prescriptionTemplate.findMany({
        where: { doctorId },
        orderBy: { createdAt: 'desc' },
      });
    }

    const formattedCustom = customTemplates.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.specialty || 'কাস্টম টেমপ্লেট',
      chiefComplaints: t.complaints ? JSON.parse(t.complaints) : [],
      diagnosis: t.diagnosis || '',
      investigations: t.tests ? JSON.parse(t.tests) : [],
      medicines: t.medicines ? JSON.parse(t.medicines) : [],
      advice: t.advice ? [t.advice] : [],
      isCustom: true,
    }));

    return NextResponse.json({
      success: true,
      templates: [...formattedCustom, ...DEFAULT_DISEASE_TEMPLATES],
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ success: true, templates: DEFAULT_DISEASE_TEMPLATES });
  }
}

// POST: Save a new custom template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctorId, title, specialty, complaints, diagnosis, tests, medicines, advice } = body;

    if (!doctorId || !title) {
      return NextResponse.json({ error: 'Doctor ID and template title are required' }, { status: 400 });
    }

    const createdTemplate = await (db as any).prescriptionTemplate.create({
      data: {
        doctorId,
        title,
        specialty: specialty || 'সাধারণ প্র্যাকটিস',
        complaints: typeof complaints === 'string' ? complaints : JSON.stringify(complaints || []),
        diagnosis: diagnosis || null,
        tests: typeof tests === 'string' ? tests : JSON.stringify(tests || []),
        medicines: typeof medicines === 'string' ? medicines : JSON.stringify(medicines || []),
        advice: advice || null,
      }
    });

    return NextResponse.json({
      success: true,
      template: createdTemplate,
      message: 'টেমপ্লেট সফলভাবে সংরক্ষিত হয়েছে!'
    });
  } catch (error: any) {
    console.error('Error saving template:', error);
    return NextResponse.json({ error: error?.message || 'সার্ভার এরর' }, { status: 500 });
  }
}
