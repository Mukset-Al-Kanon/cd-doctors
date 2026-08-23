import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const PACKAGES_CONFIG: Record<string, { name: string; price: number; posts: number; boostDays: number }> = {
  STARTER: {
    name: 'Starter',
    price: 599,
    posts: 1,
    boostDays: 1,
  },
  GROWTH: {
    name: 'Growth',
    price: 999,
    posts: 2,
    boostDays: 3,
  },
  VIP_PRO: {
    name: 'Pro',
    price: 1999,
    posts: 5,
    boostDays: 7,
  },
  PRO: {
    name: 'Pro',
    price: 1999,
    posts: 5,
    boostDays: 7,
  },
};

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const doctorId = cookieStore.get('cddoctor_session')?.value;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { packageKey } = body; // "STARTER" | "GROWTH" | "VIP_PRO"

    const selectedPkg = PACKAGES_CONFIG[packageKey];
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
          error: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। আরও ৳${shortage} টাকা রিচার্জ করুন।`,
          shortage: shortage,
          current_balance: doctor.walletBalance,
          required_amount: selectedPkg.price,
        },
        { status: 402 }
      );
    }

    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days validity

    // Atomic transaction: Deduct wallet + update quota + create debit transaction + create campaign record
    const [updatedDoctor, transaction, campaign] = await db.$transaction([
      db.doctor.update({
        where: { id: doctorId },
        data: {
          walletBalance: { decrement: selectedPkg.price },
          activePackageName: selectedPkg.name,
          packageExpiresAt: expiryDate,
          remainingPosts: { increment: selectedPkg.posts },
          remainingBoostDays: { increment: selectedPkg.boostDays },
        },
      }),
      db.walletTransaction.create({
        data: {
          doctorId: doctorId,
          amount: selectedPkg.price,
          type: 'DEBIT',
          method: 'PACKAGE_PURCHASE',
          notes: `${selectedPkg.name} (৳${selectedPkg.price}) প্যাকেজ অ্যাক্টিভেশন`,
          status: 'COMPLETED',
        },
      }),
      db.doctorCampaign.create({
        data: {
          doctorId: doctorId,
          packageName: packageKey,
          priceBdt: selectedPkg.price,
          totalPosts: selectedPkg.posts,
          boostDays: selectedPkg.boostDays,
          status: 'ACTIVE',
          impressions: Math.floor(1500 + Math.random() * 2000),
          reach: Math.floor(1000 + Math.random() * 1500),
          clicks: Math.floor(50 + Math.random() * 100),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Congratulations! Your ${selectedPkg.name} Plan has been successfully activated.`,
      wallet_balance: updatedDoctor.walletBalance,
      active_package: updatedDoctor.activePackageName,
      remaining_posts: updatedDoctor.remainingPosts,
      remaining_boost_days: updatedDoctor.remainingBoostDays,
      transaction: transaction,
      campaign: campaign,
    });
  } catch (error: any) {
    console.error('Package subscription error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
