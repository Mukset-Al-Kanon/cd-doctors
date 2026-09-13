import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, appointmentId, doctorId, date } = body;

    if (!action) {
      return NextResponse.json({ error: 'অ্যাকশন টাইপ আবশ্যক।' }, { status: 400 });
    }

    const todayDate = date || new Date().toISOString().split('T')[0];

    // 1. CALL_NEXT Action: Find the next WAITING patient for today and call them
    if (action === 'CALL_NEXT') {
      if (!doctorId) {
        return NextResponse.json({ error: 'ডাক্তারের আইডি আবশ্যক।' }, { status: 400 });
      }

      // Finish any currently active appointment (IN_CONSULTATION or CALLING)
      await db.appointment.updateMany({
        where: {
          doctorId,
          appointmentDate: todayDate,
          queueStatus: { in: ['IN_CONSULTATION', 'CALLING'] },
        },
        data: {
          queueStatus: 'COMPLETED',
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      // Find the lowest serial WAITING appointment
      const nextAppointment = await db.appointment.findFirst({
        where: {
          doctorId,
          appointmentDate: todayDate,
          queueStatus: 'WAITING',
          status: { not: 'CANCELLED' },
        },
        orderBy: {
          serialNumber: 'asc',
        },
      });

      if (!nextAppointment) {
        return NextResponse.json({
          success: true,
          message: 'অপেক্ষারত আর কোনো রোগী নেই। আজকের সকল সিরিয়াল সম্পন্ন!',
          appointment: null,
        });
      }

      // Mark as CALLING
      const updated = await db.appointment.update({
        where: { id: nextAppointment.id },
        data: {
          queueStatus: 'CALLING',
          calledAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `সিরিয়াল #${updated.serialNumber} (${updated.patientName})-কে ডাকা হচ্ছে।`,
        appointment: updated,
      });
    }

    // Individual Patient Actions
    if (!appointmentId) {
      return NextResponse.json({ error: 'অ্যাপয়েন্টমেন্ট আইডি আবশ্যক।' }, { status: 400 });
    }

    const targetAppointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!targetAppointment) {
      return NextResponse.json({ error: 'অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।' }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case 'CALL_PATIENT':
        updateData = {
          queueStatus: 'CALLING',
          calledAt: new Date(),
        };
        break;

      case 'START_CONSULTATION':
        updateData = {
          queueStatus: 'IN_CONSULTATION',
          calledAt: targetAppointment.calledAt || new Date(),
        };
        break;

      case 'MARK_COMPLETED':
        updateData = {
          queueStatus: 'COMPLETED',
          status: 'COMPLETED',
          completedAt: new Date(),
        };
        break;

      case 'SKIP_PATIENT':
        updateData = {
          queueStatus: 'SKIPPED',
        };
        break;

      case 'RE_ANNOUNCE':
        updateData = {
          calledAt: new Date(),
        };
        break;

      case 'RECALL_PATIENT':
        updateData = {
          queueStatus: 'WAITING',
          calledAt: null,
        };
        break;

      case 'CANCEL':
        updateData = {
          queueStatus: 'CANCELLED',
          status: 'CANCELLED',
        };
        break;

      default:
        return NextResponse.json({ error: 'অকার্যকর অ্যাকশন।' }, { status: 400 });
    }

    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `সিরিয়াল #${updated.serialNumber} এর স্ট্যাটাস আপডেট হয়েছে।`,
      appointment: updated,
    });
  } catch (error: any) {
    console.error('Queue action error:', error);
    return NextResponse.json({ error: error.message || 'কিউ অ্যাকশন সম্পন্ন করা যায়নি।' }, { status: 500 });
  }
}
