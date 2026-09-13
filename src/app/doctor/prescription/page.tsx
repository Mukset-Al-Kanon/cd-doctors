'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Search, 
  History, 
  Sparkles, 
  Stethoscope, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronDown, 
  Layers, 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  BadgeCheck, 
  Check, 
  Clock,
  FlaskConical,
  HeartPulse,
  Pill,
  RotateCcw,
  Sparkle,
  Copy,
  ChevronUp
} from 'lucide-react';
import { 
  MASTER_BANGLADESH_MEDICINES, 
  DEFAULT_DISEASE_TEMPLATES, 
  COMMON_LAB_INVESTIGATIONS, 
  COMMON_ADVICE_CHIPS, 
  searchMedicines, 
  MedicineItem, 
  DiseaseTemplate 
} from '@/lib/medicineDatabase';
import PrescriptionPrintModal from '@/components/doctor/PrescriptionPrintModal';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

interface PrescribedMedicine {
  id: string;
  brandName: string;
  genericName?: string;
  form: string;
  strength: string;
  dosage: string;
  duration: string;
  instruction: string;
}

function DoctorPrescriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get('doctorId');
  const aptIdParam = searchParams.get('appointmentId');
  const phoneParam = searchParams.get('phone');

  // Doctor & Appointment Context
  const [doctor, setDoctor] = useState<any>(null);
  const [doctorId, setDoctorId] = useState<string>(docIdParam || '');
  const [appointmentId, setAppointmentId] = useState<string>(aptIdParam || '');
  const [loading, setLoading] = useState(true);

  // Patient Header Information
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState(phoneParam || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('MALE');
  const [patientSerial, setPatientSerial] = useState<string | number>('');

  // Vitals State
  const [patientWeight, setPatientWeight] = useState('');
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [temperature, setTemperature] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [showVitals, setShowVitals] = useState(false);

  // Clinical Left Column
  const [chiefComplaints, setChiefComplaints] = useState<string[]>([]);
  const [customComplaint, setCustomComplaint] = useState('');
  const [clinicalFindings, setClinicalFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [investigations, setInvestigations] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState('');

  // Right Column (Rx Medicines)
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([
    {
      id: 'init-1',
      brandName: '',
      genericName: '',
      form: 'Tab.',
      strength: '',
      dosage: '১+০+১',
      duration: '৭ দিন',
      instruction: 'খাবারের পর'
    }
  ]);

  // Bottom Section (Advice & Next Visit)
  const [adviceList, setAdviceList] = useState<string[]>([]);
  const [customAdvice, setCustomAdvice] = useState('');
  const [nextVisit, setNextVisit] = useState('৭ দিন');

  // Templates
  const [templates, setTemplates] = useState<DiseaseTemplate[]>(DEFAULT_DISEASE_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');

  // Patient History Drawer
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Search Typeahead Active State for each medicine row
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineItem[]>([]);

  // Print Preview Modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [savedPrescriptionData, setSavedPrescriptionData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Fast Quick Chips Constants
  const DOSAGE_PRESETS = ['১+০+১', '১+১+১', '০+০+১', '১+০+০', '০+১+০', '১/২+০+১/২', '১ চামচ ৩ বার', '২ চামচ ৩ বার', '১ পাফ ২ বার'];
  const DURATION_PRESETS = ['৩ দিন', '৫ দিন', '৭ দিন', '১০ দিন', '১৪ দিন', '১ মাস', 'চলবে'];
  const INSTRUCTION_PRESETS = ['খাবারের পর', 'খাবারের আগে', 'ভরা পেটে', 'খাওয়ার মাঝে', 'ঘুমানোর আগে', 'জ্বর বা ব্যথা থাকলে'];
  const FORM_TYPES = ['Tab.', 'Cap.', 'Syr.', 'Inj.', 'Drops', 'Inhaler', 'Susp.', 'Oint.', 'Supp.', 'Powder'];
  const SYMPTOM_PRESETS = ['জ্বর', 'সর্দি ও কাশি', 'গলা ব্যথা', 'গ্যাস্ট্রিক ও বুকজ্বালা', 'পেটব্যথা', 'পাতলা পায়খানা', 'মাথাব্যথা', 'গায়ে ব্যথা', 'দুর্বলতা', 'চুলকানি'];

  // 1. Fetch Doctor Profile & Load Appointment if linked
  useEffect(() => {
    async function loadInitialData() {
      try {
        let currentDocId = docIdParam;

        if (currentDocId) {
          const docRes = await fetch(`/api/doctors/detail?id=${currentDocId}`);
          const docData = await docRes.json();
          if (docData.doctor) {
            setDoctor(docData.doctor);
            setDoctorId(docData.doctor.id);
          }
        } else {
          const authRes = await fetch('/api/doctor/auth/me');
          const authData = await authRes.json();
          if (authData.success && authData.doctor) {
            setDoctor(authData.doctor);
            setDoctorId(authData.doctor.id);
            currentDocId = authData.doctor.id;
          }
        }

        // If Appointment ID is present, fetch appointment details to auto-fill
        if (aptIdParam && currentDocId) {
          const aptRes = await fetch(`/api/doctor/appointments/list?doctorId=${currentDocId}`);
          const aptData = await aptRes.json();
          if (aptData.appointments) {
            const apt = aptData.appointments.find((a: any) => a.id === aptIdParam);
            if (apt) {
              setPatientName(apt.patientName || '');
              setPatientPhone(apt.patientPhone || '');
              setPatientAge(apt.patientAge ? apt.patientAge.toString() : '');
              setPatientGender(apt.patientGender || 'MALE');
              setPatientSerial(apt.serialNumber || '');
              if (apt.visitReason) {
                setChiefComplaints([apt.visitReason]);
              }
            }
          }
        }

        // Fetch custom templates
        if (currentDocId) {
          const tplRes = await fetch(`/api/doctor/prescriptions/templates?doctorId=${currentDocId}`);
          const tplData = await tplRes.json();
          if (tplData.templates) {
            setTemplates(tplData.templates);
          }
        }
      } catch (err) {
        console.error('Initial load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [docIdParam, aptIdParam]);

  // 2. Fetch Patient History when Phone changes
  const fetchPatientHistory = useCallback(async (phoneToSearch: string) => {
    if (!phoneToSearch || phoneToSearch.length < 5) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/doctor/prescriptions/patient-history?phone=${encodeURIComponent(phoneToSearch)}&doctorId=${doctorId}`);
      const data = await res.json();
      if (data.success && data.prescriptions) {
        setPatientHistory(data.prescriptions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  }, [doctorId]);

  // Trigger search on query
  useEffect(() => {
    if (searchQuery) {
      const results = searchMedicines(searchQuery, 8);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // 3. Load 1-Click Disease Template
  const handleApplyTemplate = (tpl: DiseaseTemplate) => {
    setSelectedTemplateId(tpl.id);
    if (tpl.chiefComplaints && tpl.chiefComplaints.length > 0) {
      setChiefComplaints(tpl.chiefComplaints);
    }
    if (tpl.clinicalFindings) {
      setClinicalFindings(tpl.clinicalFindings);
    }
    if (tpl.diagnosis) {
      setDiagnosis(tpl.diagnosis);
    }
    if (tpl.investigations) {
      setInvestigations(tpl.investigations);
    }
    if (tpl.medicines && tpl.medicines.length > 0) {
      setMedicines(
        tpl.medicines.map((m, idx) => ({
          id: `tpl-med-${idx}-${Date.now()}`,
          brandName: m.brandName,
          genericName: m.genericName || '',
          form: m.form || 'Tab.',
          strength: m.strength || '',
          dosage: m.dosage || '১+০+১',
          duration: m.duration || '৭ দিন',
          instruction: m.instruction || 'খাবারের পর'
        }))
      );
    }
    if (tpl.advice && tpl.advice.length > 0) {
      setAdviceList(tpl.advice);
    }
  };

  // 4. Medicine Rows Manipulation
  const handleAddMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        brandName: '',
        genericName: '',
        form: 'Tab.',
        strength: '',
        dosage: '১+০+১',
        duration: '৭ দিন',
        instruction: 'খাবারের পর'
      }
    ]);
  };

  const handleRemoveMedicineRow = (id: string) => {
    if (medicines.length === 1) {
      setMedicines([
        {
          id: `med-${Date.now()}`,
          brandName: '',
          genericName: '',
          form: 'Tab.',
          strength: '',
          dosage: '১+০+১',
          duration: '৭ দিন',
          instruction: 'খাবারের পর'
        }
      ]);
      return;
    }
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMedicine = (index: number, field: keyof PrescribedMedicine, value: string) => {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSelectMedicineResult = (index: number, item: MedicineItem) => {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        brandName: item.brandName,
        genericName: item.genericName,
        form: item.form,
        strength: item.strength,
        dosage: item.defaultDosage || updated[index].dosage || '১+০+১',
        duration: item.defaultDuration || updated[index].duration || '৭ দিন',
        instruction: item.defaultInstruction || updated[index].instruction || 'খাবারের পর'
      };
      return updated;
    });
    setActiveSearchIndex(null);
    setSearchQuery('');
  };

  // 5. Chief Complaints & Investigations Helpers
  const handleAddComplaint = (cText: string) => {
    if (!cText.trim()) return;
    if (!chiefComplaints.includes(cText.trim())) {
      setChiefComplaints((prev) => [...prev, cText.trim()]);
    }
    setCustomComplaint('');
  };

  const handleRemoveComplaint = (index: number) => {
    setChiefComplaints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddInvestigation = (testName: string) => {
    if (!testName.trim()) return;
    if (!investigations.includes(testName.trim())) {
      setInvestigations((prev) => [...prev, testName.trim()]);
    }
    setCustomTest('');
  };

  const handleRemoveInvestigation = (index: number) => {
    setInvestigations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAdvice = (advText: string) => {
    if (!advText.trim()) return;
    if (!adviceList.includes(advText.trim())) {
      setAdviceList((prev) => [...prev, advText.trim()]);
    }
    setCustomAdvice('');
  };

  const handleRemoveAdvice = (index: number) => {
    setAdviceList((prev) => prev.filter((_, i) => i !== index));
  };

  // 6. Save Prescription to Backend & Open Print Modal
  const handleSaveAndPrint = async () => {
    if (!patientName.trim()) {
      alert('অনুগ্রহ করে রোগীর নাম প্রদান করুন');
      return;
    }
    if (!patientPhone.trim()) {
      alert('অনুগ্রহ করে রোগীর মোবাইল নম্বর প্রদান করুন');
      return;
    }

    const validMedicines = medicines.filter((m) => m.brandName.trim().length > 0);
    if (validMedicines.length === 0) {
      alert('কমপক্ষে ১টি ওষুধ প্রেসক্রিপশনে যোগ করুন');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        doctorId,
        appointmentId: appointmentId || undefined,
        patientName,
        patientPhone,
        patientAge: patientAge || undefined,
        patientGender,
        patientWeight: patientWeight || undefined,
        bp: bp || undefined,
        pulse: pulse || undefined,
        temperature: temperature || undefined,
        bloodSugar: bloodSugar || undefined,
        chiefComplaints,
        clinicalFindings,
        diagnosis,
        investigations,
        medicines: validMedicines,
        advice: adviceList.length > 0 ? adviceList.join('\n') : undefined,
        nextVisit,
      };

      const res = await fetch('/api/doctor/prescriptions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.prescription) {
        setSavedPrescriptionData({
          ...data.prescription,
          medicines: validMedicines,
          chiefComplaints,
          investigations,
          advice: adviceList
        });
        setPrintModalOpen(true);
      } else {
        alert(data.error || 'প্রেসক্রিপশন সংরক্ষণ করা যায়নি');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভার এরর');
    } finally {
      setSaving(false);
    }
  };

  // 7. Save Custom Template
  const handleSaveCustomTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) return;

    try {
      const validMedicines = medicines.filter((m) => m.brandName.trim().length > 0);
      const res = await fetch('/api/doctor/prescriptions/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          title: newTemplateTitle.trim(),
          specialty: doctor?.specialization || 'জেনারেল মেডিসিন',
          complaints: chiefComplaints,
          diagnosis,
          tests: investigations,
          medicines: validMedicines,
          advice: adviceList.join('\n'),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.template) {
        setTemplates((prev) => [
          {
            id: data.template.id,
            title: data.template.title,
            category: 'কাস্টম টেমপ্লেট',
            chiefComplaints,
            diagnosis,
            investigations,
            medicines: validMedicines.map((m) => ({
              brandName: m.brandName,
              genericName: m.genericName || '',
              form: m.form,
              strength: m.strength,
              dosage: m.dosage,
              duration: m.duration,
              instruction: m.instruction,
            })),
            advice: adviceList,
          },
          ...prev,
        ]);
        setSaveTemplateModalOpen(false);
        setNewTemplateTitle('');
        alert('টেমপ্লেট সফলভাবে সংরক্ষিত হয়েছে!');
      }
    } catch (err) {
      alert('টেমপ্লেট সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  // Reset form for new prescription
  const handleResetForm = () => {
    if (confirm('আপনি কি নতুন প্রেসক্রিপশন শুরু করতে চান? বর্তমান ড্রাফটটি ক্লিয়ার হবে।')) {
      setPatientName('');
      setPatientPhone('');
      setPatientAge('');
      setPatientSerial('');
      setPatientWeight('');
      setBp('');
      setPulse('');
      setTemperature('');
      setBloodSugar('');
      setChiefComplaints([]);
      setClinicalFindings('');
      setDiagnosis('');
      setInvestigations([]);
      setAdviceList([]);
      setAppointmentId('');
      setMedicines([
        {
          id: `med-${Date.now()}`,
          brandName: '',
          genericName: '',
          form: 'Tab.',
          strength: '',
          dosage: '১+০+১',
          duration: '৭ দিন',
          instruction: 'খাবারের পর'
        }
      ]);
    }
  };

  const venueName = doctor?.hospital?.name || doctor?.chamberAddress || doctor?.schedules?.[0]?.chamberName || 'মূল চেম্বার';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-sky-100 selection:text-sky-900 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. ULTRA-MINIMAL TOP CLINICAL HEADER                                      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
        
        {/* Left: Back & Doctor Summary */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-sm text-slate-950">{doctor?.name || 'ডাক্তার'}</span>
                <OfficialVerifiedBadge className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 font-mono hidden sm:inline">
                  {doctor?.bmdcNumber ? `[BMDC: ${doctor.bmdcNumber}]` : ''}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                {venueName} {doctor?.chamberRoom ? `• ${doctor.chamberRoom}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Master Control Actions */}
        <div className="flex items-center gap-2">
          
          {/* Patient History Badge */}
          {patientPhone && (
            <button
              onClick={() => {
                fetchPatientHistory(patientPhone);
                setHistoryDrawerOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition border border-indigo-200/80 cursor-pointer"
              title="এই রোগীর পূর্বের প্রেসক্রিপশন"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden md:inline">পূর্বের হিস্ট্রি</span>
            </button>
          )}

          {/* Assistant Desk Link */}
          {doctorId && (
            <Link
              href={`/doctor/assistant?doctorId=${doctorId}`}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition hidden sm:flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>সহকারী ডেস্ক</span>
            </Link>
          )}

          {/* Clear Form */}
          <button
            onClick={handleResetForm}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
            title="নতুন প্রেসক্রিপশন শুরু করুন (রিসেট)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Save & Print Button */}
          <button
            onClick={handleSaveAndPrint}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-xs active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'প্রিন্ট ও সেভ (A4)'}</span>
          </button>

        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CLINICAL WORKSPACE                                                */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-3.5">
        
        {/* ========================================================================= */}
        {/* 🌟 1-CLICK DISEASE TEMPLATES (Sleek Minimal Pill Bar)                     */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1 text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>টেমপ্লেট:</span>
          </div>

          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleApplyTemplate(tpl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border flex items-center gap-1 ${
                selectedTemplateId === tpl.id
                  ? 'bg-sky-900 text-white border-sky-900 shadow-xs'
                  : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border-slate-200/90 shadow-2xs'
              }`}
            >
              <span>{tpl.title.split('(')[0].trim()}</span>
            </button>
          ))}

          <button
            onClick={() => setSaveTemplateModalOpen(true)}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-sky-700 hover:bg-sky-50 transition border border-dashed border-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
          >
            + টেমপ্লেট সেভ
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 👤 COMPACT PATIENT & VITALS BAR (Clean Minimal Single Card)              */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            
            {/* Serial / Code Badge (if linked) */}
            {patientSerial && (
              <div className="sm:col-span-1 flex items-center justify-center">
                <span className="w-full py-1.5 rounded-xl bg-sky-50 text-sky-800 font-black text-xs text-center border border-sky-200">
                  #{toBanglaDigits(patientSerial)}
                </span>
              </div>
            )}

            {/* Patient Name */}
            <div className={patientSerial ? 'sm:col-span-4' : 'sm:col-span-5'}>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="রোগীর নাম *"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 transition"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="sm:col-span-3">
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="মোবাইল নম্বর *"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  onBlur={() => fetchPatientHistory(patientPhone)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 transition"
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="sm:col-span-2">
              <input
                type="number"
                placeholder="বয়স (যেমন: 35)"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-1">
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="MALE">পুরুষ</option>
                <option value="FEMALE">মহিলা</option>
                <option value="OTHER">অন্যান্য</option>
              </select>
            </div>

            {/* Toggle Vitals Button */}
            <div className="sm:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVitals(!showVitals)}
                className={`p-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer w-full ${
                  showVitals || bp || patientWeight
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="রক্তচাপ, ওজন, পালস ইত্যাদি ভাইটালস"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden lg:inline">{showVitals ? 'লুকান' : 'ভাইটালস'}</span>
              </button>
            </div>

          </div>

          {/* Inline Minimal Vitals Row (Expandable) */}
          {(showVitals || bp || patientWeight) && (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400">BP:</span>
                <input
                  type="text"
                  placeholder="120/80"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-rose-700 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400">ওজন:</span>
                <input
                  type="text"
                  placeholder="65 kg"
                  value={patientWeight}
                  onChange={(e) => setPatientWeight(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400">পালস:</span>
                <input
                  type="text"
                  placeholder="76 bpm"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400">জ্বর:</span>
                <input
                  type="text"
                  placeholder="98.4 °F"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400">RBS:</span>
                <input
                  type="text"
                  placeholder="6.5 mmol/L"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 📋 2-COLUMN CLINICAL DESK                                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: Clinical Examination & Investigations (3.5 / 12)          */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* 1. Chief Complaints (C/C) */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Chief Complaints (C/C)
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">{chiefComplaints.length}টি যুক্ত</span>
              </div>

              {/* Selected Complaint Chips */}
              <div className="flex flex-wrap gap-1">
                {chiefComplaints.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 text-sky-900 text-xs font-bold border border-sky-200/70"
                  >
                    <span>{c}</span>
                    <button
                      onClick={() => handleRemoveComplaint(idx)}
                      className="text-sky-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="+ লক্ষণ বা সমস্যা..."
                  value={customComplaint}
                  onChange={(e) => setCustomComplaint(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddComplaint(customComplaint);
                    }
                  }}
                  className="flex-1 px-2.5 py-1 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddComplaint(customComplaint)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Fast Chips */}
              <div className="pt-1 flex flex-wrap gap-1">
                {SYMPTOM_PRESETS.slice(0, 6).map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddComplaint(chip)}
                    className="text-[10.5px] px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-900 transition cursor-pointer"
                  >
                    +{chip}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Diagnosis (Dx) */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-1.5">
              <h3 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                Diagnosis (রোগ নির্ণয়)
              </h3>
              <input
                type="text"
                placeholder="যেমন: Acute Gastritis / Viral Fever / Type 2 DM"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-black text-sky-900 bg-sky-50/30 focus:bg-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            {/* 3. On Examination (O/E) */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-1.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                On Examination (O/E)
              </h3>
              <textarea
                rows={2}
                placeholder="Chest clear, Throat congested, Soft abdomen..."
                value={clinicalFindings}
                onChange={(e) => setClinicalFindings(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            {/* 4. Investigations Advised */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                  <span>ল্যাব টেস্ট (Investigations)</span>
                </h3>
              </div>

              {/* Selected Tests */}
              <div className="space-y-1">
                {investigations.map((test, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200/80"
                  >
                    <span>{test}</span>
                    <button
                      onClick={() => handleRemoveInvestigation(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Test Input */}
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="+ নতুন টেস্টের নাম..."
                  value={customTest}
                  onChange={(e) => setCustomTest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInvestigation(customTest);
                    }
                  }}
                  className="flex-1 px-2.5 py-1 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddInvestigation(customTest)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Fast Test Chips */}
              <div className="pt-1 flex flex-wrap gap-1">
                {COMMON_LAB_INVESTIGATIONS.slice(0, 5).map((test, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddInvestigation(test.split('(')[0].trim())}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-900 transition cursor-pointer"
                  >
                    +{test.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: ℞ Medicine Station & Advice (8.5 / 12)                    */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-3.5">
            
            {/* ℞ Medicine Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic font-black text-2xl text-sky-900">
                    ℞
                  </span>
                  <span className="text-xs font-black text-slate-900">ঔষধ সেবনের নিয়মাবলী (Prescription Medicines)</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-black text-xs transition border border-sky-200/80 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ ঔষধ যোগ করুন</span>
                </button>
              </div>

              {/* Medicines Rows */}
              <div className="space-y-2.5">
                {medicines.map((med, index) => (
                  <div
                    key={med.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-2 transition hover:border-sky-300 relative group"
                  >
                    
                    {/* Row 1: Form + Brand Search + Strength + Delete */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      
                      {/* Row Counter + Form */}
                      <div className="sm:col-span-2 flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 w-4 text-center">
                          {index + 1}.
                        </span>
                        <select
                          value={med.form}
                          onChange={(e) => handleUpdateMedicine(index, 'form', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-800 bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          {FORM_TYPES.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      {/* Brand Name Input + Dropdown */}
                      <div className="sm:col-span-6 relative">
                        <input
                          type="text"
                          placeholder="ঔষধের নাম (যেমন: Napa, Seclo, Monas)..."
                          value={activeSearchIndex === index ? searchQuery : med.brandName}
                          onFocus={() => {
                            setActiveSearchIndex(index);
                            setSearchQuery(med.brandName);
                          }}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleUpdateMedicine(index, 'brandName', e.target.value);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 bg-white focus:outline-none focus:border-sky-500"
                        />

                        {/* Instant Dropdown Search Results */}
                        {activeSearchIndex === index && searchQuery.trim().length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
                            {searchResults.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectMedicineResult(index, item)}
                                className="w-full p-2 text-left hover:bg-sky-50 transition cursor-pointer flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-black text-xs text-slate-900 block">
                                    {item.form} {item.brandName} {item.strength ? `(${item.strength})` : ''}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {item.genericName} • <span className="text-slate-400">{item.manufacturer.split(' ')[0]}</span>
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                                  সিলেক্ট
                                </span>
                              </button>
                            ))}

                            {/* Option to accept typed custom medicine name directly */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSearchIndex(null);
                              }}
                              className="w-full p-2.5 text-left bg-slate-50 hover:bg-sky-50 transition cursor-pointer text-xs font-bold text-sky-800 flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5 text-sky-600" />
                              <span>&quot;{searchQuery}&quot; নতুন ঔষধ হিসেবে লিখুন</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Strength */}
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="শক্তি (500mg)"
                          value={med.strength}
                          onChange={(e) => handleUpdateMedicine(index, 'strength', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* Delete */}
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(med.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="বাদ দিন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Generic subtitle if populated */}
                    {med.genericName && (
                      <p className="text-[10.5px] text-slate-400 italic pl-6 font-medium">
                        জেনেরিক: {med.genericName}
                      </p>
                    )}

                    {/* Row 2: Dosage + Duration + Instruction Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-0.5">
                      
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="ডোজ (১+০+১)"
                          value={med.dosage}
                          onChange={(e) => handleUpdateMedicine(index, 'dosage', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-mono font-black text-slate-900 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="মেয়াদকাল (৭ দিন)"
                          value={med.duration}
                          onChange={(e) => handleUpdateMedicine(index, 'duration', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="খাওয়ার নিয়ম (খাবারের পর)"
                          value={med.instruction}
                          onChange={(e) => handleUpdateMedicine(index, 'instruction', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                        />
                      </div>

                    </div>

                    {/* Row 3: Fast Quick Pills */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] pt-1">
                      {DOSAGE_PRESETS.slice(0, 5).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleUpdateMedicine(index, 'dosage', d)}
                          className={`px-1.5 py-0.5 rounded font-mono transition cursor-pointer ${
                            med.dosage === d
                              ? 'bg-sky-600 text-white font-bold'
                              : 'bg-white hover:bg-sky-50 text-slate-600 border border-slate-200/80'
                          }`}
                        >
                          {d}
                        </button>
                      ))}

                      <span className="text-slate-300">|</span>

                      {DURATION_PRESETS.slice(0, 4).map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => handleUpdateMedicine(index, 'duration', dur)}
                          className={`px-1.5 py-0.5 rounded font-semibold transition cursor-pointer ${
                            med.duration === dur
                              ? 'bg-teal-600 text-white font-bold'
                              : 'bg-white hover:bg-teal-50 text-slate-600 border border-slate-200/80'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}

                      <span className="text-slate-300">|</span>

                      {INSTRUCTION_PRESETS.slice(0, 3).map((ins) => (
                        <button
                          key={ins}
                          type="button"
                          onClick={() => handleUpdateMedicine(index, 'instruction', ins)}
                          className={`px-1.5 py-0.5 rounded font-medium transition cursor-pointer ${
                            med.instruction === ins
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200/80'
                          }`}
                        >
                          {ins}
                        </button>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              {/* Add New Row Action */}
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="w-full py-2 rounded-2xl border border-dashed border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-600 hover:text-sky-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আরেকটি ঔষধ যোগ করুন</span>
              </button>

            </div>

            {/* Advice & Follow-up Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
              
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                পরামর্শ ও পরবর্তী সাক্ষাৎ (Advice & Follow-up)
              </h3>

              {/* Advice Tags */}
              <div className="space-y-1">
                {adviceList.map((adv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-slate-50 text-slate-800 text-xs font-medium border border-slate-200/80"
                  >
                    <span>• {adv}</span>
                    <button
                      onClick={() => handleRemoveAdvice(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Advice */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="+ বিশেষ পরামর্শ লিখুন..."
                  value={customAdvice}
                  onChange={(e) => setCustomAdvice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAdvice(customAdvice);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddAdvice(customAdvice)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  যোগ
                </button>
              </div>

              {/* Fast Advice Chips */}
              <div className="flex flex-wrap gap-1">
                {COMMON_ADVICE_CHIPS.slice(0, 6).map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddAdvice(chip)}
                    className="text-[10.5px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-900 border border-slate-200/70 transition cursor-pointer"
                  >
                    +{chip.split(' ')[0]} {chip.split(' ')[1] || ''}
                  </button>
                ))}
              </div>

              {/* Follow-up Selector */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-600">পরবর্তী সাক্ষাত:</span>
                {['৩ দিন', '৭ দিন', '১৫ দিন', '১ মাস', 'প্রয়োজনে'].map((visit) => (
                  <button
                    key={visit}
                    type="button"
                    onClick={() => setNextVisit(visit)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      nextVisit === visit
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {visit}
                  </button>
                ))}
              </div>

            </div>

            {/* Master Bottom Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSaveTemplateModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>টেমপ্লেট সংরক্ষণ</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition cursor-pointer"
                >
                  রিসেট
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndPrint}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-xs active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'প্রিন্ট ও সংরক্ষণ (A4) ➔'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 📜 PATIENT HISTORY SIDEBAR DRAWER                                         */}
      {/* ========================================================================= */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-5 space-y-4 overflow-y-auto animate-in slide-in-from-right duration-200">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">পূর্বের প্রেসক্রিপশন হিস্ট্রি</h3>
              </div>
              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              রোগী: <span className="font-bold text-slate-900">{patientName || 'নামবিহীন'}</span> • <span className="font-mono font-bold">{patientPhone}</span>
            </div>

            {historyLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">ইতিহাস লোড হচ্ছে...</div>
            ) : patientHistory.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">এই নম্বরে কোনো প্রেসক্রিপশন পাওয়া যায়নি।</div>
            ) : (
              <div className="space-y-2.5">
                {patientHistory.map((rx) => {
                  let medList: any[] = [];
                  try {
                    medList = typeof rx.medicinesJson === 'string' ? JSON.parse(rx.medicinesJson) : rx.medicinesJson || [];
                  } catch {}

                  return (
                    <div key={rx.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sky-800 text-[11px]">#{rx.prescriptionCode}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(rx.createdAt).toLocaleDateString('bn-BD')}</span>
                      </div>

                      {rx.diagnosis && (
                        <p className="font-bold text-slate-800">রোগ: {rx.diagnosis}</p>
                      )}

                      <div className="space-y-0.5 text-[11px] text-slate-600">
                        {medList.map((m: any, i: number) => (
                          <div key={i}>• {m.form || ''} {m.brandName} ({m.dosage || ''})</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💾 SAVE TEMPLATE MODAL                                                    */}
      {/* ========================================================================= */}
      {saveTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Save className="w-4 h-4 text-sky-600" />
              <span>টেমপ্লেট হিসেবে সংরক্ষণ</span>
            </h3>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              বর্তমান প্রেসক্রিপশনের ওষুধ ও লক্ষণগুলো ভবিষ্যতে ১-ক্লিকে ব্যবহারের জন্য টেমপ্লেট হিসেবে সেভ রাখুন।
            </p>

            <form onSubmit={handleSaveCustomTemplate} className="space-y-3">
              <input
                type="text"
                placeholder="টেমপ্লেটের নাম (যেমন: টাইফয়েড প্রোটোকল)"
                value={newTemplateTitle}
                onChange={(e) => setNewTemplateTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500"
                required
                autoFocus
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSaveTemplateModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  সেভ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖨️ A4 CLINICAL PRESCRIPTION PRINT MODAL                                    */}
      {/* ========================================================================= */}
      {printModalOpen && savedPrescriptionData && (
        <PrescriptionPrintModal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          doctor={doctor}
          prescription={savedPrescriptionData}
        />
      )}

    </div>
  );
}

export default function DoctorPrescriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DoctorPrescriptionContent />
    </Suspense>
  );
}
