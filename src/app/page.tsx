import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { MapPin, ArrowUpRight, ShieldCheck, UserCheck, Phone, Stethoscope, Building2, CheckCircle2, Sparkles } from 'lucide-react';
import HeroHospitalSlider from '@/components/HeroHospitalSlider';
import StatCards from '@/components/StatCards';

export const revalidate = 0;

export default async function HomePage() {
  const [registeredHospitals, doctorCount, bloodDonorCount] = await Promise.all([
    db.hospital.findMany({
      where: {
        status: { in: ['ACTIVE', 'APPROVED'] },
        district: { slug: 'chuadanga' },
      },
      include: {
        facilities: true,
        _count: { select: { doctors: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
    db.doctor.count().catch(() => 0),
    db.bloodDonor.count().catch(() => 0),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/70 via-sky-50/30 to-slate-50/60 space-y-16 lg:space-y-[96px] pb-16 lg:pb-[96px]">
      {/* Interactive Registered Hospitals Hero Slider */}
      <HeroHospitalSlider hospitals={registeredHospitals} />

      {/* Upgraded Hospitals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-[80px]">
        {/* Heading Box (40px bottom gap to grid on desktop) */}
        <div className="border-b border-slate-200/80 pb-5 mb-8 lg:mb-[40px]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/60 text-sky-700 text-xs font-extrabold lg:tracking-[4px]">
              <Building2 className="w-3.5 h-3.5 text-sky-600" /> Chuadanga Healthcare Directory
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[30px] font-black lg:font-bold text-nuvicaNavy-900 tracking-tight">
              Hospitals & Clinics in Chuadanga
            </h2>
          </div>
        </div>

        {/* Upgraded Modern Hospital Grid (Shows First 3 Cards, 40px bottom gap to CTA on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-[40px]">
          {registeredHospitals.slice(0, 3).map((hospital) => (
            <div 
              key={hospital.id} 
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm lg:shadow-[0_2px_8px_rgba(0,0,0,0.06)] lg:hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] lg:hover:-translate-y-1 lg:transition-all lg:duration-250 lg:ease-in-out lg:cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              <div className="space-y-4 p-6 pb-2">
                {/* Hospital Cover Image Box - 16:9 Aspect Ratio */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner lg:group-hover:border-sky-300 transition-colors">
                  <img
                    src={hospital.coverUrl || hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                    alt={hospital.name}
                    className="w-full h-full object-cover lg:group-hover:scale-[1.05] lg:transition-transform lg:duration-300 lg:ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{hospital.address}</span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="space-y-2">
                  <h3 className="font-extrabold lg:font-semibold text-lg lg:text-[19px] text-nuvicaNavy-900 leading-snug lg:group-hover:text-sky-600 transition-colors">
                    <Link href={`/hospitals/${hospital.slug}`}>
                      {hospital.name}
                    </Link>
                  </h3>
                  <p className="text-xs lg:text-[14px] text-slate-500 lg:text-[#6B7280] line-clamp-2 leading-relaxed font-medium lg:font-normal">
                    {hospital.description}
                  </p>

                </div>
              </div>

              {/* Card Action Footer - Clean 2-Button Grid */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2.5">
                  {hospital.phone ? (
                    <a
                      href={`tel:${hospital.phone}`}
                      className="relative w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-900 border border-sky-200/90 hover:border-sky-400 text-xs font-extrabold shadow-2xs hover:shadow-md hover:shadow-sky-500/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-1.5 overflow-hidden group/btn"
                      title={`হটলাইন: ${hospital.phone}`}
                    >
                      {/* Light Shimmer Glare */}
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-sky-200/40 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                      <Phone className="relative z-10 w-3.5 h-3.5 text-sky-600 group-hover/btn:text-sky-700 group-hover/btn:rotate-12 group-hover/btn:scale-115 transition-transform duration-300 shrink-0" />
                      <span className="relative z-10">হটলাইন</span>
                    </a>
                  ) : null}

                  <Link 
                    href={`/hospitals/${hospital.slug}`} 
                    className={`relative w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white text-xs font-extrabold shadow-sm hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden group/detail ${hospital.phone ? '' : 'col-span-2'}`}
                  >
                    {/* Light Shimmer Glare */}
                    <span className="absolute inset-0 -translate-x-full group-hover/detail:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    <span className="relative z-10">বিস্তারিত</span> 
                    <ArrowUpRight className="relative z-10 w-3.5 h-3.5 text-white group-hover/detail:translate-x-0.5 group-hover/detail:-translate-y-0.5 group-hover/detail:scale-110 transition-transform duration-300 shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Hospitals CTA */}
        {registeredHospitals.length > 0 && (
          <div className="pt-4 lg:pt-2 text-center">
            <Link
              href="/hospitals"
              className="relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white text-sky-900 font-extrabold text-sm border border-sky-200/80 shadow-sm hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-1 hover:border-sky-500 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden group"
            >
              {/* Hover Gradient Background Sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
              
              {/* Shimmer Light Reflection Overlay */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out" />
              
              {/* Button Text */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                সকল হাসপাতাল দেখুন
              </span>
              
              {/* Animated Arrow Icon */}
              <ArrowUpRight className="relative z-10 w-4 h-4 text-sky-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300 ease-out shrink-0" />
            </Link>
          </div>
        )}
      </section>

      {/* Structured 4-Card Metric Stats Grid */}
      <StatCards 
        hospitalCount={registeredHospitals.length} 
        doctorCount={doctorCount} 
        bloodDonorCount={bloodDonorCount} 
      />
    </div>
  );
}
