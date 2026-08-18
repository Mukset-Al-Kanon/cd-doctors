import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Star, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'OWNER_ADMIN', 'HOSPITAL_ADMIN'].includes(session.role)) {
    redirect('/admin/login');
  }

  const reviews = await db.review.findMany({
    include: {
      hospital: { select: { name: true } },
      doctor: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-nuvicaNavy-900 tracking-tight">Review Moderation</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Approve, hide, or moderate patient feedback for hospitals and doctors in Chuadanga District.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-400">
            No patient reviews submitted yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-nuvicaNavy-900">{rev.patientName}</h4>
                  <p className="text-[11px] text-slate-500">{rev.doctor?.name} • {rev.hospital?.name}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                  <Star className="w-4 h-4 fill-amber-400" /> {rev.rating} / 5
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium italic">"{rev.comment}"</p>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="badge-mint text-[10px] py-0.5 px-2">{rev.status}</span>
                <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
