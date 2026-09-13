import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';
import DoctorDetailClientView from './DoctorDetailClientView';

export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  let doctor: any = null;

  try {
    doctor = await db.doctor.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        hospital: true,
        department: true,
      },
    }).catch(() => null);
  } catch (err) {
    console.error('Error generating metadata for doctor:', err);
  }

  if (!doctor) {
    doctor = FALLBACK_DOCTORS.find((d) => d.id === id || d.slug === id) || null;
  }

  if (!doctor) {
    return {
      title: 'ডাক্তার পাওয়া যায়নি | CD Doctors',
      description: 'অনুরোধকৃত ডাক্তারের তথ্য খুঁজে পাওয়া যায়নি।',
    };
  }

  const deptName = doctor.department?.nameBn || doctor.specialization;
  const hospitalName = doctor.hospital?.name ? ` - ${doctor.hospital.name}` : '';

  return {
    title: `${doctor.name} (${deptName})${hospitalName} | CD Doctors Chuadanga`,
    description: `${doctor.name} (${doctor.degrees}) - ${deptName}। চেম্বারের সময়সূচি, ভিজিট ফি ও সরাসরি সিরিয়ালের ফোন নম্বর জানুন।`,
    openGraph: {
      title: `${doctor.name} | CD Doctors Chuadanga`,
      description: `${doctor.degrees} - ${deptName}`,
      images: doctor.photoUrl ? [{ url: doctor.photoUrl }] : [],
    },
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { id } = params;
  let doctor: any = null;

  try {
    const dbDoctor = await db.doctor.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        hospital: { include: { district: true } },
        department: true,
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    }).catch(() => null);

    doctor = dbDoctor;
  } catch (err) {
    console.error('Error fetching doctor details from DB:', err);
  }

  // Check fallback doctors if DB did not return doctor
  if (!doctor) {
    doctor = FALLBACK_DOCTORS.find((d) => d.id === id || d.slug === id) || null;
  }

  if (!doctor) {
    notFound();
  }

  return <DoctorDetailClientView doctor={doctor} />;
}
