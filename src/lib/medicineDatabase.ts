export interface MedicineItem {
  id: string;
  brandName: string;
  genericName: string;
  form: 'Tab.' | 'Cap.' | 'Syr.' | 'Inj.' | 'Drops' | 'Inhaler' | 'Susp.' | 'Oint.' | 'Supp.' | 'Gel' | 'Powder' | 'Lotion';
  strength: string;
  manufacturer: string;
  defaultDosage?: string;
  defaultDuration?: string;
  defaultInstruction?: string;
  category?: string;
}

export interface DiseaseTemplate {
  id: string;
  title: string;
  category: string;
  chiefComplaints: string[];
  clinicalFindings?: string;
  diagnosis: string;
  investigations: string[];
  medicines: Array<{
    brandName: string;
    genericName: string;
    form: string;
    strength: string;
    dosage: string;
    duration: string;
    instruction: string;
  }>;
  advice: string[];
}

// 🏥 MASSIVE BANGLADESHI PHARMACEUTICAL MASTER DATABASE (DGDA & Top Pharma Certified)
export const MASTER_BANGLADESH_MEDICINES: MedicineItem[] = [
  // =========================================================================
  // 1. ANALGESICS, ANTIPYRETICS, NSADS & MUSCLE RELAXANTS (ব্যথানাশক ও জ্বর)
  // =========================================================================
  { id: 'm-1', brandName: 'Napa', genericName: 'Paracetamol', form: 'Tab.', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে (জ্বর বা ব্যথায়)', category: 'Analgesic' },
  { id: 'm-2', brandName: 'Napa Extra', genericName: 'Paracetamol + Caffeine', form: 'Tab.', strength: '500mg+65mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে (তীব্র ব্যথায়)', category: 'Analgesic' },
  { id: 'm-3', brandName: 'Napa Extend', genericName: 'Paracetamol (Extended Release)', form: 'Tab.', strength: '665mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-4', brandName: 'Napa Rapid', genericName: 'Paracetamol (Fast Acting)', form: 'Tab.', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-5', brandName: 'Napa One', genericName: 'Paracetamol', form: 'Tab.', strength: '1000mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-6', brandName: 'Napa Syrup', genericName: 'Paracetamol', form: 'Syr.', strength: '120mg/5ml', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ চামচ ৩ বার', defaultDuration: '৩ দিন', defaultInstruction: 'খাবারের পর', category: 'Pediatric Analgesic' },
  { id: 'm-7', brandName: 'Napa Drops', genericName: 'Paracetamol Paediatric Drops', form: 'Drops', strength: '80mg/ml', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ ড্রপার ৩ বার', defaultDuration: '৩ দিন', defaultInstruction: 'খাওয়ার পর', category: 'Pediatric' },
  { id: 'm-8', brandName: 'Napa Suppository 125', genericName: 'Paracetamol Suppository', form: 'Supp.', strength: '125mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: 'প্রয়োজনে ১টি', defaultDuration: '৩ দিন', defaultInstruction: 'মলদ্বারে ব্যবহার্য (জ্বর ১০২°F এর বেশি হলে)', category: 'Suppository' },
  { id: 'm-9', brandName: 'Napa Suppository 250', genericName: 'Paracetamol Suppository', form: 'Supp.', strength: '250mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: 'প্রয়োজনে ১টি', defaultDuration: '৩ দিন', defaultInstruction: 'মলদ্বারে ব্যবহার্য', category: 'Suppository' },
  { id: 'm-10', brandName: 'Ace', genericName: 'Paracetamol', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-11', brandName: 'Ace Plus', genericName: 'Paracetamol + Caffeine', form: 'Tab.', strength: '500mg+65mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-12', brandName: 'Ace Power', genericName: 'Paracetamol + Tramadol', form: 'Tab.', strength: '325mg+37.5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Severe Analgesic' },
  { id: 'm-13', brandName: 'Ace Syrup', genericName: 'Paracetamol', form: 'Syr.', strength: '120mg/5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ চামচ ৩ বার', defaultDuration: '৩ দিন', defaultInstruction: 'খাবারের পর', category: 'Pediatric Analgesic' },
  { id: 'm-14', brandName: 'Fast', genericName: 'Paracetamol', form: 'Tab.', strength: '500mg', manufacturer: 'Acme Laboratories Ltd.', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-15', brandName: 'Renova', genericName: 'Paracetamol', form: 'Tab.', strength: '500mg', manufacturer: 'Renata Limited', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-16', brandName: 'Dolo', genericName: 'Paracetamol', form: 'Tab.', strength: '500mg', manufacturer: 'Healthcare Pharmaceuticals Ltd.', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-17', brandName: 'Xpa', genericName: 'Paracetamol', form: 'Tab.', strength: '500mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'Analgesic' },
  { id: 'm-18', brandName: 'Flexi', genericName: 'Aceclofenac', form: 'Tab.', strength: '100mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর (গ্যাস্ট্রিকের ওষুধ সহ)', category: 'NSAID' },
  { id: 'm-19', brandName: 'Aceclofen', genericName: 'Aceclofenac', form: 'Tab.', strength: '100mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-20', brandName: 'Reservix', genericName: 'Aceclofenac', form: 'Tab.', strength: '100mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-21', brandName: 'Naprosyn', genericName: 'Naproxen', form: 'Tab.', strength: '500mg', manufacturer: 'Radiant Pharmaceuticals', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-22', brandName: 'Anaprox', genericName: 'Naproxen Sodium', form: 'Tab.', strength: '550mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-23', brandName: 'Xenole', genericName: 'Naproxen + Esomeprazole', form: 'Tab.', strength: '500mg+20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের ৩০ মিনিট আগে', category: 'NSAID + PPI' },
  { id: 'm-24', brandName: 'Torax', genericName: 'Ketorolac Tromethamine', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-25', brandName: 'Rolac', genericName: 'Ketorolac Tromethamine', form: 'Tab.', strength: '10mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-26', brandName: 'Torax Injection', genericName: 'Ketorolac Tromethamine', form: 'Inj.', strength: '30mg/ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'প্রয়োজনে ১টি IV/IM', defaultDuration: '১ দিন', defaultInstruction: 'তীব্র ব্যথায় মাংসপেশি বা শিরায়', category: 'NSAID Inj' },
  { id: 'm-27', brandName: 'Clofenac', genericName: 'Diclofenac Sodium', form: 'Tab.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-28', brandName: 'Voltac', genericName: 'Diclofenac Sodium', form: 'Tab.', strength: '50mg', manufacturer: 'Novartis / Square', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },
  { id: 'm-29', brandName: 'Voltac SR', genericName: 'Diclofenac Sodium Sustained Release', form: 'Cap.', strength: '100mg', manufacturer: 'Novartis / Square', defaultDosage: '০+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'রাতে ভরা পেটে', category: 'NSAID' },
  { id: 'm-30', brandName: 'Clofenac Gel', genericName: 'Diclofenac Diethylamine Gel', form: 'Gel', strength: '1%', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'দিনে ২-৩ বার', defaultDuration: '৭ দিন', defaultInstruction: 'ব্যথার স্থানে আলতো করে মালিশ করুন', category: 'Topical Pain' },
  { id: 'm-31', brandName: 'Xelpro', genericName: 'Celecoxib', form: 'Cap.', strength: '200mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'COX-2 Inhibitor' },
  { id: 'm-32', brandName: 'Torcox', genericName: 'Etoricoxib', form: 'Tab.', strength: '90mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'ভরা পেটে', category: 'COX-2 Inhibitor' },
  { id: 'm-33', brandName: 'Cox-B', genericName: 'Etoricoxib', form: 'Tab.', strength: '90mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'ভরা পেটে', category: 'COX-2 Inhibitor' },
  { id: 'm-34', brandName: 'Etocox', genericName: 'Etoricoxib', form: 'Tab.', strength: '60mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '৭ দিন', defaultInstruction: 'ভরা পেটে', category: 'COX-2 Inhibitor' },
  { id: 'm-35', brandName: 'Bacmax', genericName: 'Baclofen', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর (পেশীর টানে)', category: 'Muscle Relaxant' },
  { id: 'm-36', brandName: 'Tolper', genericName: 'Tolperisone Hydrochloride', form: 'Tab.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Muscle Relaxant' },
  { id: 'm-37', brandName: 'Myosun', genericName: 'Tolperisone Hydrochloride', form: 'Tab.', strength: '50mg', manufacturer: 'Sun Pharmaceutical', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Muscle Relaxant' },
  { id: 'm-38', brandName: 'Tizan', genericName: 'Tizanidine', form: 'Tab.', strength: '2mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Muscle Relaxant' },
  { id: 'm-39', brandName: 'Anadol', genericName: 'Tramadol Hydrochloride', form: 'Cap.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'তীব্র ব্যথায় খাবারের পর', category: 'Opioid Analgesic' },
  { id: 'm-40', brandName: 'Profen', genericName: 'Ibuprofen', form: 'Tab.', strength: '400mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৫ দিন', defaultInstruction: 'ভরা পেটে', category: 'NSAID' },

  // =========================================================================
  // 2. GASTROENTEROLOGY, PPIS, ANTACIDS & PROKINETICS (গ্যাস্ট্রিক ও লিভার)
  // =========================================================================
  { id: 'm-41', brandName: 'Seclo', genericName: 'Omeprazole', form: 'Cap.', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-42', brandName: 'Seclo 40', genericName: 'Omeprazole', form: 'Cap.', strength: '40mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-43', brandName: 'Seclo Injection', genericName: 'Omeprazole IV', form: 'Inj.', strength: '40mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১টি IV প্রতিদিন', defaultDuration: '৩ দিন', defaultInstruction: 'শিরাপথে ধীরগতিতে', category: 'PPI Inj' },
  { id: 'm-44', brandName: 'Sergel', genericName: 'Esomeprazole', form: 'Cap.', strength: '20mg', manufacturer: 'Healthcare Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-45', brandName: 'Sergel 40', genericName: 'Esomeprazole', form: 'Cap.', strength: '40mg', manufacturer: 'Healthcare Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-46', brandName: 'Maxpro', genericName: 'Esomeprazole', form: 'Cap.', strength: '20mg', manufacturer: 'Renata Limited', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-47', brandName: 'Maxpro 40', genericName: 'Esomeprazole', form: 'Cap.', strength: '40mg', manufacturer: 'Renata Limited', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-48', brandName: 'Nexum', genericName: 'Esomeprazole', form: 'Tab.', strength: '20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-49', brandName: 'Nexum 40', genericName: 'Esomeprazole', form: 'Tab.', strength: '40mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-50', brandName: 'Pantonix', genericName: 'Pantoprazole', form: 'Tab.', strength: '20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-51', brandName: 'Pantonix 40', genericName: 'Pantoprazole', form: 'Tab.', strength: '40mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-52', brandName: 'Pantobex', genericName: 'Pantoprazole', form: 'Tab.', strength: '20mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-53', brandName: 'Finix', genericName: 'Rabeprazole Sodium', form: 'Tab.', strength: '20mg', manufacturer: 'Opsonin Pharma Ltd.', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-54', brandName: 'Rabeca', genericName: 'Rabeprazole Sodium', form: 'Tab.', strength: '20mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'PPI' },
  { id: 'm-55', brandName: 'Dexilant', genericName: 'Dexlansoprazole', form: 'Cap.', strength: '30mg', manufacturer: 'Takeda / Incepta', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-56', brandName: 'Dexilant 60', genericName: 'Dexlansoprazole', form: 'Cap.', strength: '60mg', manufacturer: 'Takeda / Incepta', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'সকালে খাবারের আগে', category: 'PPI' },
  { id: 'm-57', brandName: 'Vonopraz', genericName: 'Vonoprazan Fumarate', form: 'Tab.', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের আগে বা পরে', category: 'P-CAB / Acid Blocker' },
  { id: 'm-58', brandName: 'Gaviscon', genericName: 'Sodium Alginate + Potassium Bicarbonate', form: 'Susp.', strength: '200ml', manufacturer: 'Reckitt Benckiser', defaultDosage: '২ চামচ ৩ বার', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর ও ঘুমানোর আগে', category: 'Antacid' },
  { id: 'm-59', brandName: 'Entacyd Plus', genericName: 'Magnesium Hydroxide + Aluminium Hydroxide + Simethicone', form: 'Susp.', strength: '200ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ চামচ ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের ১ ঘণ্টা পর', category: 'Antacid' },
  { id: 'm-60', brandName: 'Mucogel', genericName: 'Magnesium + Aluminium Hydroxide + Simethicone', form: 'Susp.', strength: '200ml', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '২ চামচ ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের ১ ঘণ্টা পর', category: 'Antacid' },
  { id: 'm-61', brandName: 'Motigut', genericName: 'Domperidone', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের ১৫ মিনিট আগে', category: 'Prokinetic' },
  { id: 'm-62', brandName: 'Deflux', genericName: 'Domperidone', form: 'Tab.', strength: '10mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের ১৫ মিনিট আগে', category: 'Prokinetic' },
  { id: 'm-63', brandName: 'Motigut Suspension', genericName: 'Domperidone Suspension', form: 'Susp.', strength: '5mg/5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ চামচ ২ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের ১৫ মিনিট আগে', category: 'Pediatric Prokinetic' },
  { id: 'm-64', brandName: 'Emistat', genericName: 'Ondansetron', form: 'Tab.', strength: '8mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'বমি বমি ভাব থাকলে খাবারের আগে', category: 'Antiemetic' },
  { id: 'm-65', brandName: 'Onset', genericName: 'Ondansetron', form: 'Tab.', strength: '8mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'খাবারের আগে', category: 'Antiemetic' },
  { id: 'm-66', brandName: 'Emistat Syrup', genericName: 'Ondansetron Syrup', form: 'Syr.', strength: '4mg/5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ চামচ ২ বার', defaultDuration: '৩ দিন', defaultInstruction: 'বমির জন্য খাবারের আগে', category: 'Pediatric Antiemetic' },
  { id: 'm-67', brandName: 'Prever', genericName: 'Meclizine + Pyridoxine', form: 'Tab.', strength: '25mg+50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'বমি ও মাথা ঘোরার জন্য', category: 'Antiemetic / Vertigo' },
  { id: 'm-68', brandName: 'Vominil', genericName: 'Meclizine Hydrochloride', form: 'Tab.', strength: '25mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'খাবারের পর', category: 'Antiemetic' },
  { id: 'm-69', brandName: 'Meva', genericName: 'Mebeverine Hydrochloride', form: 'Cap.', strength: '200mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে (IBS পেটে ব্যথায়)', category: 'Antispasmodic / IBS' },
  { id: 'm-70', brandName: 'Duspatalin', genericName: 'Mebeverine Hydrochloride', form: 'Cap.', strength: '200mg', manufacturer: 'Abbott / Healthcare', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের ২০ মিনিট আগে', category: 'Antispasmodic' },
  { id: 'm-71', brandName: 'Spasmolin', genericName: 'Otilonium Bromide', form: 'Tab.', strength: '40mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '১০ দিন', defaultInstruction: 'খাবারের আগে', category: 'Antispasmodic' },
  { id: 'm-72', brandName: 'Avolac', genericName: 'Lactulose Oral Solution', form: 'Syr.', strength: '100ml / 200ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '৩ চামচ রাতে', defaultDuration: '৭ দিন', defaultInstruction: 'কোষ্ঠকাঠিন্যের জন্য রাতে শোয়ার আগে', category: 'Laxative' },
  { id: 'm-73', brandName: 'Osmolac', genericName: 'Lactulose', form: 'Syr.', strength: '100ml / 200ml', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '৩ চামচ রাতে', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে খাবারের পর', category: 'Laxative' },
  { id: 'm-74', brandName: 'Fybogel', genericName: 'Ispaghula Husk Orange', form: 'Powder', strength: 'Sachet', manufacturer: 'Reckitt Benckiser', defaultDosage: '১ স্যাচে ১ গ্লাস পানিতে', defaultDuration: '৭ দিন', defaultInstruction: 'পানিতে গুলিয়ে সাথে সাথে খাবেন', category: 'Bulk Laxative' },
  { id: 'm-75', brandName: 'Dulcolax', genericName: 'Bisacodyl', form: 'Tab.', strength: '5mg', manufacturer: 'Sanofi / Opso Saline', defaultDosage: '০+০+২', defaultDuration: '৩ দিন', defaultInstruction: 'রাতে শোয়ার আগে', category: 'Laxative' },
  { id: 'm-76', brandName: 'Imotil', genericName: 'Loperamide Hydrochloride', form: 'Cap.', strength: '2mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১টি করে দিনে ২ বার', defaultDuration: '২ দিন', defaultInstruction: 'পাতলা পায়খানায় খাবারের পর', category: 'Antidiarrheal' },
  { id: 'm-77', brandName: 'Hydrasec', genericName: 'Racecadotril', form: 'Cap.', strength: '100mg', manufacturer: 'Abbott / Incepta', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'খাবারের শুরুতে', category: 'Antidiarrheal' },

  // =========================================================================
  // 3. ANTIBIOTICS & ANTIMICROBIALS (অ্যান্টিবায়োটিক)
  // =========================================================================
  { id: 'm-78', brandName: 'Azith', genericName: 'Azithromycin', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের ১ ঘণ্টা আগে বা ২ ঘণ্টা পর', category: 'Antibiotic' },
  { id: 'm-79', brandName: 'Zithrin', genericName: 'Azithromycin', form: 'Tab.', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '৫ দিন', defaultInstruction: 'প্রতিদিন নির্দিষ্ট সময়ে খালি পেটে', category: 'Antibiotic' },
  { id: 'm-80', brandName: 'Zimax', genericName: 'Azithromycin', form: 'Tab.', strength: '500mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের ১ ঘণ্টা আগে', category: 'Antibiotic' },
  { id: 'm-81', brandName: 'Zithrin Suspension', genericName: 'Azithromycin Dry Syrup', form: 'Susp.', strength: '200mg/5ml', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ চামচ ১ বার', defaultDuration: '৫ দিন', defaultInstruction: 'প্রতিদিন নির্দিষ্ট সময়ে', category: 'Pediatric Antibiotic' },
  { id: 'm-82', brandName: 'Moxaclav', genericName: 'Amoxicillin + Clavulanic Acid', form: 'Tab.', strength: '625mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের শুরুতে', category: 'Antibiotic' },
  { id: 'm-83', brandName: 'Moxaclav 1g', genericName: 'Amoxicillin + Clavulanic Acid', form: 'Tab.', strength: '1000mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের শুরুতে', category: 'Antibiotic' },
  { id: 'm-84', brandName: 'Fimoxyl', genericName: 'Amoxicillin', form: 'Cap.', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+১+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Antibiotic' },
  { id: 'm-85', brandName: 'Moxacil', genericName: 'Amoxicillin', form: 'Cap.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+১+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Antibiotic' },
  { id: 'm-86', brandName: 'Flugal', genericName: 'Flucloxacillin', form: 'Cap.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+১+১+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের ৩০ মিনিট আগে (চর্ম ও ফোঁড়ার ইনফেকশন)', category: 'Antibiotic' },
  { id: 'm-87', brandName: 'Fluclox', genericName: 'Flucloxacillin', form: 'Cap.', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+১+১+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের ৩০ মিনিট আগে', category: 'Antibiotic' },
  { id: 'm-88', brandName: 'Cef-3', genericName: 'Cefixime', form: 'Cap.', strength: '200mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Cephalosporin' },
  { id: 'm-89', brandName: 'Cef-3 400', genericName: 'Cefixime', form: 'Cap.', strength: '400mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Cephalosporin' },
  { id: 'm-90', brandName: 'Triocim', genericName: 'Cefixime', form: 'Cap.', strength: '200mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Cephalosporin' },
  { id: 'm-91', brandName: 'Ceroxim', genericName: 'Cefuroxime Axetil', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Cephalosporin' },
  { id: 'm-92', brandName: 'Ceroxim 250', genericName: 'Cefuroxime Axetil', form: 'Tab.', strength: '250mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Cephalosporin' },
  { id: 'm-93', brandName: 'Kilbac', genericName: 'Cefuroxime Axetil', form: 'Tab.', strength: '500mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Cephalosporin' },
  { id: 'm-94', brandName: 'Ceftron 1g IV/IM', genericName: 'Ceftriaxone Sodium Injection', form: 'Inj.', strength: '1gm', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১টি IV প্রতিদিন', defaultDuration: '৫ দিন', defaultInstruction: 'শিরাপথে স্যালাইন সহ ধীরে ধীরে', category: 'Cephalosporin Inj' },
  { id: 'm-95', brandName: 'Rocephin', genericName: 'Ceftriaxone Sodium', form: 'Inj.', strength: '1gm', manufacturer: 'Roche / Radiant', defaultDosage: '১টি IV প্রতিদিন', defaultDuration: '৫ দিন', defaultInstruction: 'শিরাপথে', category: 'Antibiotic Inj' },
  { id: 'm-96', brandName: 'Ciprocin', genericName: 'Ciprofloxacin', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর (প্রচুর পানি খাবেন)', category: 'Fluoroquinolone' },
  { id: 'm-97', brandName: 'Neoflox', genericName: 'Ciprofloxacin', form: 'Tab.', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Fluoroquinolone' },
  { id: 'm-98', brandName: 'Levo', genericName: 'Levofloxacin', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Fluoroquinolone' },
  { id: 'm-99', brandName: 'Levoking', genericName: 'Levofloxacin', form: 'Tab.', strength: '500mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Fluoroquinolone' },
  { id: 'm-100', brandName: 'Moxiflo', genericName: 'Moxifloxacin Hydrochloride', form: 'Tab.', strength: '400mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Fluoroquinolone' },
  { id: 'm-101', brandName: 'Amodis', genericName: 'Metronidazole', form: 'Tab.', strength: '400mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+১+১', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর', category: 'Antiprotozoal' },
  { id: 'm-102', brandName: 'Filmet', genericName: 'Metronidazole', form: 'Tab.', strength: '400mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+১+১', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর', category: 'Antiprotozoal' },
  { id: 'm-103', brandName: 'Secnid', genericName: 'Secnidazole', form: 'Tab.', strength: '1000mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২টি এক সাথে এক বেলা', defaultDuration: '১ দিন', defaultInstruction: 'এক বেলার খাবারে ২টি ট্যাবলেট এক সাথে', category: 'Antiprotozoal' },
  { id: 'm-104', brandName: 'Doxacil', genericName: 'Doxycycline', form: 'Cap.', strength: '100mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের মাঝে প্রচুর পানি সহ', category: 'Tetracycline' },
  { id: 'm-105', brandName: 'Uromast', genericName: 'Nitrofurantoin', form: 'Cap.', strength: '100mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর (ইউরিন ইনফেকশনে)', category: 'Urinary Anti-infective' },
  { id: 'm-106', brandName: 'Claricin', genericName: 'Clarithromycin', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Macrolide' },
  { id: 'm-107', brandName: 'Clindacin', genericName: 'Clindamycin', form: 'Cap.', strength: '300mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Lincosamide' },
  { id: 'm-108', brandName: 'Flugal 150', genericName: 'Fluconazole', form: 'Cap.', strength: '150mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'সপ্তাহে ১টি', defaultDuration: '৪ সপ্তাহ', defaultInstruction: 'খাবারের পর (ছত্রাকজনিত সংক্রমণে)', category: 'Antifungal' },
  { id: 'm-109', brandName: 'Itra', genericName: 'Itraconazole', form: 'Cap.', strength: '100mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'ভরা পেটে', category: 'Antifungal' },
  { id: 'm-110', brandName: 'Tinasil', genericName: 'Terbinafine Hydrochloride', form: 'Tab.', strength: '250mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '১৪ দিন', defaultInstruction: 'খাবারের পর (দাদ ও চুলকানিতে)', category: 'Antifungal' },
  { id: 'm-111', brandName: 'Almex', genericName: 'Albendazole', form: 'Tab.', strength: '400mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১টি চিবিয়ে খাবেন', defaultDuration: '১ দিন', defaultInstruction: 'রাতের খাবারের পর চিবিয়ে খাবেন (কৃমির জন্য)', category: 'Anthelminthic' },
  { id: 'm-112', brandName: 'Alben', genericName: 'Albendazole', form: 'Tab.', strength: '400mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১টি চিবিয়ে খাবেন', defaultDuration: '১ দিন', defaultInstruction: 'রাতের খাবারের পর চিবিয়ে খাবেন', category: 'Anthelminthic' },

  // =========================================================================
  // 4. RESPIRATORY, ALLERGY, ASTHMA & COUGH (অ্যালার্জি, শ্বাসকষ্ট ও কাশি)
  // =========================================================================
  { id: 'm-113', brandName: 'Fexo 120', genericName: 'Fexofenadine Hydrochloride', form: 'Tab.', strength: '120mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Antihistamine' },
  { id: 'm-114', brandName: 'Fexo 180', genericName: 'Fexofenadine Hydrochloride', form: 'Tab.', strength: '180mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে', category: 'Antihistamine' },
  { id: 'm-115', brandName: 'Fexo Suspension', genericName: 'Fexofenadine Suspension', form: 'Susp.', strength: '30mg/5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ চামচ ২ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর', category: 'Pediatric Antihistamine' },
  { id: 'm-116', brandName: 'Bilaid', genericName: 'Bilastine', form: 'Tab.', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '১০ দিন', defaultInstruction: 'সকালে খালি পেটে', category: 'Antihistamine' },
  { id: 'm-117', brandName: 'Bislon', genericName: 'Bilastine', form: 'Tab.', strength: '20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: '১০ দিন', defaultInstruction: 'সকালে খালি পেটে', category: 'Antihistamine' },
  { id: 'm-118', brandName: 'Alatrol', genericName: 'Cetirizine Dihydrochloride', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Antihistamine' },
  { id: 'm-119', brandName: 'Alatrol Syrup', genericName: 'Cetirizine Syrup', form: 'Syr.', strength: '5mg/5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ চামচ ১ বার রাতে', defaultDuration: '৫ দিন', defaultInstruction: 'রাতে শোয়ার আগে', category: 'Pediatric Antihistamine' },
  { id: 'm-120', brandName: 'Curin', genericName: 'Levocetirizine', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Antihistamine' },
  { id: 'm-121', brandName: 'Rupafin', genericName: 'Rupatadine', form: 'Tab.', strength: '10mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে', category: 'Antihistamine' },
  { id: 'm-122', brandName: 'Deslor', genericName: 'Desloratadine', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে', category: 'Antihistamine' },
  { id: 'm-123', brandName: 'Monas 10', genericName: 'Montelukast Sodium', form: 'Tab.', strength: '10mg', manufacturer: 'Acme Laboratories Ltd.', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Anti-asthmatic' },
  { id: 'm-124', brandName: 'Monas 5', genericName: 'Montelukast Chewable', form: 'Tab.', strength: '5mg', manufacturer: 'Acme Laboratories Ltd.', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে চিবিয়ে খাবেন (শিশুদের)', category: 'Anti-asthmatic' },
  { id: 'm-125', brandName: 'Montene 10', genericName: 'Montelukast Sodium', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Anti-asthmatic' },
  { id: 'm-126', brandName: 'Provair 10', genericName: 'Montelukast Sodium', form: 'Tab.', strength: '10mg', manufacturer: 'Unimed Unihealth', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Anti-asthmatic' },
  { id: 'm-127', brandName: 'Odmon 10', genericName: 'Montelukast Sodium', form: 'Tab.', strength: '10mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Anti-asthmatic' },
  { id: 'm-128', brandName: 'Tofen', genericName: 'Ketotifen', form: 'Syr.', strength: '1mg/5ml', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ চামচ ২ বার', defaultDuration: '৭ দিন', defaultInstruction: 'খাবারের পর', category: 'Pediatric Antihistamine' },
  { id: 'm-129', brandName: 'Adrylex', genericName: 'Dextromethorphan + Phenylephrine + Triprolidine', form: 'Syr.', strength: '100ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ চামচ ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর (কাশি থাকলে)', category: 'Cough Syrup' },
  { id: 'm-130', brandName: 'Tuspel', genericName: 'Bromhexine + Dextromethorphan', form: 'Syr.', strength: '100ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ চামচ ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর', category: 'Expectorant' },
  { id: 'm-131', brandName: 'Ambrox', genericName: 'Ambroxol Hydrochloride', form: 'Syr.', strength: '100ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ চামচ ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'কফ তরল করার জন্য খাবারের পর', category: 'Mucolytic' },
  { id: 'm-132', brandName: 'Prospan', genericName: 'Dried Ivy Leaf Extract', form: 'Syr.', strength: '100ml', manufacturer: 'Engelhard / Square', defaultDosage: '১ চামচ ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'খাবারের পর (ভেষজ কফ সিরাপ)', category: 'Herbal Cough' },
  { id: 'm-133', brandName: 'Ventolin Inhaler', genericName: 'Salbutamol Inhaler', form: 'Inhaler', strength: '100mcg/puff', manufacturer: 'GlaxoSmithKline', defaultDosage: '২ পাফ প্রয়োজনমত', defaultDuration: 'চলবে', defaultInstruction: 'শ্বাসকষ্টের সময় মুখে টেনে নেবেন', category: 'Bronchodilator' },
  { id: 'm-134', brandName: 'Windel Inhaler', genericName: 'Salbutamol Inhaler', form: 'Inhaler', strength: '100mcg/puff', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ পাফ প্রয়োজনমত', defaultDuration: 'চলবে', defaultInstruction: 'শ্বাসকষ্টের সময়', category: 'Bronchodilator' },
  { id: 'm-135', brandName: 'Bexitrol-F 125', genericName: 'Fluticasone + Salmeterol', form: 'Inhaler', strength: '25/125mcg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ পাফ ২ বার', defaultDuration: '১ মাস', defaultInstruction: 'সকাল ও রাতে টেনে ভালো করে কুলি করবেন', category: 'Inhaled Steroid' },
  { id: 'm-136', brandName: 'Bexitrol-F 250', genericName: 'Fluticasone + Salmeterol', form: 'Inhaler', strength: '25/250mcg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ পাফ ২ বার', defaultDuration: '১ মাস', defaultInstruction: 'টেনে ভালো করে মুখ ধুয়ে ফেলবেন', category: 'Inhaled Steroid' },
  { id: 'm-137', brandName: 'Symbicort Turbuhaler', genericName: 'Budesonide + Formoterol', form: 'Inhaler', strength: '160/4.5mcg', manufacturer: 'AstraZeneca', defaultDosage: '১ ইনহেলেশন ২ বার', defaultDuration: 'চলবে', defaultInstruction: 'সকাল ও রাতে কুলি করবেন', category: 'Inhaled Steroid' },
  { id: 'm-138', brandName: 'Pulmicort Respules', genericName: 'Budesonide Nebuliser Suspension', form: 'Susp.', strength: '0.5mg/2ml', manufacturer: 'AstraZeneca', defaultDosage: '১টি নেবুলাইজ করবেন', defaultDuration: '৩ দিন', defaultInstruction: 'নেবুলাইজার মেশিনে দিয়ে টানবেন', category: 'Nebulizer' },
  { id: 'm-139', brandName: 'Ipratrop Solution', genericName: 'Ipratropium Bromide + Salbutamol', form: 'Drops', strength: 'Nebulising Soln', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১ এমএল করে ৩ বার', defaultDuration: '৩ দিন', defaultInstruction: 'নেবুলাইজারে নরমাল স্যালাইনের সাথে', category: 'Nebulizer' },
  { id: 'm-140', brandName: 'Nosecare Nasal Drops', genericName: 'Xylometazoline Hydrochloride', form: 'Drops', strength: '0.05% / 0.1%', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ ফোঁটা ৩ বার', defaultDuration: '৫ দিন', defaultInstruction: 'নাক বন্ধ থাকলে প্রতি নাকে ২ ফোঁটা', category: 'Nasal Decongestant' },
  { id: 'm-141', brandName: 'Flixonase Nasal Spray', genericName: 'Fluticasone Propionate Aqueous Spray', form: 'Drops', strength: '50mcg/spray', manufacturer: 'GlaxoSmithKline', defaultDosage: '১ স্প্রে প্রতি নাকে ১ বার', defaultDuration: '১ মাস', defaultInstruction: 'সকালে প্রতি নাকের ছিদ্রে ১ বার', category: 'Nasal Steroid' },

  // =========================================================================
  // 5. CARDIOVASCULAR & HYPERTENSION (উচ্চ রক্তচাপ, হার্ট ও কোলেস্টেরল)
  // =========================================================================
  { id: 'm-142', brandName: 'Bizoran 5/20', genericName: 'Amlodipine + Olmesartan', form: 'Tab.', strength: '5mg+20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'প্রতিদিন সকালে নাস্তার পর নির্দিষ্ট সময়ে', category: 'Antihypertensive' },
  { id: 'm-143', brandName: 'Bizoran 5/40', genericName: 'Amlodipine + Olmesartan', form: 'Tab.', strength: '5mg+40mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Antihypertensive' },
  { id: 'm-144', brandName: 'Camlosart', genericName: 'Amlodipine + Olmesartan', form: 'Tab.', strength: '5mg+20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Antihypertensive' },
  { id: 'm-145', brandName: 'Amlopin 5', genericName: 'Amlodipine Besylate', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Calcium Channel Blocker' },
  { id: 'm-146', brandName: 'Amlopin 10', genericName: 'Amlodipine Besylate', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Antihypertensive' },
  { id: 'm-147', brandName: 'Angilock 50', genericName: 'Losartan Potassium', form: 'Tab.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'ARB' },
  { id: 'm-148', brandName: 'Angilock Plus', genericName: 'Losartan + Hydrochlorothiazide', form: 'Tab.', strength: '50mg+12.5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'ARB + Diuretic' },
  { id: 'm-149', brandName: 'Osartil 50', genericName: 'Losartan Potassium', form: 'Tab.', strength: '50mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'ARB' },
  { id: 'm-150', brandName: 'Telma 40', genericName: 'Telmisartan', form: 'Tab.', strength: '40mg', manufacturer: 'Glenmark / Square', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'ARB' },
  { id: 'm-151', brandName: 'Telma-AM', genericName: 'Telmisartan + Amlodipine', form: 'Tab.', strength: '40mg+5mg', manufacturer: 'Glenmark / Square', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'ARB + CCB' },
  { id: 'm-152', brandName: 'Cardibis 2.5', genericName: 'Bisoprolol Fumarate', form: 'Tab.', strength: '2.5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে নাস্তার পর', category: 'Beta-blocker' },
  { id: 'm-153', brandName: 'Cardibis 5', genericName: 'Bisoprolol Fumarate', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Beta-blocker' },
  { id: 'm-154', brandName: 'Betaloc 50', genericName: 'Metoprolol Tartrate', form: 'Tab.', strength: '50mg', manufacturer: 'AstraZeneca / Square', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Beta-blocker' },
  { id: 'm-155', brandName: 'Tenocard 50', genericName: 'Atenolol', form: 'Tab.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Beta-blocker' },
  { id: 'm-156', brandName: 'Nebil 5', genericName: 'Nebivolol', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Beta-blocker' },
  { id: 'm-157', brandName: 'Cardace 2.5', genericName: 'Ramipril', form: 'Tab.', strength: '2.5mg', manufacturer: 'Sanofi / Aventis', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'ACE Inhibitor' },
  { id: 'm-158', brandName: 'Coversyl 5', genericName: 'Perindopril Arginine', form: 'Tab.', strength: '5mg', manufacturer: 'Servier', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে খালি পেটে', category: 'ACE Inhibitor' },
  { id: 'm-159', brandName: 'Natrilix SR', genericName: 'Indapamide Sustained Release', form: 'Tab.', strength: '1.5mg', manufacturer: 'Servier', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Diuretic' },
  { id: 'm-160', brandName: 'Lasix', genericName: 'Furosemide', form: 'Tab.', strength: '40mg', manufacturer: 'Sanofi Bangladesh Ltd.', defaultDosage: '১+০+০', defaultDuration: '৭ দিন', defaultInstruction: 'সকালে নাস্তার পর (প্রস্রাব বৃদ্ধির জন্য)', category: 'Diuretic' },
  { id: 'm-161', brandName: 'Aldactone 25', genericName: 'Spironolactone', form: 'Tab.', strength: '25mg', manufacturer: 'Pfizer / Square', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Potassium-sparing Diuretic' },
  { id: 'm-162', brandName: 'Frusid-Plus', genericName: 'Furosemide + Spironolactone', form: 'Tab.', strength: '20mg+50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'Diuretic Combination' },
  { id: 'm-163', brandName: 'Rosuva 10', genericName: 'Rosuvastatin', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Statin / Cholesterol' },
  { id: 'm-164', brandName: 'Rosuva 20', genericName: 'Rosuvastatin', form: 'Tab.', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Statin' },
  { id: 'm-165', brandName: 'Lipicon 10', genericName: 'Atorvastatin', form: 'Tab.', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Statin' },
  { id: 'm-166', brandName: 'Lipicon 20', genericName: 'Atorvastatin', form: 'Tab.', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Statin' },
  { id: 'm-167', brandName: 'Ecosprin 75', genericName: 'Aspirin (Enteric Coated)', form: 'Tab.', strength: '75mg', manufacturer: 'Acme Laboratories Ltd.', defaultDosage: '০+১+০', defaultDuration: 'চলবে', defaultInstruction: 'দুপুরে ভরা পেটে', category: 'Antiplatelet' },
  { id: 'm-168', brandName: 'Clopid 75', genericName: 'Clopidogrel', form: 'Tab.', strength: '75mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+১+০', defaultDuration: 'চলবে', defaultInstruction: 'দুপুরে ভরা পেটে', category: 'Antiplatelet' },
  { id: 'm-169', brandName: 'Clopid-AS', genericName: 'Clopidogrel + Aspirin', form: 'Tab.', strength: '75mg+75mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+১+০', defaultDuration: 'চলবে', defaultInstruction: 'দুপুরে ভরা পেটে', category: 'Dual Antiplatelet' },
  { id: 'm-170', brandName: 'Nitrocard Spray', genericName: 'Nitroglycerin Sublingual Spray', form: 'Drops', strength: '0.4mg/dose', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১-২ স্প্রে জিহ্বার নিচে', defaultDuration: 'প্রয়োজনে', defaultInstruction: 'বুকে তীব্র ব্যথার সময় জিহ্বার নিচে স্প্রে করবেন', category: 'Angina Relief' },
  { id: 'm-171', brandName: 'Monocard 20', genericName: 'Isosorbide Mononitrate', form: 'Tab.', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: 'চলবে', defaultInstruction: 'খাবারের পর', category: 'Antianginal' },

  // =========================================================================
  // 6. ENDOCRINOLOGY & DIABETES (ডায়াবেটিস ও থাইরয়েড)
  // =========================================================================
  { id: 'm-172', brandName: 'Metfo 500', genericName: 'Metformin Hydrochloride', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: 'চলবে', defaultInstruction: 'খাবারের মাঝে বা ঠিক পরে', category: 'Antidiabetic' },
  { id: 'm-173', brandName: 'Metfo 850', genericName: 'Metformin Hydrochloride', form: 'Tab.', strength: '850mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: 'চলবে', defaultInstruction: 'খাবারের মাঝে', category: 'Antidiabetic' },
  { id: 'm-174', brandName: 'Comprid 2', genericName: 'Glimepiride', form: 'Tab.', strength: '2mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে নাস্তার ঠিক পূর্বে', category: 'Antidiabetic' },
  { id: 'm-175', brandName: 'Comprid 1', genericName: 'Glimepiride', form: 'Tab.', strength: '1mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে নাস্তার ঠিক পূর্বে', category: 'Antidiabetic' },
  { id: 'm-176', brandName: 'Comprid-M', genericName: 'Glimepiride + Metformin', form: 'Tab.', strength: '2mg+500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: 'চলবে', defaultInstruction: 'খাবারের শুরুতে', category: 'Antidiabetic Combination' },
  { id: 'm-177', brandName: 'Linaglip 5', genericName: 'Linagliptin', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে নাস্তার পর', category: 'DPP-4 Inhibitor' },
  { id: 'm-178', brandName: 'Linaglip-M', genericName: 'Linagliptin + Metformin', form: 'Tab.', strength: '2.5mg+500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: 'চলবে', defaultInstruction: 'খাবারের মাঝে', category: 'Antidiabetic Combination' },
  { id: 'm-179', brandName: 'Trajenta', genericName: 'Linagliptin', form: 'Tab.', strength: '5mg', manufacturer: 'Boehringer Ingelheim', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'DPP-4 Inhibitor' },
  { id: 'm-180', brandName: 'Sitaglip 50', genericName: 'Sitagliptin', form: 'Tab.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'DPP-4 Inhibitor' },
  { id: 'm-181', brandName: 'Jardiance 10', genericName: 'Empagliflozin', form: 'Tab.', strength: '10mg', manufacturer: 'Boehringer Ingelheim', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে নাস্তার পর (প্রচুর পানি পান করবেন)', category: 'SGLT2 Inhibitor' },
  { id: 'm-182', brandName: 'Emparol 10', genericName: 'Empagliflozin', form: 'Tab.', strength: '10mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'SGLT2 Inhibitor' },
  { id: 'm-183', brandName: 'Forxiga 10', genericName: 'Dapagliflozin', form: 'Tab.', strength: '10mg', manufacturer: 'AstraZeneca', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে', category: 'SGLT2 Inhibitor' },
  { id: 'm-184', brandName: 'Diamicron MR 60', genericName: 'Gliclazide Modified Release', form: 'Tab.', strength: '60mg', manufacturer: 'Servier', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে নাস্তার সময়', category: 'Antidiabetic' },
  { id: 'm-185', brandName: 'Thyrox 50', genericName: 'Levothyroxine Sodium', form: 'Tab.', strength: '50mcg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে ঘুম থেকে উঠে খালি পেটে পানির সাথে', category: 'Thyroid Hormone' },
  { id: 'm-186', brandName: 'Thyrox 25', genericName: 'Levothyroxine Sodium', form: 'Tab.', strength: '25mcg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে খালি পেটে', category: 'Thyroid Hormone' },
  { id: 'm-187', brandName: 'Thyrox 100', genericName: 'Levothyroxine Sodium', form: 'Tab.', strength: '100mcg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: 'চলবে', defaultInstruction: 'সকালে খালি পেটে', category: 'Thyroid Hormone' },
  { id: 'm-188', brandName: 'Thyrozol 5', genericName: 'Thiamazole (Carbimazole)', form: 'Tab.', strength: '5mg', manufacturer: 'Merck / Square', defaultDosage: '১+০+১', defaultDuration: '১ মাস', defaultInstruction: 'খাবারের পর', category: 'Antithyroid' },

  // =========================================================================
  // 7. VITAMINS, MINERALS, CALCIUM & NUTRITION (ভিটামিন ও ক্যালসিয়াম)
  // =========================================================================
  { id: 'm-189', brandName: 'Ceevit', genericName: 'Vitamin C (Ascorbic Acid)', form: 'Tab.', strength: '250mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '১৪ দিন', defaultInstruction: 'চুষে খাবেন', category: 'Vitamin C' },
  { id: 'm-190', brandName: 'Coralcal-D', genericName: 'Calcium from Coral + Vitamin D3', form: 'Tab.', strength: '500mg+200IU', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Calcium Supplement' },
  { id: 'm-191', brandName: 'Calbo-D', genericName: 'Calcium Carbonate + Vitamin D3', form: 'Tab.', strength: '500mg+200IU', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Calcium' },
  { id: 'm-192', brandName: 'Ostocal-D', genericName: 'Calcium + Vitamin D3', form: 'Tab.', strength: '500mg+200IU', manufacturer: 'Beximco Pharmaceuticals Ltd.', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Calcium' },
  { id: 'm-193', brandName: 'Coralcal-DX', genericName: 'Calcium Orotate + Vitamin D3', form: 'Tab.', strength: '400mg+400IU', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর', category: 'Calcium Orotate' },
  { id: 'm-194', brandName: 'D-Rise 20000', genericName: 'Cholecalciferol (Vitamin D3)', form: 'Cap.', strength: '20,000 IU', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'সপ্তাহে ১টি', defaultDuration: '২ মাস', defaultInstruction: 'সপ্তাহে ১ দিন দুপুরে ভারী খাবারের পর', category: 'Vitamin D3' },
  { id: 'm-195', brandName: 'D-Rise 40000', genericName: 'Vitamin D3 Soft Gel Capsule', form: 'Cap.', strength: '40,000 IU', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'সপ্তাহে ১টি', defaultDuration: '১ মাস', defaultInstruction: 'সপ্তাহে ১টি দুধের সাথে বা খাবারের পর', category: 'Vitamin D3' },
  { id: 'm-196', brandName: 'Neuro-B', genericName: 'Vitamin B1 + B6 + B12', form: 'Tab.', strength: 'Forte Formula', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'খাবারের পর (হাত-পা জ্বালাপোড়ায়)', category: 'Neuro Vitamin' },
  { id: 'm-197', brandName: 'Neurobion', genericName: 'Vitamin B1 + B6 + B12', form: 'Tab.', strength: 'Forte', manufacturer: 'P&G Health', defaultDosage: '১+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'খাবারের পর', category: 'Neuro Vitamin' },
  { id: 'm-198', brandName: 'B-50 Forte', genericName: 'Vitamin B-Complex', form: 'Cap.', strength: 'Forte', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+১+০', defaultDuration: '১ মাস', defaultInstruction: 'দুপুরে খাবারের পর', category: 'Vitamin B' },
  { id: 'm-199', brandName: 'Aristovit-M', genericName: 'Multivitamins + Multiminerals with Zinc', form: 'Tab.', strength: 'Daily Formula', manufacturer: 'Aristopharma Ltd.', defaultDosage: '০+১+০', defaultDuration: '১ মাস', defaultInstruction: 'দুপুরে খাবারের পর', category: 'Multivitamin' },
  { id: 'm-200', brandName: 'Gevit', genericName: 'Multivitamins + Multiminerals (A-Z Gold)', form: 'Tab.', strength: 'Complete', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+১+০', defaultDuration: '১ মাস', defaultInstruction: 'দুপুরে খাবারের পর', category: 'Multivitamin' },
  { id: 'm-201', brandName: 'Babyzinc', genericName: 'Zinc Sulfate', form: 'Syr.', strength: '20mg/5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ চামচ ১ বার', defaultDuration: '১০ দিন', defaultInstruction: 'খাবারের পর (ডায়রিয়া পরবর্তী)', category: 'Pediatric Zinc' },
  { id: 'm-202', brandName: 'ORS (Taste Saline)', genericName: 'Oral Rehydration Salts', form: 'Powder', strength: '500ml Sachet', manufacturer: 'SMC / Square', defaultDosage: 'প্রয়োজনমত', defaultDuration: '৩ দিন', defaultInstruction: 'আধা লিটার ফুটানো পানিতে গুলিয়ে ধীরে ধীরে পান করবেন', category: 'Rehydration' },
  { id: 'm-203', brandName: 'Fefol Spansule', genericName: 'Dried Ferrous Sulfate + Folic Acid', form: 'Cap.', strength: '150mg+0.5mg', manufacturer: 'GlaxoSmithKline', defaultDosage: '০+১+০', defaultDuration: '১ মাস', defaultInstruction: 'দুপুরে খাবারের পর (রক্তশূন্যতায়)', category: 'Iron & Folic Acid' },
  { id: 'm-204', brandName: 'Folison', genericName: 'Folic Acid', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+০', defaultDuration: '১ মাস', defaultInstruction: 'সকালে খাবারের পর (গর্ভবতীদের জন্য)', category: 'Folic Acid' },

  // =========================================================================
  // 8. NEUROLOGY, PSYCHIATRY & SLEEP (মানসিক স্বাস্থ্য, ঘুম ও স্নায়ুরোগ)
  // =========================================================================
  { id: 'm-205', brandName: 'Rivotril 0.5', genericName: 'Clonazepam', form: 'Tab.', strength: '0.5mg', manufacturer: 'Roche / Radiant', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে (অস্থিরতা ও ঘুমের জন্য)', category: 'Anxiolytic / Sleep' },
  { id: 'm-206', brandName: 'Rivotril 1', genericName: 'Clonazepam', form: 'Tab.', strength: '1mg', manufacturer: 'Roche / Radiant', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Anxiolytic' },
  { id: 'm-207', brandName: 'Denixil 0.5', genericName: 'Clonazepam', form: 'Tab.', strength: '0.5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে শোয়ার আগে', category: 'Anxiolytic' },
  { id: 'm-208', brandName: 'Disopan 0.5', genericName: 'Clonazepam', form: 'Tab.', strength: '0.5mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে', category: 'Anxiolytic' },
  { id: 'm-209', brandName: 'Sedil 5', genericName: 'Diazepam', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে ঘুমানোর আগে', category: 'Sedative' },
  { id: 'm-210', brandName: 'Xanax 0.5', genericName: 'Alprazolam', form: 'Tab.', strength: '0.5mg', manufacturer: 'Pfizer / Square', defaultDosage: '০+০+১', defaultDuration: '৭ দিন', defaultInstruction: 'রাতে শোয়ার আগে', category: 'Anxiolytic' },
  { id: 'm-211', brandName: 'Nexito 10', genericName: 'Escitalopram Oxalate', form: 'Tab.', strength: '10mg', manufacturer: 'Sun Pharma / Square', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে খাবারের পর (উদ্বেগ ও বিষণ্ণতায়)', category: 'Antidepressant' },
  { id: 'm-212', brandName: 'Prebator 75', genericName: 'Pregabalin', form: 'Cap.', strength: '75mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে খাবারের পর (নার্ভের ব্যথায়)', category: 'Neuropathic Pain' },
  { id: 'm-213', brandName: 'Prebator 50', genericName: 'Pregabalin', form: 'Cap.', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে খাবারের পর', category: 'Neuropathic Pain' },
  { id: 'm-214', brandName: 'Neugab 75', genericName: 'Pregabalin', form: 'Cap.', strength: '75mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', defaultDosage: '০+০+১', defaultDuration: '১৫ দিন', defaultInstruction: 'রাতে', category: 'Neuropathic Pain' },
  { id: 'm-215', brandName: 'Sibelium 10', genericName: 'Flunarizine', form: 'Tab.', strength: '10mg', manufacturer: 'Janssen / Square', defaultDosage: '০+০+১', defaultDuration: '১ মাস', defaultInstruction: 'রাতে ঘুমানোর আগে (মাইগ্রেনের ব্যথায়)', category: 'Migraine Prophylaxis' },

  // =========================================================================
  // 9. DERMATOLOGY, OPHTHALMOLOGY & ENT (চর্ম, চোখ ও কান)
  // =========================================================================
  { id: 'm-216', brandName: 'Betnovate-N Cream', genericName: 'Betamethasone + Neomycin', form: 'Oint.', strength: '15g / 20g', manufacturer: 'GlaxoSmithKline', defaultDosage: 'দিনে ২ বার', defaultDuration: '৭ দিন', defaultInstruction: 'আক্রান্ত স্থানে হালকা করে লাগাবেন', category: 'Topical Steroid' },
  { id: 'm-217', brandName: 'Dermasol Cream', genericName: 'Clobetasol Propionate', form: 'Oint.', strength: '10g / 20g', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'দিনে ২ বার', defaultDuration: '৭ দিন', defaultInstruction: 'চুলকানির স্থানে আলতো করে লাগাবেন', category: 'Topical Steroid' },
  { id: 'm-218', brandName: 'Candid Cream', genericName: 'Clotrimazole Cream', form: 'Oint.', strength: '1%', manufacturer: 'Glenmark / Square', defaultDosage: 'দিনে ২ বার', defaultDuration: '১৪ দিন', defaultInstruction: 'ছত্রাক আক্রান্ত স্থানে', category: 'Topical Antifungal' },
  { id: 'm-219', brandName: 'Fucidin Cream', genericName: 'Fusidic Acid Cream', form: 'Oint.', strength: '2%', manufacturer: 'Leo Pharma / Healthcare', defaultDosage: 'দিনে ২ বার', defaultDuration: '৭ দিন', defaultInstruction: 'ক্ষত বা ফোঁড়ায় লাগাবেন', category: 'Topical Antibiotic' },
  { id: 'm-220', brandName: 'Viodin 10% Ointment', genericName: 'Povidone Iodine Ointment', form: 'Oint.', strength: '10%', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'দিনে ২ বার', defaultDuration: '৭ দিন', defaultInstruction: 'কাটা-ছেঁড়ায় জীবাণুনাশক হিসেবে', category: 'Antiseptic' },
  { id: 'm-221', brandName: 'Burnsil Cream', genericName: 'Silver Sulfadiazine', form: 'Oint.', strength: '1%', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: 'দিনে ২-৩ বার', defaultDuration: '৭ দিন', defaultInstruction: 'পোড়া স্থানে প্রলেপ দিন', category: 'Burn Care' },
  { id: 'm-222', brandName: 'Moxigan Eye Drops', genericName: 'Moxifloxacin Eye Drops', form: 'Drops', strength: '0.5%', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ ফোঁটা দিনে ৩ বার', defaultDuration: '৭ দিন', defaultInstruction: 'চোখে লাল ভাব বা ইনফেকশনে', category: 'Ophthalmic Antibiotic' },
  { id: 'm-223', brandName: 'Tear Drops', genericName: 'Carboxymethylcellulose Eye Drops', form: 'Drops', strength: '0.5%', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১ ফোঁটা ৪ বার', defaultDuration: '১ মাস', defaultInstruction: 'চোখ শুকিয়ে গেলে (ড্রাই আই)', category: 'Eye Lubricant' },
  { id: 'm-224', brandName: 'Otobiotic Ear Drops', genericName: 'Neomycin + Polymyxin + Hydrocortisone', form: 'Drops', strength: '5ml', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '২ ফোঁটা ৩ বার', defaultDuration: '৭ দিন', defaultInstruction: 'কানে ইনফেকশন ও চুলকানিতে', category: 'Otic Drops' },

  // =========================================================================
  // 10. GYNECOLOGY, UROLOGY & WOMEN'S HEALTH (গাইনি ও ইউরোলজি)
  // =========================================================================
  { id: 'm-225', brandName: 'Traxil 500', genericName: 'Tranexamic Acid', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+১+১', defaultDuration: '৩ দিন', defaultInstruction: 'অতিরিক্ত রক্তক্ষরণ বন্ধ করতে খাবারের পর', category: 'Hemostatic' },
  { id: 'm-226', brandName: 'Gynonorm', genericName: 'Norethisterone', form: 'Tab.', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '১০ দিন', defaultInstruction: 'মাসিক নিয়মিতকরণের জন্য খাবারের পর', category: 'Progestogen' },
  { id: 'm-227', brandName: 'Dolfast', genericName: 'Mefenamic Acid', form: 'Tab.', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '১+০+১', defaultDuration: '৩ দিন', defaultInstruction: 'মাসিকের ব্যথায় ভরা পেটে', category: 'NSAID / Dysmenorrhea' },
  { id: 'm-228', brandName: 'Uromax 0.4', genericName: 'Tamsulosin Hydrochloride', form: 'Cap.', strength: '0.4mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: 'চলবে', defaultInstruction: 'রাতে খাবারের ৩০ মিনিট পর (প্রস্টেটের সমস্যায়)', category: 'Alpha-blocker' },
  { id: 'm-229', brandName: 'Uromax-D', genericName: 'Tamsulosin + Dutasteride', form: 'Cap.', strength: '0.4mg+0.5mg', manufacturer: 'Square Pharmaceuticals PLC', defaultDosage: '০+০+১', defaultDuration: 'চলবে', defaultInstruction: 'রাতে খাবারের পর', category: 'BPH Combination' }
];

// 📋 Comprehensive 1-Click Clinical Disease Templates
export const DEFAULT_DISEASE_TEMPLATES: DiseaseTemplate[] = [
  {
    id: 'tpl-1',
    title: 'সাধারণ সর্দি ও জ্বর (Common Cold & Fever / URI)',
    category: 'General Medicine',
    chiefComplaints: ['জ্বর (Fever - 101°F)', 'সর্দি ও নাক বন্ধ (Runny nose & congestion)', 'গলা ব্যথা ও শুকনো কাশি (Sore throat)', 'গায়ে ব্যথা (Body ache)'],
    clinicalFindings: 'Throat congested, Temperature 101°F, Chest clear on auscultation.',
    diagnosis: 'Acute Upper Respiratory Tract Infection (URTI) / Viral Fever',
    investigations: ['CBC with ESR (Complete Blood Count)', 'Urine R/M/E'],
    medicines: [
      { brandName: 'Napa Extra', genericName: 'Paracetamol + Caffeine', form: 'Tab.', strength: '500mg+65mg', dosage: '১+০+১', duration: '৩ দিন', instruction: 'ভরা পেটে (জ্বর বা গায়ে ব্যথা থাকলে)' },
      { brandName: 'Fexo 120', genericName: 'Fexofenadine Hydrochloride', form: 'Tab.', strength: '120mg', dosage: '০+০+১', duration: '৭ দিন', instruction: 'রাতে ঘুমানোর আগে' },
      { brandName: 'Ceevit', genericName: 'Vitamin C', form: 'Tab.', strength: '250mg', dosage: '১+০+১', duration: '১০ দিন', instruction: 'চুষে খাবেন' },
      { brandName: 'Seclo', genericName: 'Omeprazole', form: 'Cap.', strength: '20mg', dosage: '১+০+১', duration: '৭ দিন', instruction: 'খাবারের ২০ মিনিট আগে' }
    ],
    advice: [
      'পর্যাপ্ত বিশ্রাম নিন এবং প্রচুর কুসুম গরম পানি পান করুন।',
      'লবণ-গরম পানি দিয়ে দিনে ৩-৪ বার কুলকুচি বা গার্গল করুন।',
      'ঠান্ডা পানি, আইসক্রিম ও ফ্রিজের খাবার পরিহার করুন।',
      'জ্বর ১০২ ডিগ্রির বেশি উঠলে মাথায় জলপট্টি দিন।'
    ]
  },
  {
    id: 'tpl-2',
    title: 'তীব্র গ্যাস্ট্রিক ও বুকজ্বালা (Acute Gastritis / GERD)',
    category: 'Gastroenterology',
    chiefComplaints: ['বুকজ্বালা ও টক ঢেকুর (Heartburn & reflux)', 'পেটের উপরের অংশে তীব্র জ্বালাপোড়া (Epigastric pain)', 'বমি বমি ভাব (Nausea)', 'খাবারে অরুচি (Loss of appetite)'],
    clinicalFindings: 'Epigastric tenderness present, bowel sounds normal.',
    diagnosis: 'Acute Gastritis with GERD',
    investigations: ['USG of Whole Abdomen', 'Serum Creatinine', 'Endoscopy of UGI (If pain persists)'],
    medicines: [
      { brandName: 'Sergel', genericName: 'Esomeprazole', form: 'Cap.', strength: '20mg', dosage: '১+০+১', duration: '১৪ দিন', instruction: 'খাবারের ২০ মিনিট আগে' },
      { brandName: 'Gaviscon', genericName: 'Sodium Alginate', form: 'Susp.', strength: '200ml', dosage: '২ চামচ ৩ বার', duration: '৭ দিন', instruction: 'খাবারের ১ ঘণ্টা পর ও রাতে শোয়ার সময়' },
      { brandName: 'Motigut', genericName: 'Domperidone', form: 'Tab.', strength: '10mg', dosage: '১+০+১', duration: '৭ দিন', instruction: 'খাবারের ১৫ মিনিট আগে' }
    ],
    advice: [
      'তেল, মশলাযুক্ত ও ভাজাপোড়া খাবার সম্পূর্ণ পরিহার করুন।',
      'চা, কফি, কোমল পানীয় ও ধূমপান থেকে বিরত থাকুন।',
      'একবারে অতিরিক্ত না খেয়ে অল্প অল্প করে বারবার খাবার গ্রহণ করুন।',
      'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ১ ঘণ্টা পর ঘুমাতে যান।'
    ]
  },
  {
    id: 'tpl-3',
    title: 'ডায়রিয়া ও ডিহাইড্রেশন (Acute Diarrhea / Gastroenteritis)',
    category: 'Gastroenterology',
    chiefComplaints: ['ঘন ঘন পাতলা পায়খানা (Frequent watery stools)', 'পেটে কামড়ানো ব্যথা (Abdominal cramping)', 'তৃষ্ণা ও দুর্বলতা (Weakness)', 'হালকা জ্বর (Low grade fever)'],
    clinicalFindings: 'Mild to moderate dehydration, soft abdomen, hyperactive bowel sounds.',
    diagnosis: 'Acute Gastroenteritis / Acute Watery Diarrhea',
    investigations: ['Stool R/M/E', 'Serum Electrolytes (Na+, K+, Cl-)'],
    medicines: [
      { brandName: 'ORS (Taste Saline)', genericName: 'Oral Rehydration Salts', form: 'Powder', strength: '500ml Sachet', dosage: 'প্রয়োজনমত', duration: '৩ দিন', instruction: 'প্রতিবার পাতলা পায়খানার পর আধা লিটার পানিতে গুলিয়ে ধীরে ধীরে খাবেন' },
      { brandName: 'Amodis', genericName: 'Metronidazole', form: 'Tab.', strength: '400mg', dosage: '১+১+১', duration: '৫ দিন', instruction: 'খাবারের পর' },
      { brandName: 'Ciprocin', genericName: 'Ciprofloxacin', form: 'Tab.', strength: '500mg', dosage: '১+০+১', duration: '৫ দিন', instruction: 'খাবারের পর' },
      { brandName: 'Emistat', genericName: 'Ondansetron', form: 'Tab.', strength: '8mg', dosage: '১+০+১', duration: '৩ দিন', instruction: 'বমি ভাব থাকলে খাবারের আগে' }
    ],
    advice: [
      'স্যালাইনের পাশাপাশি ডাবের পানি, ভাতের মাড় ও কাঁচকলা দিয়ে পাতলা খিচুড়ি খান।',
      'বাইরের খোলা খাবার ও রাস্তার পানি খাওয়া সম্পূর্ণ বন্ধ রাখুন।',
      'হাত ভালো করে সাবান দিয়ে ধুয়ে খাবার গ্রহণ করবেন।'
    ]
  },
  {
    id: 'tpl-4',
    title: 'উচ্চ রক্তচাপ ও মাথাব্যথা (Hypertension Baseline)',
    category: 'Cardiology',
    chiefComplaints: ['মাথার পেছনের অংশে ব্যথা ও ভারী ভাব (Occipital headache)', 'বুক ধড়ফড় করা ও ক্লান্তি (Palpitation)', 'মাথা ঘোরা ও অনিদ্রা (Dizziness)'],
    clinicalFindings: 'BP: 155/95 mmHg, Pulse: 82 bpm, S1 S2 normal, No pedal edema.',
    diagnosis: 'Essential Hypertension (Stage 1/2)',
    investigations: ['ECG (12 Lead)', 'Lipid Profile', 'Serum Creatinine', 'RBS with CUE', 'Echocardiogram (If required)'],
    medicines: [
      { brandName: 'Bizoran 5/20', genericName: 'Amlodipine + Olmesartan', form: 'Tab.', strength: '5mg+20mg', dosage: '১+০+০', duration: 'চলবে', instruction: 'প্রতিদিন সকালে নাস্তার পর নির্দিষ্ট সময়ে' },
      { brandName: 'Rosuva 10', genericName: 'Rosuvastatin', form: 'Tab.', strength: '10mg', dosage: '০+০+১', duration: '১ মাস', instruction: 'রাতে খাবারের পর' },
      { brandName: 'Ecosprin 75', genericName: 'Aspirin', form: 'Tab.', strength: '75mg', dosage: '০+১+০', duration: 'চলবে', instruction: 'দুপুরে ভরা পেটে' }
    ],
    advice: [
      'পাচার লবণ ও অতিরিক্ত কাঁচা লবণ খাওয়া সম্পূর্ণ পরিহার করুন।',
      'চর্বিযুক্ত মাংস ও ডিমের কুসুম খাওয়া কমান।',
      'প্রতিদিন অন্তত ৩০-৪০ মিনিট নিয়মিত হাঁটার অভ্যাস করুন।',
      'প্রতি সপ্তাহে নিয়মিত রক্তচাপ (BP) মেপে নোট রাখুন।'
    ]
  },
  {
    id: 'tpl-5',
    title: 'অ্যালার্জি ও ত্বকের চুলকানি (Allergic Dermatitis / Rhinitis)',
    category: 'Dermatology',
    chiefComplaints: ['শরীরে লাল চাকা চাকা চুলকানি (Itchy skin rashes / Urticaria)', 'অবিরাম হাঁচি ও চোখ দিয়ে পানি পড়া (Sneezing)', 'নাক ও তালু চুলকানো (Nasal itching)'],
    clinicalFindings: 'Urticarial wheals over trunk and limbs, nasal mucosa pale and swollen.',
    diagnosis: 'Allergic Dermatitis with Allergic Rhinitis',
    investigations: ['CBC with Total Eosinophil Count (TEC)', 'Serum IgE Level'],
    medicines: [
      { brandName: 'Bilaid', genericName: 'Bilastine', form: 'Tab.', strength: '20mg', dosage: '১+০+০', duration: '১০ দিন', instruction: 'সকালে খালি পেটে' },
      { brandName: 'Monas 10', genericName: 'Montelukast', form: 'Tab.', strength: '10mg', dosage: '০+০+১', duration: '১ মাস', instruction: 'রাতে ঘুমানোর আগে' },
      { brandName: 'Coralcal-D', genericName: 'Calcium + Vit D3', form: 'Tab.', strength: '500mg', dosage: '০+০+১', duration: '১৫ দিন', instruction: 'রাতে খাবারের পর' }
    ],
    advice: [
      'যেসব খাবারে অ্যালার্জি হয় (চিংড়ি, ইলিশ, বেগুন, গরুর মাংস, হাঁসের ডিম ইত্যাদি) সাময়িকভাবে এড়িয়ে চলুন।',
      'ধুলাবালি ও ধোঁয়া থেকে বাঁচতে বাইরে বের হলে মাস্ক ব্যবহার করুন।',
      'গোসলে মৃদু সাবান ব্যবহার করুন এবং ভেজা কাপড় দীর্ঘক্ষণ পরে থাকবেন না।'
    ]
  }
];

// 🧪 Common Lab Investigations / Tests in Bangladesh
export const COMMON_LAB_INVESTIGATIONS = [
  'CBC with ESR (Complete Blood Count)',
  'RBS with CUE (Random Blood Sugar)',
  'FBS with 2HABF (Fasting & 2h After Breakfast)',
  'Serum Creatinine',
  'Lipid Profile (Cholesterol, HDL, LDL, TG)',
  'Liver Function Test (SGPT / ALT, Bilirubin)',
  'Serum Uric Acid',
  'Serum Electrolytes (Na+, K+, Cl-)',
  'HbA1c (Glycated Hemoglobin)',
  'Urine R/M/E (Routine & Microscopic)',
  'Urine C/S (Culture & Sensitivity)',
  'Stool R/M/E & OBT',
  'USG of Whole Abdomen (Ultra-sonogram)',
  'USG of KUB Region',
  'USG of Pregnancy Profile',
  'Chest X-Ray P/A View',
  'X-Ray Lumbar Spine (B/V)',
  'X-Ray Knee Joint (A/P & Lat)',
  'ECG (12 Lead Electrocardiogram)',
  'Echocardiogram with Color Doppler',
  'Serum TSH (Thyroid Stimulating Hormone)',
  'Serum FT4',
  'Serum Calcium & Vitamin D3',
  'Widal Test / Typhoid IgM',
  'Dengue NS1 Antigen & Dengue Antibody'
];

// 💡 Common Clinical Advice Chips
export const COMMON_ADVICE_CHIPS = [
  'পর্যাপ্ত বিশ্রাম নিন ও প্রচুর কুসুম গরম পানি পান করুন।',
  'তেল, চর্বি ও অতিরিক্ত মশলাযুক্ত খাবার পরিহার করুন।',
  'কাঁচা লবণ খাওয়া সম্পূর্ণ বর্জন করুন।',
  'ধূমপান, জর্দা ও তামাকজাতীয় দ্রব্য বর্জন করুন।',
  'অতিরিক্ত মিষ্টি ও চিনিযুক্ত খাবার পরিহার করুন।',
  'নিয়মিত সকাল অথবা বিকেলে ৩০-৪০ মিনিট হাঁটুন।',
  'খাবার সময়মতো গ্রহণ করুন ও ভরা পেটে ওষুধ খান।',
  'ঠান্ডা পানি, আইসক্রিম ও ধুলাবালি এড়িয়ে চলুন।',
  'লক্ষণ বৃদ্ধি পেলে অবিলম্বে ডাক্তারের পরামর্শ নিন।'
];

// 🔍 Ultra-fast High-Performance Smart Search Engine (Brand, Generic & Category Match)
export function searchMedicines(query: string, limit = 12): MedicineItem[] {
  if (!query || query.trim().length === 0) return MASTER_BANGLADESH_MEDICINES.slice(0, limit);
  const q = query.toLowerCase().trim();

  // Score matches:
  // 1. Exact brand starts with query (Score 100)
  // 2. Generic starts with query (Score 80)
  // 3. Brand contains query (Score 60)
  // 4. Generic contains query (Score 40)
  // 5. Category contains query (Score 20)
  const scored = MASTER_BANGLADESH_MEDICINES.map((item) => {
    const brand = item.brandName.toLowerCase();
    const generic = item.genericName.toLowerCase();
    const cat = item.category ? item.category.toLowerCase() : '';
    let score = 0;

    if (brand.startsWith(q)) {
      score += 100;
    } else if (brand.includes(q)) {
      score += 60;
    }

    if (generic.startsWith(q)) {
      score += 80;
    } else if (generic.includes(q)) {
      score += 40;
    }

    if (cat.includes(q)) {
      score += 20;
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item)
    .slice(0, limit);
}
