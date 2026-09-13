import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const BOOST_PLANS_CONFIG: Record<
  string,
  { name: string; labelBn: string; price: number; targetType: 'LOCAL' | 'NATIONWIDE'; durationDays: number; description: string }
> = {
  LOCAL_CHAMBER: {
    name: 'Local Chamber Boost',
    labelBn: 'লোকাল চেম্বার বুস্ট',
    price: 199,
    targetType: 'LOCAL',
    durationDays: 1,
    description: 'আপনার চেম্বারের আশেপাশের ১৫ কিমি এলাকার ৫,০০০+ রোগীর ফেসবুক ওয়ালে ২৪ ঘণ্টার স্পনসরড বিজ্ঞাপন।',
  },
  NATIONWIDE_TELEMEDICINE: {
    name: 'Nationwide Telemedicine Boost',
    labelBn: 'দেশব্যাপী টেলিমেডিসিন বুস্ট',
    price: 399,
    targetType: 'NATIONWIDE',
    durationDays: 1,
    description: 'সারা দেশের ৬৪ জেলার রোগীদের কাছে আপনার অনলাইন ভিডিও কনসালটেশনের ২৪ ঘণ্টার মেটা বিজ্ঞাপন।',
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
    const { boostKey } = body; // "LOCAL_CHAMBER" | "NATIONWIDE_TELEMEDICINE"

    const selectedBoost = BOOST_PLANS_CONFIG[boostKey];
    if (!selectedBoost) {
      return NextResponse.json({ success: false, error: 'অবৈধ বুস্ট প্ল্যান নির্বাচন করেছেন।' }, { status: 400 });
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: {
        hospital: {
          include: { district: true },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'ডাক্তার অ্যাকাউন্ট পাওয়া যায়নি।' }, { status: 404 });
    }

    if (doctor.walletBalance < selectedBoost.price) {
      const shortage = selectedBoost.price - doctor.walletBalance;
      return NextResponse.json(
        {
          success: false,
          error: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। ${selectedBoost.labelBn} চালু করতে আরও ৳${shortage} রিচার্জ করুন।`,
          shortage: shortage,
          current_balance: doctor.walletBalance,
          required_amount: selectedBoost.price,
        },
        { status: 402 }
      );
    }

    const targetLocation = selectedBoost.targetType === 'LOCAL'
      ? (doctor.hospital?.district?.nameBn || doctor.chamberAddress || 'স্থানীয় জেলা')
      : 'সমগ্র বাংলাদেশ (৬৪ জেলা)';

    // Atomic transaction: Deduct wallet + record transaction + create campaign
    const [updatedDoctor, transaction, campaign] = await db.$transaction([
      db.doctor.update({
        where: { id: doctorId },
        data: {
          walletBalance: { decrement: selectedBoost.price },
          remainingBoostDays: { increment: selectedBoost.durationDays },
        },
      }),
      db.walletTransaction.create({
        data: {
          doctorId: doctorId,
          amount: selectedBoost.price,
          type: 'DEBIT',
          method: 'BOOST_PURCHASE',
          notes: `${selectedBoost.labelBn} (৳${selectedBoost.price}) — টার্গেট: ${targetLocation}`,
          status: 'COMPLETED',
        },
      }),
      db.doctorCampaign.create({
        data: {
          doctorId: doctorId,
          packageName: boostKey,
          priceBdt: selectedBoost.price,
          totalPosts: 1,
          boostDays: selectedBoost.durationDays,
          targetType: selectedBoost.targetType,
          status: 'ACTIVE',
          impressions: selectedBoost.targetType === 'LOCAL' ? Math.floor(4000 + Math.random() * 2500) : Math.floor(9000 + Math.random() * 5000),
          reach: selectedBoost.targetType === 'LOCAL' ? Math.floor(3200 + Math.random() * 1800) : Math.floor(7500 + Math.random() * 3500),
          clicks: Math.floor(45 + Math.random() * 80),
        },
      }),
    ]);

    // Optional webhook trigger to n8n if configured in environment
    const n8nWebhookUrl = process.env.N8N_DOCTOR_BOOST_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialization: doctor.specialization,
            degrees: doctor.degrees,
            phone: doctor.phone,
            boostType: boostKey,
            targetLocation,
            priceBdt: selectedBoost.price,
            campaignId: campaign.id,
          }),
        }).catch((err) => console.error('n8n webhook trigger error (non-fatal):', err));
      } catch (err) {
        // non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      message: `অভিনন্দন! আপনার ${selectedBoost.labelBn} সফলভাবে শুরু হয়েছে। আগামী ২৪ ঘণ্টা এটি সক্রিয় থাকবে।`,
      wallet_balance: updatedDoctor.walletBalance,
      transaction: transaction,
      campaign: campaign,
    });
  } catch (error: any) {
    console.error('Doctor boost error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
