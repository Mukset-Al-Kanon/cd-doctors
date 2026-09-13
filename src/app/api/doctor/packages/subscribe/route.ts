import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const DURATION_PACKAGES_CONFIG: Record<
  string,
  { name: string; labelBn: string; price: number; durationDays: number; savePercent: number }
> = {
  MONTH_1: {
    name: '1 Month Membership',
    labelBn: '১ মাস',
    price: 349,
    durationDays: 30,
    savePercent: 0,
  },
  MONTH_3: {
    name: '3 Months Membership',
    labelBn: '৩ মাস',
    price: 649,
    durationDays: 90,
    savePercent: 38,
  },
  MONTH_6: {
    name: '6 Months Membership',
    labelBn: '৬ মাস',
    price: 999,
    durationDays: 180,
    savePercent: 52,
  },
  MONTH_12: {
    name: '12 Months Membership',
    labelBn: '১২ মাস',
    price: 1499,
    durationDays: 365,
    savePercent: 64,
  },
};

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।' }, { status: 401 });
    }

    const body = await request.json();
    const { packageKey } = body; // "MONTH_1" | "MONTH_3" | "MONTH_6" | "MONTH_12"

    const selectedPkg = DURATION_PACKAGES_CONFIG[packageKey];
    if (!selectedPkg) {
      return NextResponse.json({ success: false, error: 'অবৈধ প্যাকেজ নির্বাচন করেছেন।' }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'ডাক্তার অ্যাকাউন্ট পাওয়া যায়নি।' }, { status: 404 });
    }

    if (doctor.walletBalance < selectedPkg.price) {
      const shortage = selectedPkg.price - doctor.walletBalance;
      return NextResponse.json(
        {
          success: false,
          error: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। মেম্বারশিপ নিতে আরও ৳${shortage} রিচার্জ করুন।`,
          shortage: shortage,
          current_balance: doctor.walletBalance,
          required_amount: selectedPkg.price,
        },
        { status: 402 }
      );
    }

    // Calculate expiry: if existing package is still active, extend from current expiry date, otherwise from now
    const now = new Date();
    const baseDate = doctor.subscriptionExpiresAt && doctor.subscriptionExpiresAt > now 
      ? new Date(doctor.subscriptionExpiresAt) 
      : now;
      
    const expiryDate = new Date(baseDate.getTime() + selectedPkg.durationDays * 24 * 60 * 60 * 1000);

    // Atomic transaction: Deduct wallet + update subscription info + create transaction record
    const [updatedDoctor, transaction] = await db.$transaction([
      db.doctor.update({
        where: { id: doctorId },
        data: {
          walletBalance: { decrement: selectedPkg.price },
          activePackageName: packageKey,
          subscriptionTier: packageKey,
          subscriptionExpiresAt: expiryDate,
          packageExpiresAt: expiryDate,
        },
      }),
      db.walletTransaction.create({
        data: {
          doctorId: doctorId,
          amount: selectedPkg.price,
          type: 'DEBIT',
          method: 'PACKAGE_PURCHASE',
          notes: `${selectedPkg.labelBn} (${selectedPkg.name} — ৳${selectedPkg.price}) মেম্বারশিপ অ্যাক্টিভেশন`,
          status: 'COMPLETED',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `অভিনন্দন! আপনার ${selectedPkg.labelBn} মেম্বারশিপ প্যাকেজটি সফলভাবে সক্রিয় হয়েছে।`,
      wallet_balance: updatedDoctor.walletBalance,
      subscription_tier: updatedDoctor.subscriptionTier,
      subscription_expires_at: updatedDoctor.subscriptionExpiresAt,
      transaction: transaction,
    });
  } catch (error: any) {
    console.error('Package subscription error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
