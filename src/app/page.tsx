import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { MapPin, ArrowUpRight, Phone, Building2, Stethoscope } from 'lucide-react';
import HeroHospitalSlider from '@/components/HeroHospitalSlider';
import HomeHospitalCarousel from '@/components/HomeHospitalCarousel';
import HomeDoctorCarousel from '@/components/HomeDoctorCarousel';
import StatCards from '@/components/StatCards';
import PatientSignupBanner from '@/components/PatientSignupBanner';
import HomeCategoryGrid from '@/components/HomeCategoryGrid';
import { FALLBACK_HOSPITALS, FALLBACK_DOCTORS } from '@/lib/staticHospitalData';

export const revalidate = 0;

export default async function HomePage() {
  const session = await getSession().catch(() => null);
  const userDistrict = session?.district || null;
  let registeredHospitals: any[] = FALLBACK_HOSPITALS;
  let registeredDoctors: any[] = FALLBACK_DOCTORS;
  let doctorCount = 30;
  let bloodDonorCount = 12;

  try {
    const [hospitals, doctors, dCount, bCount] = await Promise.all([
      db.hospital.findMany({
        where: {
          status: { in: ['ACTIVE', 'APPROVED'] },
          ...(userDistrict
            ? {
                OR: [
                  { district: { nameBn: userDistrict } },
                  { address: { contains: userDistrict } },
                  { name: { contains: userDistrict } },
                ],
              }
            : {}),
        },
        include: {
          facilities: true,
          _count: { select: { doctors: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }).catch(() => []),
      db.doctor.findMany({
        where: {
          status: 'ACTIVE',
          ...(userDistrict
            ? {
                OR: [
                  { hospital: { district: { nameBn: userDistrict } } },
                  { hospital: { address: { contains: userDistrict } } },
                  { schedules: { some: { district: { contains: userDistrict } } } },
                ],
              }
            : {}),
        },
        include: {
          hospital: true,
          department: true,
          schedules: true,
        },
        orderBy: { experienceYears: 'desc' },
      }).catch(() => []),
      db.doctor.count().catch(() => 30),
      db.bloodDonor.count().catch(() => 12),
    ]);

    if (hospitals && hospitals.length > 0) {
      registeredHospitals = hospitals;
    }
    if (doctors && doctors.length > 0) {
      registeredDoctors = doctors;
    }
    if (dCount && dCount > 0) doctorCount = dCount;
    if (bCount && bCount > 0) bloodDonorCount = bCount;
  } catch (err) {
    console.error('Error fetching homepage data, using static fallback:', err);
  }

  return (
    <div className="min-h-screen bg-white space-y-6 sm:space-y-12 pb-16 lg:pb-[96px] pt-0 md:pt-3">
      {/* 🌟 Category Icons Section (Directly below header) */}
      <HomeCategoryGrid />

        {/* Interactive Registered Hospitals Hero Slider */}
        <HeroHospitalSlider hospitals={registeredHospitals} />


      {/* 1. Specialist Doctors Section (First) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-[80px]">
        {/* Heading Box (Centered) */}
        <div className="border-b border-slate-200/80 pb-5 mb-6 lg:mb-[40px] text-center">
          <div className="space-y-2 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200/60 text-sky-700 text-xs font-extrabold lg:tracking-[4px]">
              <Stethoscope className="w-3.5 h-3.5 text-sky-600" /> {userDistrict ? `${userDistrict} ভেরিফাইড বিশেষজ্ঞ প্যানেল` : 'ভেরিফাইড বিশেষজ্ঞ প্যানেল'}
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[30px] font-black lg:font-bold text-nuvicaNavy-900 tracking-tight">
              {userDistrict ? `Specialist Doctors in ${userDistrict}` : 'Specialist Doctors Directory'}
            </h2>
          </div>
        </div>

        {/* 📱 Mobile Shuffled Infinite Carousel + 💻 Desktop Doctor Grid */}
        <HomeDoctorCarousel doctors={registeredDoctors} />

        {/* See More Doctors CTA */}
        {registeredDoctors.length > 0 && (
          <div className="pt-4 lg:pt-2 text-center">
            <Link
              href="/doctors"
              className="relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white text-sky-900 font-extrabold text-sm border border-sky-200/80 shadow-sm hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-1 hover:border-sky-500 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                সকল বিশেষজ্ঞ ডাক্তার দেখুন
              </span>
            </Link>
          </div>
        )}
      </section>

      {/* 2. Hospitals & Clinics Section (Second) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-[80px]">
        {/* Heading Box (Centered) */}
        <div className="border-b border-slate-200/80 pb-5 mb-6 lg:mb-[40px] text-center">
          <div className="space-y-2 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200/60 text-sky-700 text-xs font-extrabold lg:tracking-[4px]">
              <Building2 className="w-3.5 h-3.5 text-sky-600" /> {userDistrict ? `${userDistrict} স্বাস্থ্যসেবা ডিরেক্টরি` : 'বাংলাদেশ স্বাস্থ্যসেবা ডিরেক্টরি'}
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[30px] font-black lg:font-bold text-nuvicaNavy-900 tracking-tight">
              {userDistrict ? `Hospitals & Clinics in ${userDistrict}` : 'Hospitals & Clinics Directory'}
            </h2>
          </div>
        </div>

        {/* 📱 Mobile Swipeable Carousel + 💻 Desktop Grid */}
        <HomeHospitalCarousel hospitals={registeredHospitals} />

        {/* See More Hospitals CTA */}
        {registeredHospitals.length > 0 && (
          <div className="pt-4 lg:pt-2 text-center">
            <Link
              href="/hospitals"
              className="relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white text-sky-900 font-extrabold text-sm border border-sky-200/80 shadow-sm hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-1 hover:border-sky-500 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                সকল হাসপাতাল দেখুন
              </span>
            </Link>
          </div>
        )}
      </section>

      {/* Patient Account & Verified Sign-Up Banner (Automatically hidden for logged-in users) */}
      <PatientSignupBanner initialSession={session} />

      {/* Structured 4-Card Metric Stats Grid */}
      <StatCards 
        hospitalCount={registeredHospitals.length} 
        doctorCount={doctorCount} 
        bloodDonorCount={bloodDonorCount} 
      />
    </div>
  );
}
