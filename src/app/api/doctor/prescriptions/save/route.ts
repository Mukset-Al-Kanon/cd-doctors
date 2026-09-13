import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      doctorId,
      appointmentId,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      patientWeight,
      bp,
      pulse,
      temperature,
      bloodSugar,
      chiefComplaints,
      clinicalFindings,
      diagnosis,
      investigations,
      medicines,
      advice,
      nextVisit,
      id: existingId
    } = body;

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    if (!patientName || !patientPhone) {
      return NextResponse.json({ error: 'Patient name and phone number are required' }, { status: 400 });
    }

    const medicinesJson = typeof medicines === 'string' ? medicines : JSON.stringify(medicines || []);
    const complaintsJson = typeof chiefComplaints === 'string' ? chiefComplaints : JSON.stringify(chiefComplaints || []);
    const investigationsJson = typeof investigations === 'string' ? investigations : JSON.stringify(investigations || []);

    // Generate clean prescription code RX-YYYYMMDD-XXXX
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `RX-${todayStr}-${randCode}`;

    let savedPrescription: any = null;

    if (existingId) {
      // Update existing prescription
      savedPrescription = await (db as any).prescription.update({
        where: { id: existingId },
        data: {
          patientName,
          patientPhone,
          patientAge: patientAge ? parseInt(patientAge, 10) : null,
          patientGender: patientGender || null,
          patientWeight: patientWeight || null,
          bp: bp || null,
          pulse: pulse || null,
          temperature: temperature || null,
          bloodSugar: bloodSugar || null,
          chiefComplaints: complaintsJson,
          clinicalFindings: clinicalFindings || null,
          diagnosis: diagnosis || null,
          investigations: investigationsJson,
          medicinesJson,
          advice: advice || null,
          nextVisit: nextVisit || null,
        },
        include: {
          doctor: {
            include: { hospital: true }
          },
          appointment: true,
        }
      });
    } else {
      // Create new prescription
      savedPrescription = await (db as any).prescription.create({
        data: {
          prescriptionCode: generatedCode,
          doctorId,
          appointmentId: appointmentId || null,
          patientName,
          patientPhone,
          patientAge: patientAge ? parseInt(patientAge, 10) : null,
          patientGender: patientGender || null,
          patientWeight: patientWeight || null,
          bp: bp || null,
          pulse: pulse || null,
          temperature: temperature || null,
          bloodSugar: bloodSugar || null,
          chiefComplaints: complaintsJson,
          clinicalFindings: clinicalFindings || null,
          diagnosis: diagnosis || null,
          investigations: investigationsJson,
          medicinesJson,
          advice: advice || null,
          nextVisit: nextVisit || null,
        },
        include: {
          doctor: {
            include: { hospital: true }
          },
          appointment: true,
        }
      });
    }

    // If appointment is linked, mark appointment as completed
    if (appointmentId) {
      try {
        await (db as any).appointment.update({
          where: { id: appointmentId },
          data: {
            queueStatus: 'COMPLETED',
            status: 'COMPLETED',
            completedAt: new Date(),
          }
        });
      } catch (aptErr) {
        console.warn('Could not update appointment completion:', aptErr);
      }
    }

    // Auto-sync to Patient Health Vault if PrescriptionVaultItem exists
    try {
      const doc = savedPrescription.doctor;
      const docName = doc?.name || 'ডাক্তার';
      const hospName = doc?.hospital?.name || doc?.chamberAddress || 'চেম্বার';

      await (db as any).prescriptionVaultItem.create({
        data: {
          patientName,
          doctorName: docName,
          hospitalName: hospName,
          consultationDate: new Date().toISOString().split('T')[0],
          diagnosis: diagnosis || 'পরামর্শ সম্পন্ন',
          medicinesJson,
          notes: advice ? `ডাক্তারের পরামর্শ: ${advice}` : 'CD Doctors ডিজিটাল প্রেসক্রিপশন মেকার',
        }
      });
    } catch (vaultErr) {
      // Vault sync failure is non-fatal
    }

    return NextResponse.json({
      success: true,
      prescription: savedPrescription,
      message: 'প্রেসক্রিপশন সফলভাবে সংরক্ষিত হয়েছে!'
    });
  } catch (error: any) {
    console.error('Error saving prescription:', error);
    return NextResponse.json({ error: error?.message || 'সার্ভার এরর' }, { status: 500 });
  }
}
