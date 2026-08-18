import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Users, PhoneCall, Mail, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function AdminPatientsPage() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'OWNER_ADMIN', 'HOSPITAL_ADMIN'].includes(session.role)) {
    redirect('/admin/login');
  }

  const appointments = await db.appointment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      hospital: { select: { name: true } },
      doctor: { select: { name: true } },
    },
  });

  // Aggregate unique patient records by phone number
  const patientMap = new Map();

  for (const apt of appointments) {
    if (!patientMap.has(apt.patientPhone)) {
      patientMap.set(apt.patientPhone, {
        name: apt.patientName,
        phone: apt.patientPhone,
        email: apt.patientEmail || 'N/A',
        age: apt.patientAge,
        gender: apt.patientGender,
        totalAppointments: 1,
        lastHospital: apt.hospital.name,
        lastDoctor: apt.doctor.name,
        lastDate: apt.appointmentDate,
      });
    } else {
      const p = patientMap.get(apt.patientPhone);
      p.totalAppointments += 1;
    }
  }

  const patients = Array.from(patientMap.values());

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-nuvicaNavy-900 tracking-tight">Patient Directory</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Protected directory of unique patient records extracted from appointment bookings in Chuadanga District.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Total Appts</th>
                <th className="px-6 py-4">Last Doctor & Hospital</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No patient records recorded yet.
                  </td>
                </tr>
              ) : (
                patients.map((p, i) => (
                  <tr key={i} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-nuvicaNavy-900 text-sm">{p.name}</td>
                    <td className="px-6 py-4 text-slate-700 font-bold">{p.phone}</td>
                    <td className="px-6 py-4 text-slate-500">{p.email}</td>
                    <td className="px-6 py-4 text-slate-600">{p.age} Yrs ({p.gender})</td>
                    <td className="px-6 py-4">
                      <span className="badge-mint text-[10px] py-0.5 px-2">{p.totalAppointments} Appts</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{p.lastDoctor}</div>
                      <div className="text-[11px] text-slate-500">{p.lastHospital} ({p.lastDate})</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
