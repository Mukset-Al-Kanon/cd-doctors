import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        name: true,
        walletBalance: true,
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      wallet_balance: doctor.walletBalance,
      transactions: doctor.walletTransactions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, senderPhone, trxId } = body;

    const rechargeAmount = parseInt(amount, 10);
    if (!rechargeAmount || rechargeAmount <= 0) {
      return NextResponse.json({ success: false, error: 'সঠিক রিচার্জ পরিমাণ (BDT) প্রদান করুন।' }, { status: 400 });
    }

    const generatedTrxId = trxId || `TRX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Atomic transaction: Update doctor's balance + create transaction record
    const [updatedDoctor, transaction] = await db.$transaction([
      db.doctor.update({
        where: { id: doctorId },
        data: {
          walletBalance: { increment: rechargeAmount },
        },
      }),
      db.walletTransaction.create({
        data: {
          doctorId: doctorId,
          amount: rechargeAmount,
          type: 'CREDIT',
          method: method || 'BKASH',
          senderPhone: senderPhone || '017XXXXXXXX',
          trxId: generatedTrxId,
          notes: `${method || 'bKash'} দিয়ে ওয়ালেট রিচার্জ সফল`,
          status: 'COMPLETED',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `৳${rechargeAmount} টাকা সফলভাবে ওয়ালেটে যোগ হয়েছে!`,
      wallet_balance: updatedDoctor.walletBalance,
      transaction: transaction,
    });
  } catch (error: any) {
    console.error('Wallet recharge error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
