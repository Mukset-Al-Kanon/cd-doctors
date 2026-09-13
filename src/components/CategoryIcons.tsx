import React from 'react';

interface IconProps {
  className?: string;
}

// 1. অনুসন্ধান (Search) - Minimalist modern magnifying glass with clean document
export function SearchIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Document */}
      <rect x="8" y="7" width="22" height="28" rx="3.5" fill="#F0F9FF" stroke="#1E293B" strokeWidth="1.6" />
      <line x1="13" y1="14" x2="23" y2="14" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="19" x2="25" y2="19" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="24" x2="20" y2="24" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" />

      {/* Magnifying Glass Lens */}
      <circle cx="26" cy="26" r="11" fill="#E0F2FE" stroke="#1E293B" strokeWidth="1.8" />
      {/* Subtle Specular Glint */}
      <path d="M20 22C21.2 20 23.5 19 26 19" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" />

      {/* Handle */}
      <rect x="34" y="34" width="4" height="3" rx="0.8" transform="rotate(45 34 34)" fill="#0284C7" stroke="#1E293B" strokeWidth="1.4" />
      <rect x="37" y="37" width="5" height="9" rx="2.5" transform="rotate(45 37 37)" fill="#0284C7" stroke="#1E293B" strokeWidth="1.8" />
    </svg>
  );
}

// 2. ডাক্তার (Doctor) - Modern faceless doctor spot illustration
export function DoctorIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/doctor-icon.png" 
      alt="ডাক্তার" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 3. টেলিমেডিসিন (Telemedicine) - Modern telemedicine video consultation spot illustration
export function TelemedicineIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/telemedicine-icon.png" 
      alt="টেলিমেডিসিন" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 4. হাসপাতাল (Hospital) - Clean architectural clinic facade with blue cross
export function HospitalIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/hospital-icon.png" 
      alt="হাসপাতাল" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 5. সিরিয়াল (Serial) - Modern doctor appointment calendar & clock spot illustration
export function SerialIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/serial-icon.png" 
      alt="সিরিয়াল" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 6. রক্তদান (Blood Donation) - Modern blood donation IV bag & droplet spot illustration
export function BloodIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/blood-icon.png" 
      alt="রক্তদান" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 7. মেডিসিন (Medicine) - Modern medicine bottle & pills spot illustration
export function MedicineIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/medicine-icon.png" 
      alt="মেডিসিন" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 8. লকার (Health Locker) - Modern health records clipboard & patient profile spot illustration
export function LockerIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/locker-icon.png" 
      alt="লকার" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 9. স্ক্যানার (Scanner) - Modern QR prescription phone scanner spot illustration
export function ScannerIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/scanner-icon.png" 
      alt="স্ক্যানার" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 10. অ্যাম্বুলেন্স (Ambulance) - Modern ambulance emergency vehicle spot illustration
export function AmbulanceIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/ambulance-icon.png" 
      alt="অ্যাম্বুলেন্স" 
      className={`${className} object-contain select-none`} 
    />
  );
}

// 11. স্বাস্থ্যবার্তা (Health Tips) - Idea lightbulb with health habits spot illustration
export function HealthTipsIllustratedIcon({ className = "w-11 h-11" }: IconProps) {
  return (
    <img 
      src="/images/health-tips-icon.png" 
      alt="স্বাস্থ্যবার্তা" 
      className={`${className} object-contain select-none`} 
    />
  );
}

