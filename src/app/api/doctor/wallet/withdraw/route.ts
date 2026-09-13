import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, accountNumber, accountName, bankName, branchName } = body;

    const withdrawAmount = parseInt(amount?.toString() || '0', 10);
    if (!withdrawAmount || withdrawAmount < 500) {
      return NextResponse.json({ success: false, error: 'সর্বনিম্ন উত্তোলনের পরিমাণ ৫০০ টাকা।' }, { status: 400 });
    }

    if (!method || !accountNumber) {
      return NextResponse.json({ success: false, error: 'পেমেন্ট মেথড এবং অ্যাকাউন্ট নম্বর প্রদান করুন।' }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'ডাক্তার অ্যাকাউন্ট পাওয়া যায়নি।' }, { status: 404 });
    }

    if (doctor.walletBalance < withdrawAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${doctor.walletBalance}`,
        },
        { status: 400 }
      );
    }

    // Atomic transaction: Deduct wallet balance + create withdrawal request + record debit transaction
    const [updatedDoctor, withdrawal, transaction] = await db.$transaction([
      db.doctor.update({
        where: { id: doctorId },
        data: {
          walletBalance: { decrement: withdrawAmount },
        },
      }),
      db.withdrawalRequest.create({
        data: {
          doctorId: doctorId,
          amount: withdrawAmount,
          method: method, // "BKASH" | "NAGAD" | "BANK"
          accountNumber: accountNumber,
          accountName: accountName || null,
          bankName: bankName || null,
          branchName: branchName || null,
          status: 'PENDING',
        },
      }),
      db.walletTransaction.create({
        data: {
          doctorId: doctorId,
          amount: withdrawAmount,
          type: 'DEBIT',
          method: 'WITHDRAWAL',
          notes: `${method} (${accountNumber}) উইথড্রল রিকোয়েস্ট সাবমিট`,
          status: 'PENDING',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `আপনার ৳${withdrawAmount} টাকার উইথড্রল রিকোয়েস্ট সফলভাবে জমা হয়েছে। ২৪ ঘণ্টার মধ্যে আপনার ${method} নম্বরে টাকা পৌঁছে যাবে।`,
      wallet_balance: updatedDoctor.walletBalance,
      withdrawal: withdrawal,
      transaction: transaction,
    });
  } catch (error: any) {
    console.error('Withdrawal request error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const withdrawals = await db.withdrawalRequest.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, withdrawals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
