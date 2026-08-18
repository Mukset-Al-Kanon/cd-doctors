import { db } from '@/lib/db';
import { getPlatformKnowledge, CD_DOCTORS_PLATFORM_KNOWLEDGE } from '@/lib/platformKnowledge';
import {
  searchHospitals as aiSearchHospitals,
  getHospitalDetails as aiGetHospitalDetails,
  searchDoctors as aiSearchDoctors,
  getDoctorDetails as aiGetDoctorDetails,
  searchBloodDonors as aiSearchBloodDonors,
  getEmergencyServices as aiGetEmergencyServices,
  HospitalResultItem,
  DoctorResultItem,
  BloodDonorResultItem,
  EmergencyServiceResultItem,
} from '@/lib/aiTools';

// ==================================================
// 1. DATA VALIDATION UTILITIES
// ==================================================

export interface DataValidationError {
  field: string;
  message: string;
}

export function validateBloodGroup(bloodGroup: string): boolean {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validGroups.includes(bloodGroup.toUpperCase().replace(/\s+/g, ''));
}

export function validateHospitalRecord(data: Partial<HospitalResultItem>): DataValidationError[] {
  const errors: DataValidationError[] = [];
  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Hospital name is required.' });
  }
  if (!data.phone || data.phone.trim() === '') {
    errors.push({ field: 'phone', message: 'Hospital primary phone is required.' });
  }
  if (!data.address || data.address.trim() === '') {
    errors.push({ field: 'address', message: 'Hospital address is required.' });
  }
  return errors;
}

export function validateDoctorRecord(data: Partial<DoctorResultItem>): DataValidationError[] {
  const errors: DataValidationError[] = [];
  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Doctor name is required.' });
  }
  if (!data.specialization || data.specialization.trim() === '') {
    errors.push({ field: 'specialization', message: 'Doctor specialization is required.' });
  }
  return errors;
}

// ==================================================
// 2. SEARCHABLE TEXT REPRESENTATIONS (FOR RAG & RETRIEVAL)
// ==================================================

export function getHospitalSearchRepresentation(h: HospitalResultItem): string {
  return `
[HOSPITAL RECORD]
Name: ${h.name}
Slug: ${h.slug}
Type: ${h.hospitalType}
Location/Address: ${h.address}, ${h.districtName}
Phone: ${h.phone}
Emergency Phone: ${h.emergencyPhone}
Facilities: ${h.facilities.join(', ')}
Has Emergency: ${h.hasEmergency ? 'Yes' : 'No'}
Has ICU: ${h.hasIcu ? 'Yes' : 'No'}
Description: ${h.description}
`.trim();
}

export function getDoctorSearchRepresentation(d: DoctorResultItem): string {
  const schedulesText = d.schedules.map((s) => `${s.dayNameBn} (${s.startTime}-${s.endTime})`).join(', ');
  return `
[DOCTOR RECORD]
Name: ${d.name}
Slug: ${d.slug}
Degrees: ${d.degrees}
Specialization: ${d.specialization}
Experience: ${d.experienceYears} Years
Hospital Chamber: ${d.hospitalName} (${d.chamberRoom})
Consultation Fee: ${d.consultationFee} BDT
Schedule: ${schedulesText}
Phone: ${d.phone}
`.trim();
}

export function getBloodDonorSearchRepresentation(d: BloodDonorResultItem): string {
  return `
[BLOOD DONOR RECORD]
Group: ${d.bloodGroup}
Name: ${d.fullName}
Area: ${d.area} (${d.address})
Availability: ${d.availability}
Phone: ${d.phone}
`.trim();
}

export function getEmergencySearchRepresentation(e: EmergencyServiceResultItem): string {
  return `
[EMERGENCY SERVICE RECORD]
Title: ${e.title}
Badge: ${e.badge}
Helpline Number: ${e.number}
Description: ${e.desc}
Available: ${e.isAvailable ? 'Yes' : 'No'}
`.trim();
}

// ==================================================
// 3. RETRIEVAL SERVICE LAYER (CENTRAL SOURCE OF TRUTH)
// ==================================================

/**
 * Retrieve Hospitals with Structured Filtering & Verification
 */
export async function searchHospitals(params: {
  query?: string;
  location?: string;
  facility?: string;
  emergencyOnly?: boolean;
  icuOnly?: boolean;
  verifiedOnly?: boolean;
}): Promise<HospitalResultItem[]> {
  const results = await aiSearchHospitals({
    query: params.query || params.facility,
    location: params.location,
    emergencyOnly: params.emergencyOnly,
    icuOnly: params.icuOnly,
  });

  return results;
}

export async function getHospitalById(id: string): Promise<HospitalResultItem | null> {
  return await aiGetHospitalDetails({ hospitalId: id });
}

export async function getHospitalBySlug(slug: string): Promise<HospitalResultItem | null> {
  return await aiGetHospitalDetails({ slug });
}

/**
 * Retrieve Doctors with Structured Filtering
 */
export async function searchDoctors(params: {
  query?: string;
  specialty?: string;
  name?: string;
  hospitalName?: string;
  location?: string;
}): Promise<DoctorResultItem[]> {
  return await aiSearchDoctors(params);
}

export async function searchDoctorsBySpecialty(specialty: string): Promise<DoctorResultItem[]> {
  return await aiSearchDoctors({ specialty });
}

export async function getDoctorById(id: string): Promise<DoctorResultItem | null> {
  return await aiGetDoctorDetails({ doctorId: id });
}

export async function getDoctorBySlug(slug: string): Promise<DoctorResultItem | null> {
  return await aiGetDoctorDetails({ slug });
}

/**
 * Retrieve Blood Donors (PRIVACY PROTECTED)
 * Returns ONLY donors matching status = 'approved', consent = true, and availability = 'available'
 */
export async function searchBloodDonors(params: {
  bloodGroup?: string;
  area?: string;
}): Promise<BloodDonorResultItem[]> {
  if (params.bloodGroup && !validateBloodGroup(params.bloodGroup)) {
    console.warn(`Invalid blood group queried: ${params.bloodGroup}`);
  }
  return await aiSearchBloodDonors(params);
}

/**
 * Retrieve Emergency Services
 */
export async function searchEmergencyServices(): Promise<EmergencyServiceResultItem[]> {
  return await aiGetEmergencyServices();
}

/**
 * Retrieve Platform Knowledge Base (About, Founder Mukset Al Kanon, Mission, Services, Contact)
 */
export function searchPlatformKnowledge(query: string): string {
  return getPlatformKnowledge(query);
}
