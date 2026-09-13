'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Pill, 
  Stethoscope, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldCheck,
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ExtractedMedicine {
  name: string;
  dosage: string;
  timing: string;
  durationDays: number;
  scheduledTimes: string[];
}

interface ScanResultData {
  patientName: string;
  doctorName?: string;
  hospitalName?: string;
  diagnosis?: string;
  consultationDate?: string;
  medicines: ExtractedMedicine[];
  notes?: string;
}

export default function PrescriptionScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ScanResultData | null>(null);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleImageFile = (file: File) => {
    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      runScan(base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const runScan = async (imageBase64: string, mimeType: string) => {
    setIsScanning(true);
    setScanStep('প্রেসক্রিপশনের ছবি প্রক্রিয়াকরণ হচ্ছে...');

    try {
      setTimeout(() => {
        setScanStep('হাতের লেখা ও ঔষধের তালিকা রিড করা হচ্ছে...');
      }, 1000);

      setTimeout(() => {
        setScanStep('ঔষধের সময়সূচি সাজানো হচ্ছে...');
      }, 2200);

      const res = await fetch('/api/prescription/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          mimeType,
          saveToVault: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setExtractedData(data.data);
      } else {
        alert(data.error || 'প্রেসক্রিপশন স্ক্যান করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error('Scan failed:', err);
      alert('সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpdateMedicine = (index: number, field: keyof ExtractedMedicine, value: any) => {
    if (!extractedData) return;
    const updated = [...extractedData.medicines];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedData({ ...extractedData, medicines: updated });
  };

  const handleRemoveMedicine = (index: number) => {
    if (!extractedData) return;
    const updated = extractedData.medicines.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, medicines: updated });
  };

  const handleAddBlankMedicine = () => {
    if (!extractedData) return;
    const newMed: ExtractedMedicine = {
      name: '',
      dosage: '১+০+১',
      timing: 'AFTER_MEAL',
      durationDays: 7,
      scheduledTimes: ['08:30', '20:30'],
    };
    setExtractedData({ ...extractedData, medicines: [...extractedData.medicines, newMed] });
  };

  const handleSaveAndSchedule = async () => {
    if (!extractedData) return;
    setSavingSchedule(true);

    try {
      for (const med of extractedData.medicines) {
        if (!med.name.trim()) continue;
        await fetch('/api/patient/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            medicineName: med.name,
            dosage: med.dosage,
            timing: med.timing,
            scheduledTimes: med.scheduledTimes,
            durationDays: med.durationDays,
          }),
        });
      }

      setSuccessSaved(true);
      setTimeout(() => {
        router.push('/patient/med-schedule');
      }, 1200);
    } catch (err) {
      console.error('Save failed:', err);
      alert('রুটিন সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setSavingSchedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <Link
            href="/patient/med-schedule"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মেডিসিন রুটিনে ফিরুন</span>
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              প্রেসক্রিপশন স্ক্যানার
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
              প্রেসক্রিপশনের ছবি দিলে স্বয়ংক্রিয়ভাবে ঔষধের তালিকা ও দৈনিক রুটিন প্রস্তুত হয়ে যাবে।
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: UPLOAD / CAMERA VIEWPORT */}
        {/* ========================================================================= */}
        {!extractedData && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
            />

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
            />

            {!selectedImage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Camera Option */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 shadow-sm cursor-pointer active:scale-98"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-black">ক্যামেরা দিয়ে ছবি তুলুন</h3>
                      <p className="text-xs text-sky-100 font-medium pt-0.5">সরাসরি ছবি তুলে স্ক্যান করতে ট্যাপ করুন</p>
                    </div>
                  </button>

                  {/* Gallery Option */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-black text-slate-900">গ্যালারি থেকে নির্বাচন</h3>
                      <p className="text-xs text-slate-500 font-medium pt-0.5">JPEG বা PNG ফরম্যাটের ছবি দিন</p>
                    </div>
                  </button>

                </div>

                {/* Helpful Tip */}
                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <span className="text-sky-600 font-black text-sm shrink-0">💡</span>
                  <span>সঠিক ফলাফলের জন্য প্রেসক্রিপশনের লেখাগুলো যেন পরিষ্কারভাবে ছবিতে দেখা যায়।</span>
                </div>
              </div>
            ) : (
              /* Scanning In-Progress View */
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="relative w-48 h-64 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                  <img
                    src={selectedImage}
                    alt="Prescription Scan"
                    className="w-full h-full object-cover opacity-80"
                  />
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-sky-500 shadow-[0_0_12px_#0ea5e9] animate-pulse top-1/2" />
                  )}
                </div>

                {isScanning && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-sky-700 font-black text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{scanStep}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Privacy Guarantee Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>আপনার প্রেসক্রিপশন ও তথ্য সুরক্ষিত থাকবে।</span>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: EXTRACTED MEDICINES REVIEW & EDIT */}
        {/* ========================================================================= */}
        {extractedData && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  শনাক্তকৃত ঔষধের তালিকা
                </h2>
                <p className="text-xs text-slate-500 font-medium pt-0.5">
                  তথ্যগুলো মিলিয়ে নিন অথবা প্রয়োজনে সংশোধন করুন
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBlankMedicine}
                className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 border border-sky-200/80 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-sky-600" />
                <span>ঔষধ যোগ করুন</span>
              </button>
            </div>

            {/* Medicine Items List */}
            <div className="space-y-3">
              {extractedData.medicines.map((med, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F8FAFD] border border-slate-200/80 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">ঔষধের নাম:</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleUpdateMedicine(idx, 'name', e.target.value)}
                        placeholder="ঔষধের নাম"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-900 focus:outline-sky-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer mt-5"
                      title="ঔষধ মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Timing and Meal */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">খাওয়ার নিয়ম:</label>
                      <select
                        value={med.timing}
                        onChange={(e) => handleUpdateMedicine(idx, 'timing', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-sky-600"
                      >
                        <option value="AFTER_MEAL">খাবারের পরে</option>
                        <option value="BEFORE_MEAL">খাবারের আগে</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">মেয়াদ (দিন):</label>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={med.durationDays}
                        onChange={(e) => handleUpdateMedicine(idx, 'durationDays', parseInt(e.target.value, 10) || 7)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-sky-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveAndSchedule}
                disabled={savingSchedule || successSaved}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm disabled:opacity-75"
              >
                {savingSchedule ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ করা হচ্ছে...</span>
                  </>
                ) : successSaved ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>সফলভাবে রুটিনে যুক্ত হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>রুটিনে যুক্ত করুন</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
