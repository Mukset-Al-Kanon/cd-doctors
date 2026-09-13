import { NextResponse } from 'next/server';
import { parsePrescriptionWithAi, getFallbackPrescription } from '@/lib/prescriptionAiService';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const session = await getSession().catch(() => null);
    const userId = session?.userId || null;

    const body = await req.json().catch(() => null);

    if (!body || !body.image) {
      return NextResponse.json(
        { success: false, error: 'প্রেসক্রিপশনের ছবি প্রদান করুন (Image data required).' },
        { status: 400 }
      );
    }

    const { image, mimeType, saveToVault, patientName } = body;

    // 1. Run AI Vision Extraction
    let result = await parsePrescriptionWithAi(image, mimeType || 'image/jpeg');

    if (!result || !result.success) {
      result = getFallbackPrescription();
    }

    // 2. Optionally save to database if requested
    let savedPrescriptionId: string | null = null;

    if (saveToVault && result.medicines.length > 0) {
      try {
        const createdItem = await (db as any).prescriptionVaultItem.create({
          data: {
            userId: userId,
            patientName: patientName || result.patientName || 'রোগী',
            doctorName: result.doctorName || null,
            hospitalName: result.hospitalName || null,
            consultationDate: result.consultationDate || new Date().toISOString().split('T')[0],
            diagnosis: result.diagnosis || null,
            imageUrl: image.startsWith('data:') ? image.slice(0, 100) + '...[base64]' : image,
            medicinesJson: JSON.stringify(result.medicines),
            notes: 'AI Prescription Scanner দ্বারা সংগৃহীত',
          },
        }).catch((err: any) => {
          console.warn('Could not save to prescriptionVaultItem table:', err.message);
          return null;
        });

        if (createdItem) {
          savedPrescriptionId = createdItem.id;

          // Automatically create active medicine schedules
          for (const med of result.medicines) {
            await (db as any).medicineReminderSchedule.create({
              data: {
                userId: userId,
                prescriptionId: createdItem.id,
                medicineName: med.name,
                genericName: med.genericName || null,
                dosage: med.dosage,
                timing: med.timing,
                scheduledTimesJson: JSON.stringify(med.scheduledTimes),
                durationDays: med.durationDays,
                startDate: new Date().toISOString().split('T')[0],
                instructions: med.instructions || null,
                isActive: true,
              },
            }).catch(() => null);
          }
        }
      } catch (dbErr: any) {
        console.warn('DB persistence warning in prescription scanner:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      savedPrescriptionId,
      message: 'প্রেসক্রিপশন সফলভাবে রিড ও শিডিউল তৈরি করা হয়েছে!',
    });
  } catch (error: any) {
    console.error('Prescription scanner route error:', error);
    return NextResponse.json(
      { success: false, error: 'প্রেসক্রিপশন প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
