import { db } from '@/lib/db';

export interface HospitalResultItem {
  id: string;
  name: string;
  slug: string;
  hospitalType: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  hasEmergency: boolean;
  hasIcu: boolean;
  facilities: string[];
  districtName: string;
  description?: string;
}

export interface DoctorScheduleItem {
  dayOfWeek: number;
  dayNameBn: string;
  startTime: string;
  endTime: string;
}

export interface DoctorResultItem {
  id: string;
  name: string;
  slug: string;
  degrees: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  chamberRoom: string;
  phone: string;
  photoUrl: string;
  hospitalName: string;
  hospitalSlug: string;
  departmentNameBn: string;
  departmentNameEn: string;
  schedules: DoctorScheduleItem[];
  treatedDiseases?: string;
  bio?: string;
}

export interface BloodDonorResultItem {
  id: string;
  fullName: string;
  phone: string;
  bloodGroup: string;
  age: number;
  gender: string;
  address: string;
  area: string;
  availability: string;
}

export interface EmergencyServiceResultItem {
  id: string;
  title: string;
  number: string;
  desc: string;
  badge: string;
  icon: string;
  isAvailable: boolean;
}

export interface PrescribedTestMatchResult {
  hospital: HospitalResultItem;
  matchedTests: string[];
  unmatchedTests: string[];
  matchedCount: number;
  totalCount: number;
  coveragePercentage: number;
}

export interface PrescriptionSearchResult {
  identifiedTests: Array<{
    rawName: string;
    normalizedName: string;
    category?: string;
  }>;
  verifiedMatches: PrescribedTestMatchResult[];
  unverifiedTests: string[];
}

const BANG_DAY_NAMES: Record<number, string> = {
  0: 'রবিবার',
  1: 'সোমবার',
  2: 'মঙ্গলবার',
  3: 'বুধবার',
  4: 'বৃহস্পতিবার',
  5: 'শুক্রবার',
  6: 'শনিবার',
};

const BENGALI_TO_ENGLISH_MAP: Record<string, string> = {
  'রফিকুল': 'rafiqul',
  'রফিক': 'rafiq',
  'ইসলাম': 'islam',
  'নাজমা': 'nazma',
  'আক্তার': 'akter',
  'তাহমিনা': 'tahmina',
  'সাইফুল': 'saiful',
  'রেহানা': 'rehana',
  'চৌধুরী': 'chowdhury',
  'ফজলুল': 'fazlul',
  'হক': 'haque',
  'তারিক': 'tariq',
  'হাসান': 'hasan',
  'সায়িদা': 'sayeeda',
  'সুলতানা': 'sultana',
  'মনিরুজ্জামান': 'moniruzzaman',
  'মাহবুবুর': 'mahbubur',
  'রহমান': 'rahman',
  'ফারুক': 'farooq',
  'হাবিবুর': 'habibur',
};

const KNOWN_NAME_TOKENS = new Set([
  'rafiqul', 'rafiq', 'islam', 'nazma', 'akter', 'tahmina', 'saiful', 'rehana', 'chowdhury',
  'fazlul', 'haque', 'tariq', 'hasan', 'sayeeda', 'sultana', 'moniruzzaman', 'kamal', 'hossain',
  'nuzhat', 'fatema', 'towhidul', 'sharmeen', 'selina', 'parveen', 'kazi', 'ariful', 'mahbubur',
  'rahman', 'zakir', 'enamul', 'kabir', 'shahriar', 'motiur', 'rumana', 'imran', 'fahmida',
  'babul', 'akhter', 'golam', 'sarwar', 'afroza', 'begum', 'syeda', 'rawnak', 'jahan', 'nazmul',
  'huda', 'asaduzzaman', 'রফিকুল', 'রফিক', 'ইসলাম', 'নাজমা', 'আক্তার', 'তাহমিনা', 'সাইফুল',
  'রেহানা', 'চৌধুরী', 'ফজলুল', 'হক', 'তারিক', 'হাসান', 'সায়িদা', 'সুলতানা', 'মনিরুজ্জামান'
]);

function normalizeToken(token: string): string {
  const lower = token.toLowerCase();
  return BENGALI_TO_ENGLISH_MAP[lower] || lower;
}

import {
  SPECIALTY_REGISTRY,
  CanonicalSpecialty,
  detectHealthcareSpecialty,
} from '@/lib/queryNormalizer';

/**
 * Centralized Specialty Alias & Keyword Resolution Engine (STEP 20)
 */
export function resolveSpecialtyKeywords(inputStr: string): string[] {
  if (!inputStr || typeof inputStr !== 'string') return [];
  const s = inputStr.trim();

  // If already a canonical specialty key
  if (s in SPECIALTY_REGISTRY) {
    return SPECIALTY_REGISTRY[s as CanonicalSpecialty].dbKeywords;
  }

  // Check detected specialty via normalizer
  const detected = detectHealthcareSpecialty(s);
  if (detected.specialty && SPECIALTY_REGISTRY[detected.specialty]) {
    return SPECIALTY_REGISTRY[detected.specialty].dbKeywords;
  }

  const sLower = s.toLowerCase();
  const keywords: string[] = [];

  for (const spec of Object.values(SPECIALTY_REGISTRY)) {
    if (spec.keywords.some((kw) => sLower.includes(kw))) {
      keywords.push(...spec.dbKeywords);
    }
  }

  return Array.from(new Set(keywords));
}

/**
 * Search hospitals from database
 */
export async function searchHospitals(params: {
  query?: string;
  districtId?: string;
  location?: string;
  icuOnly?: boolean;
  emergencyOnly?: boolean;
} = {}): Promise<HospitalResultItem[]> {
  try {
    const { query, districtId, location, icuOnly, emergencyOnly } = params || {};

    const whereClause: any = {
      status: 'ACTIVE',
    };

    if (districtId) {
      whereClause.districtId = districtId;
    }

    const hospitals = await db.hospital.findMany({
      where: whereClause,
      include: {
        district: true,
        facilities: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (!hospitals || hospitals.length === 0) return [];

    return hospitals
      .map((h: any) => {
        const facs: string[] = (h.facilities || []).map((f: any) => f.facilityName);
        const hasEmergency = facs.some((f) => f.toLowerCase().includes('emergency')) || true;
        const hasIcu = facs.some((f) => f.toLowerCase().includes('icu'));

        return {
          id: h.id,
          name: h.name,
          slug: h.slug,
          hospitalType: h.hospitalType,
          address: h.address,
          phone: h.phone,
          emergencyPhone: h.emergencyPhone || h.phone,
          hasEmergency,
          hasIcu,
          facilities: facs,
          districtName: h.district?.nameBn || h.district?.nameEn || 'Chuadanga',
          description: h.description || '',
        };
      })
      .filter((h) => {
        if (icuOnly && !h.hasIcu) return false;
        if (emergencyOnly && !h.hasEmergency) return false;

        if (location && location.trim() !== '') {
          const locLower = location.toLowerCase();
          const matchLoc = h.address.toLowerCase().includes(locLower) || h.name.toLowerCase().includes(locLower);
          if (!matchLoc) return false;
        }

        if (query && query.trim() !== '') {
          const qLower = query.toLowerCase().trim();
          const isGenericHospitalQuery =
            qLower === 'হাসপাতাল' ||
            qLower === 'hospital' ||
            qLower.includes('হাসপাতালগুলোর তালিকা') ||
            qLower.includes('ভালো হাসপাতাল');

          if (!isGenericHospitalQuery) {
            const matchName = h.name.toLowerCase().includes(qLower);
            const matchAddr = h.address.toLowerCase().includes(qLower);
            const matchType = h.hospitalType.toLowerCase().includes(qLower);
            const matchFac = h.facilities.some((f) => f.toLowerCase().includes(qLower));

            if (!matchName && !matchAddr && !matchType && !matchFac) return false;
          }
        }

        return true;
      });
  } catch (error) {
    console.error('Error in searchHospitals tool:', error);
    return [];
  }
}

/**
 * Get detailed information for a specific hospital
 */
export async function getHospitalDetails(params: { hospitalId?: string; slug?: string } = {}): Promise<HospitalResultItem | null> {
  try {
    const { hospitalId, slug } = params || {};
    if (!hospitalId && !slug) return null;

    const h: any = await db.hospital.findFirst({
      where: {
        OR: [{ id: hospitalId }, { slug: slug }],
        status: 'ACTIVE',
      },
      include: {
        district: true,
        facilities: true,
      },
    });

    if (!h) return null;

    const facs: string[] = (h.facilities || []).map((f: any) => f.facilityName);
    const hasEmergency = facs.some((f) => f.toLowerCase().includes('emergency')) || true;
    const hasIcu = facs.some((f) => f.toLowerCase().includes('icu'));

    return {
      id: h.id,
      name: h.name,
      slug: h.slug,
      hospitalType: h.hospitalType,
      address: h.address,
      phone: h.phone,
      emergencyPhone: h.emergencyPhone || h.phone,
      hasEmergency,
      hasIcu,
      facilities: facs,
      districtName: h.district?.nameBn || h.district?.nameEn || 'Chuadanga',
      description: h.description || '',
    };
  } catch (error) {
    console.error('Error in getHospitalDetails tool:', error);
    return null;
  }
}

/**
 * Search doctors from database with Strict Specialty Enforcement & Doctor Name Entity Accuracy
 */
export async function searchDoctors(params: {
  query?: string;
  specialty?: string;
  name?: string;
  hospitalName?: string;
} = {}): Promise<DoctorResultItem[]> {
  try {
    const { query, specialty, name, hospitalName } = params || {};

    const doctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        hospital: true,
        department: true,
        schedules: true,
      },
      orderBy: {
        experienceYears: 'desc',
      },
    });

    if (!doctors || doctors.length === 0) return [];

    const rawTarget = (name || query || '').toLowerCase().trim();
    const isExplicitDoctorNameSearch =
      Boolean(name && name.trim() !== '') ||
      rawTarget.startsWith('dr.') ||
      rawTarget.startsWith('dr ') ||
      rawTarget.startsWith('ডা.') ||
      rawTarget.startsWith('ডা ');

    const queryWords = rawTarget
      .replace(/dr\.?|ডা\.?|md\.?|akm\.?/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['doctor', 'daktar', 'kon', 'hospital', 'a', 'acen', 'ache', 'kothay', 'boshen', 'er', 'ki', 'specialist'].includes(w));

    const queryNameTokens = queryWords.filter((w) => KNOWN_NAME_TOKENS.has(w));
    const hasExplicitNameTokens = queryNameTokens.length > 0 || isExplicitDoctorNameSearch;

    const targetKeywords = resolveSpecialtyKeywords(specialty || query || '');

    const mappedDoctors = doctors.map((doc) => {
      const scheds: DoctorScheduleItem[] = (doc.schedules || []).map((sc) => ({
        dayOfWeek: sc.dayOfWeek,
        dayNameBn: BANG_DAY_NAMES[sc.dayOfWeek] || 'প্রতিদিন',
        startTime: sc.startTime,
        endTime: sc.endTime,
      }));

      const docNameLower = doc.name.toLowerCase();
      let nameScore = 0;

      if (hasExplicitNameTokens) {
        const tokensToMatch = queryNameTokens.length > 0 ? queryNameTokens : queryWords;
        const normalizedTokens = tokensToMatch.map(normalizeToken);
        const matched = normalizedTokens.filter((t) => docNameLower.includes(t));

        if (matched.length === normalizedTokens.length && normalizedTokens.length >= 1) {
          nameScore = 100;
        } else if (matched.length > 0) {
          nameScore = 50;
        }
      }

      return {
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        degrees: doc.degrees,
        specialization: doc.specialization,
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        chamberRoom: doc.chamberRoom,
        phone: doc.phone || doc.hospital?.phone || '',
        photoUrl: doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
        hospitalName: doc.hospital?.name || 'Chuadanga Hospital',
        hospitalSlug: doc.hospital?.slug || '',
        departmentNameBn: doc.department?.nameBn || '',
        departmentNameEn: doc.department?.nameEn || '',
        schedules: scheds,
        treatedDiseases: doc.treatedDiseases || undefined,
        bio: doc.bio || undefined,
        nameScore,
      };
    });

    // HARD SPECIALTY FILTERING LOGIC
    const filtered = mappedDoctors.filter((doc) => {
      // 1. Explicit doctor person name takes precedence when score is high (90+)
      if (hasExplicitNameTokens) {
        return doc.nameScore >= 90;
      }

      // 2. Strict Specialty Enforcement: Doctor MUST match target specialty keywords
      if (targetKeywords.length > 0) {
        const docText = `${doc.specialization} ${doc.degrees} ${doc.departmentNameEn} ${doc.departmentNameBn}`.toLowerCase();
        
        // Specialized filter for Medicine: exclude sub-specialties like Physical Medicine, Chest Medicine, Endocrinology if user asked for general medicine
        const isMedicineSearch = targetKeywords.includes('physician') || targetKeywords.includes('internal medicine') || targetKeywords.includes('মেডিসিন');
        if (isMedicineSearch) {
          const specLower = doc.specialization.toLowerCase();
          const degLower = doc.degrees.toLowerCase();
          if (
            specLower.includes('physical medicine') ||
            degLower.includes('physical medicine') ||
            specLower.includes('physiotherapy') ||
            specLower.includes('neurologist') ||
            specLower.includes('hormone')
          ) {
            return false;
          }
        }

        const matchSpec = targetKeywords.some((kw) => docText.includes(kw));
        if (!matchSpec) return false;
      }

      // 3. Hospital filter
      if (hospitalName && hospitalName.trim() !== '') {
        const hLower = hospitalName.toLowerCase();
        if (!doc.hospitalName.toLowerCase().includes(hLower)) return false;
      }

      return true;
    });

    // Sort by nameScore descending first, then experienceYears descending
    return filtered.sort((a, b) => {
      if (a.nameScore !== b.nameScore) return b.nameScore - a.nameScore;
      return b.experienceYears - a.experienceYears;
    });
  } catch (error) {
    console.error('Error in searchDoctors tool:', error);
    return [];
  }
}

export async function getDoctorDetails(params: { doctorId?: string; slug?: string } = {}): Promise<DoctorResultItem | null> {
  try {
    const { doctorId, slug } = params || {};
    if (!doctorId && !slug) return null;

    const doc = await db.doctor.findFirst({
      where: {
        OR: [{ id: doctorId }, { slug: slug }],
        status: 'ACTIVE',
      },
      include: {
        hospital: true,
        department: true,
        schedules: true,
      },
    });

    if (!doc) return null;

    const scheds: DoctorScheduleItem[] = (doc.schedules || []).map((sc) => ({
      dayOfWeek: sc.dayOfWeek,
      dayNameBn: BANG_DAY_NAMES[sc.dayOfWeek] || 'প্রতিদিন',
      startTime: sc.startTime,
      endTime: sc.endTime,
    }));

    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      degrees: doc.degrees,
      specialization: doc.specialization,
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      chamberRoom: doc.chamberRoom,
      phone: doc.phone || doc.hospital?.phone || '',
      photoUrl: doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      hospitalName: doc.hospital?.name || 'Chuadanga Hospital',
      hospitalSlug: doc.hospital?.slug || '',
      departmentNameBn: doc.department?.nameBn || '',
      departmentNameEn: doc.department?.nameEn || '',
      schedules: scheds,
      treatedDiseases: doc.treatedDiseases || undefined,
    };
  } catch (error) {
    console.error('Error in getDoctorDetails tool:', error);
    return null;
  }
}

/**
 * Search approved blood donors from database (PRIVACY PROTECTED)
 */
export async function searchBloodDonors(params: { bloodGroup?: string; districtId?: string } = {}): Promise<BloodDonorResultItem[]> {
  try {
    const { bloodGroup, districtId } = params || {};

    const whereClause: any = {
      status: 'approved',
      consent: true,
      availability: 'available',
    };

    if (districtId) {
      whereClause.districtId = districtId;
    }

    if (bloodGroup && bloodGroup.trim() !== '') {
      let bg = bloodGroup.trim().toUpperCase();
      if (bg.includes('O POSITIVE') || bg === 'O POSITIVE') bg = 'O+';
      else if (bg.includes('A POSITIVE') || bg === 'A POSITIVE') bg = 'A+';
      else if (bg.includes('B POSITIVE') || bg === 'B POSITIVE') bg = 'B+';
      else if (bg.includes('AB POSITIVE') || bg === 'AB POSITIVE') bg = 'AB+';
      else if (bg.includes('O NEGATIVE') || bg === 'O NEGATIVE') bg = 'O-';
      else if (bg.includes('A NEGATIVE') || bg === 'A NEGATIVE') bg = 'A-';
      else if (bg.includes('B NEGATIVE') || bg === 'B NEGATIVE') bg = 'B-';
      else if (bg.includes('AB NEGATIVE') || bg === 'AB NEGATIVE') bg = 'AB-';

      whereClause.bloodGroup = bg;
    }

    const donors = await db.bloodDonor.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!donors || donors.length === 0) return [];

    return donors.map((d) => ({
      id: d.id,
      fullName: d.fullName,
      phone: d.phone,
      bloodGroup: d.bloodGroup,
      age: d.age,
      gender: d.gender || 'N/A',
      address: d.address,
      area: d.area,
      availability: d.availability,
    }));
  } catch (error) {
    console.error('Error in searchBloodDonors tool:', error);
    return [];
  }
}

/**
 * Get active 24/7 emergency services and helplines
 */
export async function getEmergencyServices(): Promise<EmergencyServiceResultItem[]> {
  try {
    const services = await db.emergencyHelpline.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!services || services.length === 0) return [];

    return services.map((s: any) => ({
      id: s.id,
      title: s.title,
      number: s.number,
      desc: s.desc,
      badge: s.badge,
      icon: s.icon,
      isAvailable: s.isAvailable,
    }));
  } catch (error) {
    console.error('Error in getEmergencyServices tool:', error);
    return [];
  }
}

/**
 * Search local healthcare facilities for prescription laboratory tests
 */
export async function searchPrescriptionTests(testNames: string[]): Promise<PrescriptionSearchResult> {
  try {
    if (!testNames || testNames.length === 0) {
      return { identifiedTests: [], verifiedMatches: [], unverifiedTests: [] };
    }

    const allDbTests = await (db as any).diagnosticTest.findMany({
      where: { isActive: true },
      include: {
        availabilities: {
          where: { availabilityStatus: 'AVAILABLE' },
          include: {
            hospital: {
              include: { facilities: true },
            },
          },
        },
      },
    });

    const identifiedTests: Array<{ rawName: string; normalizedName: string; category?: string }> = [];
    const matchedDbTestMap = new Map<string, any>();
    const unverifiedTests: string[] = [];

    for (const rawName of testNames) {
      const cleanRaw = rawName.trim();
      const normInput = cleanRaw.toLowerCase();

      let matchedDbTest: any = null;

      for (const t of allDbTests) {
        const tNameNorm = t.name.toLowerCase();
        let aliases: string[] = [];
        try {
          aliases = JSON.parse(t.aliases);
        } catch (e) {
          aliases = [];
        }
        const aliasNorms = aliases.map((a: string) => a.toLowerCase());

        if (
          tNameNorm === normInput ||
          tNameNorm.includes(normInput) ||
          normInput.includes(tNameNorm) ||
          aliasNorms.includes(normInput) ||
          aliasNorms.some((a) => normInput.includes(a) || a.includes(normInput))
        ) {
          matchedDbTest = t;
          break;
        }
      }

      if (matchedDbTest) {
        identifiedTests.push({
          rawName: cleanRaw,
          normalizedName: matchedDbTest.name,
          category: matchedDbTest.category,
        });
        matchedDbTestMap.set(matchedDbTest.name, matchedDbTest);
      } else {
        identifiedTests.push({
          rawName: cleanRaw,
          normalizedName: cleanRaw,
        });
        unverifiedTests.push(cleanRaw);
      }
    }

    const matchedCanonicalNames = Array.from(matchedDbTestMap.keys());
    if (matchedCanonicalNames.length === 0) {
      return { identifiedTests, verifiedMatches: [], unverifiedTests };
    }

    const hospitalMatchesMap = new Map<string, { hospital: any; matched: Set<string> }>();

    for (const [canonicalName, dbTest] of Array.from(matchedDbTestMap.entries())) {
      for (const avail of dbTest.availabilities) {
        if (avail.hospital && (avail.hospital.status === 'ACTIVE' || avail.hospital.status === 'APPROVED')) {
          const hId = avail.hospital.id;
          if (!hospitalMatchesMap.has(hId)) {
            hospitalMatchesMap.set(hId, { hospital: avail.hospital, matched: new Set() });
          }
          hospitalMatchesMap.get(hId)!.matched.add(canonicalName);
        }
      }
    }

    const verifiedMatches: PrescribedTestMatchResult[] = [];

    for (const { hospital, matched } of Array.from(hospitalMatchesMap.values())) {
      const matchedTests = Array.from(matched);
      const unmatchedTests = matchedCanonicalNames.filter((n) => !matched.has(n));
      const matchedCount = matchedTests.length;
      const totalCount = matchedCanonicalNames.length;
      const coveragePercentage = Math.round((matchedCount / totalCount) * 100);

      const facs: string[] = (hospital.facilities || []).map((f: any) => f.facilityName);

      verifiedMatches.push({
        hospital: {
          id: hospital.id,
          name: hospital.name,
          slug: hospital.slug,
          hospitalType: hospital.hospitalType,
          address: hospital.address,
          phone: hospital.phone,
          emergencyPhone: hospital.emergencyPhone || hospital.phone,
          hasEmergency: facs.some((f) => f.toLowerCase().includes('emergency')) || true,
          hasIcu: facs.some((f) => f.toLowerCase().includes('icu')),
          facilities: facs,
          districtName: 'Chuadanga',
          description: hospital.description || '',
        },
        matchedTests,
        unmatchedTests,
        matchedCount,
        totalCount,
        coveragePercentage,
      });
    }

    verifiedMatches.sort((a, b) => {
      if (b.coveragePercentage !== a.coveragePercentage) {
        return b.coveragePercentage - a.coveragePercentage;
      }
      return b.matchedCount - a.matchedCount;
    });

    return {
      identifiedTests,
      verifiedMatches,
      unverifiedTests,
    };
  } catch (error) {
    console.error('Error in searchPrescriptionTests tool:', error);
    return { identifiedTests: [], verifiedMatches: [], unverifiedTests: [] };
  }
}
