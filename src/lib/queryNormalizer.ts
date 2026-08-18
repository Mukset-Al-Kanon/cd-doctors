/**
 * Centralized Query Normalization & Healthcare Synonym Engine (STEP 20)
 * Handles Banglish variations, phonetic spelling, typos, and semantic specialty resolution.
 */

export type CanonicalSpecialty =
  | 'NEPHROLOGY'
  | 'PEDIATRICS'
  | 'GYNECOLOGY'
  | 'CARDIOLOGY'
  | 'MEDICINE'
  | 'DERMATOLOGY'
  | 'ORTHOPEDICS'
  | 'NEUROLOGY'
  | 'ENT'
  | 'OPHTHALMOLOGY'
  | 'UROLOGY'
  | 'DENTISTRY'
  | 'GASTROENTEROLOGY'
  | 'ENDOCRINOLOGY';

export interface SpecialtyDefinition {
  canonical: CanonicalSpecialty;
  canonicalNameEn: string;
  canonicalNameBn: string;
  keywords: string[];
  dbKeywords: string[];
}

export const SPECIALTY_REGISTRY: Record<CanonicalSpecialty, SpecialtyDefinition> = {
  NEPHROLOGY: {
    canonical: 'NEPHROLOGY',
    canonicalNameEn: 'Nephrology',
    canonicalNameBn: 'কিডনি ও নেফ্রোলজি',
    keywords: [
      'kidney', 'kidni', 'kidny', 'kdin', 'kydney', 'kydni', 'kidne',
      'nephrology', 'nephrologist', 'nephro', 'renal',
      'কিডনি', 'নেফ্রোলজি', 'রেনাল', 'নেফ্রো'
    ],
    dbKeywords: ['nephrolog', 'kidney', 'renal', 'nephro', 'কিডনি', 'নেফ্রোলজি', 'urolog'],
  },
  PEDIATRICS: {
    canonical: 'PEDIATRICS',
    canonicalNameEn: 'Pediatrics',
    canonicalNameBn: 'শিশু বিশেষজ্ঞ',
    keywords: [
      'pediatric', 'pediatrics', 'paediatric', 'paediatrics', 'pediatrician',
      'child', 'children', 'baby', 'newborn', 'neonat', 'neonatologist',
      'shishu', 'sisu', 'sishu', 'shisu', 'sisur', 'shishur', 'bacha', 'baccha',
      'শিশু', 'বাচ্চা', 'নবজাতক', 'কিশোর', 'dch', 'paed'
    ],
    dbKeywords: ['pediatr', 'paediatr', 'child', 'shishu', 'sisu', 'sishu', 'শিশু', 'বাচ্চা', 'নবজাতক', 'dch', 'paed'],
  },
  GYNECOLOGY: {
    canonical: 'GYNECOLOGY',
    canonicalNameEn: 'Gynecology',
    canonicalNameBn: 'গাইনি ও প্রসূতি',
    keywords: [
      'gynecology', 'gynecologist', 'gynaecology', 'gynaecologist',
      'gyne', 'gynae', 'gaini', 'gyni', 'gynei', 'gynic',
      'obs', 'obstetric', 'obstetrics', 'women', 'female', 'mohila', 'stri', 'proshuti',
      'গাইনি', 'গাইনী', 'মহিলা', 'স্ত্রী', 'প্রসূতি', 'গর্ভবতী', 'নারীরোগ', 'dgo'
    ],
    dbKeywords: ['gynecolog', 'gynaecolog', 'gynae', 'gyne', 'obstet', 'obs', 'স্ত্রী', 'প্রসূতি', 'dgo', 'infertility'],
  },
  CARDIOLOGY: {
    canonical: 'CARDIOLOGY',
    canonicalNameEn: 'Cardiology',
    canonicalNameBn: 'হৃদরোগ (কার্ডিওলজি)',
    keywords: [
      'cardiology', 'cardiologist', 'cardiac', 'cardio',
      'heart', 'hart', 'hridrog', 'hrid', 'hridroog',
      'হৃদরোগ', 'কার্ডিওলজি', 'হার্ট', 'কার্ডিয়াক', 'd-card'
    ],
    dbKeywords: ['cardiolog', 'cardiac', 'heart', 'হৃদরোগ', 'কার্ডিওলজি', 'd-card'],
  },
  MEDICINE: {
    canonical: 'MEDICINE',
    canonicalNameEn: 'Medicine',
    canonicalNameBn: 'মেডিসিন বিশেষজ্ঞ',
    keywords: [
      'medicine', 'medisin', 'medisn', 'medicin', 'medecin',
      'physician', 'internal medicine', 'general medicine', 'medisin doctor',
      'মেডিসিন', 'মেডিসিন বিশেষজ্ঞ', 'এফসিপিএস মেডিসিন'
    ],
    dbKeywords: ['physician', 'internal medicine', 'মেডিসিন', 'medicine'],
  },
  DERMATOLOGY: {
    canonical: 'DERMATOLOGY',
    canonicalNameEn: 'Dermatology',
    canonicalNameBn: 'চর্ম ও যৌন',
    keywords: [
      'dermatology', 'dermatologist', 'derma', 'skin', 'skincare',
      'chormo', 'cormo', 'chormorog', 'twok', 'alorji', 'allergy',
      'চর্ম', 'ত্বক', 'এলার্জি', 'চামড়া', 'যৌনরোগ', 'ddv', 'laser'
    ],
    dbKeywords: ['dermatolog', 'skin', 'derma', 'চর্ম', 'এলার্জি', 'ddv', 'laser'],
  },
  ORTHOPEDICS: {
    canonical: 'ORTHOPEDICS',
    canonicalNameEn: 'Orthopedics',
    canonicalNameBn: 'অর্থোপেডিক্স (হাড়-জোড়া)',
    keywords: [
      'orthopedics', 'orthopedist', 'orthopaedics', 'ortho',
      'bone', 'fracture', 'joint', 'spine', 'had', 'har',
      'অর্থোপেডিক্স', 'হাড়', 'ভাঙা', 'ট্রমা', 'd-ortho'
    ],
    dbKeywords: ['orthoped', 'orthopaed', 'ortho', 'bone', 'অর্থোপেডিক্স', 'হাড়', 'trauma', 'spine', 'd-ortho'],
  },
  NEUROLOGY: {
    canonical: 'NEUROLOGY',
    canonicalNameEn: 'Neurology',
    canonicalNameBn: 'নিউরোমেডিসিন ও ব্রেইন',
    keywords: [
      'neurology', 'neurologist', 'neuro', 'brain', 'stroke', 'neuro medicine',
      'নিউরো', 'ব্রেইন', 'স্ট্রোক', 'মস্তিষ্ক', 'নিউরোমেডিসিন'
    ],
    dbKeywords: ['neurolog', 'neuro', 'নিউরোমেডিসিন', 'ব্রেইন', 'stroke'],
  },
  ENT: {
    canonical: 'ENT',
    canonicalNameEn: 'ENT',
    canonicalNameBn: 'নাক, কান ও গলা (ENT)',
    keywords: [
      'ent', 'ear', 'nose', 'throat', 'nak kan gola', 'kan nak gola',
      'nak', 'kan', 'gola', 'নাক কান গলা', 'নাক', 'কান', 'গলা', 'dlo'
    ],
    dbKeywords: ['ent', 'ear', 'nose', 'throat', 'নাক', 'কান', 'গলা', 'dlo'],
  },
  OPHTHALMOLOGY: {
    canonical: 'OPHTHALMOLOGY',
    canonicalNameEn: 'Ophthalmology',
    canonicalNameBn: 'চক্ষু (চোখ)',
    keywords: [
      'ophthalmology', 'ophthalmologist', 'eye', 'vision',
      'chokh', 'chok', 'chokhu', 'চোখ', 'চক্ষু', 'দৃষ্টি', 'phaco'
    ],
    dbKeywords: ['eye', 'ophthalm', 'চক্ষু', 'চোখ', 'phaco'],
  },
  UROLOGY: {
    canonical: 'UROLOGY',
    canonicalNameEn: 'Urology',
    canonicalNameBn: 'ইউরোলজি',
    keywords: [
      'urology', 'urologist', 'urol', 'urinary', 'prostate',
      'ইউরোলজি', 'মূত্রনালী', 'প্রোস্টেট'
    ],
    dbKeywords: ['urolog', 'ইউরোলজি'],
  },
  DENTISTRY: {
    canonical: 'DENTISTRY',
    canonicalNameEn: 'Dentistry',
    canonicalNameBn: 'দন্ত ও মুখরোগ (ডেন্টাল)',
    keywords: [
      'dentistry', 'dentist', 'dental', 'tooth', 'teeth', 'dat', 'dant', 'oral',
      'দাঁত', 'ডেন্টাল', 'মুখরোগ', 'bds', 'dmd'
    ],
    dbKeywords: ['dentist', 'dental', 'dmd', 'bds', 'দাঁত', 'oral'],
  },
  GASTROENTEROLOGY: {
    canonical: 'GASTROENTEROLOGY',
    canonicalNameEn: 'Gastroenterology',
    canonicalNameBn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার',
    keywords: [
      'gastroenterology', 'gastroenterologist', 'gastro', 'liver', 'gastric',
      'লিভার', 'গ্যাস্ট্রো', 'এন্ডোস্কোপি', 'পেট'
    ],
    dbKeywords: ['gastroenterol', 'liver', 'endoscop', 'লিভার'],
  },
  ENDOCRINOLOGY: {
    canonical: 'ENDOCRINOLOGY',
    canonicalNameEn: 'Endocrinology',
    canonicalNameBn: 'ডায়াবেটিস ও হরমোন',
    keywords: [
      'endocrinology', 'endocrinologist', 'diabetes', 'diabetic', 'diabet', 'hormone', 'thyroid',
      'ডায়াবেটিস', 'হরমোন', 'থাইরয়েড'
    ],
    dbKeywords: ['diabetol', 'ডায়াবেটিস', 'endocrin', 'hormone'],
  },
};

/**
 * Standard Levenshtein Distance for typo tolerance
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];
  for (let i = 0; i <= bn; i++) matrix[i] = [i];
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Centralized Banglish, Typo & Whitespace Normalizer
 */
export function normalizeQueryText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let s = input.toLowerCase().trim();

  // Remove unnecessary punctuation while preserving alphanumeric and Bengali characters
  s = s.replace(/[\?\.!,\-_:;\(\)\[\]"'/\\#@$%^&*]/g, ' ');

  // Collapse consecutive identical characters if length > 2 (e.g. "kidniiii" -> "kidni", "docttooor" -> "doctor")
  s = s.replace(/(.)\1{2,}/g, '$1$1');

  // Collapse multiple whitespaces
  s = s.replace(/\s+/g, ' ').trim();

  // Normalize common phonetic Banglish variations
  s = s.replace(/\bhospitel\b|\bhospitl\b|\bহাসপাতাল\b/g, 'hospital');
  s = s.replace(/\bdaktar\b|\bdactor\b|\bdoktor\b|\bdoc\b|\bডাক্তার\b|\bচিকিৎসক\b/g, 'doctor');
  s = s.replace(/\bbisessoggo\b|\bbisheshoggo\b|\bbisheshagya\b|\bbisesoggo\b/g, 'specialist');
  s = s.replace(/\bimergency\b|\bemergancy\b|\bজরুরি\b/g, 'emergency');
  s = s.replace(/\bambulence\b|\bএ্যাম্বুলেন্স\b|\bঅ্যাম্বুলেন্স\b/g, 'ambulance');
  s = s.replace(/\bblud\b|\brokt\b|\brokto\b|\bরক্ত\b/g, 'blood');
  s = s.replace(/\bdonar\b|\bদাতা\b/g, 'donor');

  return s;
}

import { matchCasualQueryPattern } from '@/lib/ai/casualQueryPatterns';

/**
 * Detect Healthcare Specialty with High-Tolerance Fuzzy & Synonym Matching
 */
export function detectHealthcareSpecialty(
  input: string,
  history: Array<{ sender: string; text: string }> = []
): {
  specialty?: CanonicalSpecialty;
  canonicalNameEn?: string;
  canonicalNameBn?: string;
  dbKeywords?: string[];
  isClarificationAnswer?: boolean;
} {
  const norm = normalizeQueryText(input);
  if (!norm) return {};

  const tokens = norm.split(/\s+/).filter((t) => t.length > 0);

  // Check if previous turn was a clarification question from AI asking for specialty
  let isAnsweringClarification = false;
  if (history.length > 0) {
    const lastAiMsg = [...history].reverse().find((m) => m.sender === 'ai');
    if (lastAiMsg && (
      lastAiMsg.text.includes('কোন বিষয়ে বা কোন ধরনের ডাক্তার') ||
      lastAiMsg.text.includes('কোন বিষয়ের বিশেষজ্ঞ ডাক্তার') ||
      lastAiMsg.text.includes('কোন বিষয়ের ডাক্তার') ||
      lastAiMsg.text.includes('কোন বিশেষজ্ঞ')
    )) {
      isAnsweringClarification = true;
    }
  }

  // 0. Check massive casual query patterns first
  const pattern = matchCasualQueryPattern(input);
  if (pattern?.specialty && SPECIALTY_REGISTRY[pattern.specialty]) {
    const spec = SPECIALTY_REGISTRY[pattern.specialty];
    return {
      specialty: spec.canonical,
      canonicalNameEn: spec.canonicalNameEn,
      canonicalNameBn: spec.canonicalNameBn,
      dbKeywords: spec.dbKeywords,
      isClarificationAnswer: isAnsweringClarification,
    };
  }

  // 1. Direct Exact & Phrase Match across all specialties
  for (const spec of Object.values(SPECIALTY_REGISTRY)) {
    for (const kw of spec.keywords) {
      if (
        norm === kw ||
        norm.startsWith(kw + ' ') ||
        norm.endsWith(' ' + kw) ||
        norm.includes(' ' + kw + ' ') ||
        tokens.includes(kw)
      ) {
        return {
          specialty: spec.canonical,
          canonicalNameEn: spec.canonicalNameEn,
          canonicalNameBn: spec.canonicalNameBn,
          dbKeywords: spec.dbKeywords,
          isClarificationAnswer: isAnsweringClarification,
        };
      }
    }
  }

  // 2. Fuzzy Token Match (Tolerance for typos like kidni, kdin, gaini, sisu, medisin, hridrog)
  for (const token of tokens) {
    if (['doctor', 'specialist', 'er', 'k', 'ace', 'chai', 'lagbe', 'dekhaw', 'ki', 'information', 'info'].includes(token)) {
      continue;
    }

    for (const spec of Object.values(SPECIALTY_REGISTRY)) {
      for (const kw of spec.keywords) {
        // Skip comparing short token with very different length
        if (Math.abs(token.length - kw.length) > 2) continue;

        const maxDist = token.length <= 4 ? 1 : 2;
        const dist = calculateLevenshteinDistance(token, kw);

        if (dist <= maxDist) {
          return {
            specialty: spec.canonical,
            canonicalNameEn: spec.canonicalNameEn,
            canonicalNameBn: spec.canonicalNameBn,
            dbKeywords: spec.dbKeywords,
            isClarificationAnswer: isAnsweringClarification,
          };
        }
      }
    }
  }

  return {};
}
