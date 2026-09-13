'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  QrCode, 
  Plus, 
  Search, 
  Stethoscope, 
  Activity, 
  Camera, 
  Eye, 
  Clock, 
  X, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ShieldCheck,
  Download,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import HealthQrModal from '@/components/HealthQrModal';

interface VaultPrescription {
  id: string;
  patientName: string;
  doctorName?: string;
  hospitalName?: string;
  consultationDate?: string;
  diagnosis?: string;
  imageUrl?: string;
  medicines: { name: string; dosage: string; durationDays?: number }[];
  notes?: string;
  createdAt: string;
}

interface VaultReport {
  id: string;
  patientName: string;
  testName: string;
  diagnosticCenter?: string;
  reportDate: string;
  fileUrl: string;
  category: string;
  notes?: string;
  createdAt: string;
}

interface ViewingDocument {
  title: string;
  subtitle?: string;
  date?: string;
  fileUrl: string;
  notes?: string;
  category?: string;
  type: 'PRESCRIPTION' | 'REPORT';
}

function parseMedicalNotes(notes?: string) {
  if (!notes) return [];
  // Match comma or semicolon without splitting numbers like 280,000
  const rawItems = notes.split(/(?:;|\s*,\s*(?=[A-Za-z\u0980-\u09FF\s]+:))/);
  return rawItems.map((item) => {
    const colonIdx = item.indexOf(':');
    if (colonIdx === -1) {
      return { label: item.trim(), value: 'Normal', refRange: 'স্বাভাবিক সীমা', status: 'স্বাভাবিক' };
    }
    const label = item.substring(0, colonIdx).trim();
    const value = item.substring(colonIdx + 1).trim();
    
    let refRange = 'স্বাভাবিক সীমার মধ্যে';
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('hemo') || lowerLabel.includes('হিমো')) {
      refRange = '13.5 - 17.5 g/dL (Adult Male)';
    } else if (lowerLabel.includes('plate') || lowerLabel.includes('প্লাটি')) {
      refRange = '150,000 - 450,000 /uL';
    } else if (lowerLabel.includes('sugar') || lowerLabel.includes('fbs') || lowerLabel.includes('সুগার')) {
      refRange = '3.9 - 6.1 mmol/L (Fasting)';
    }

    return { label, value, refRange, status: 'স্বাভাবিক' };
  });
}

export default function ProfessionalHealthVaultPage() {
  const [activeTab, setActiveTab] = useState<'PRESCRIPTIONS' | 'REPORTS'>('PRESCRIPTIONS');
  const [prescriptions, setPrescriptions] = useState<VaultPrescription[]>([]);
  const [reports, setReports] = useState<VaultReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  // Upload modal state
  const [isUploadReportModalOpen, setIsUploadReportModalOpen] = useState(false);
  const [isClosingReportModal, setIsClosingReportModal] = useState(false);

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<ViewingDocument | null>(null);
  const [isClosingDocModal, setIsClosingDocModal] = useState(false);

  // New report form state
  const [newReport, setNewReport] = useState({
    testName: '',
    diagnosticCenter: '',
    reportDate: new Date().toISOString().split('T')[0],
    category: 'BLOOD',
    notes: '',
    fileUrl: '',
  });
  const [uploadingReport, setUploadingReport] = useState(false);

  useEffect(() => {
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/patient/vault');
      const data = await res.json();
      if (data.success && data.vault) {
        setPrescriptions(data.vault.prescriptions || []);
        setReports(data.vault.reports || []);
      }
    } catch (err) {
      console.error('Failed to load vault data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReportModal = () => {
    setIsClosingReportModal(false);
    setIsUploadReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsClosingReportModal(true);
    setTimeout(() => {
      setIsUploadReportModalOpen(false);
      setIsClosingReportModal(false);
    }, 240);
  };

  const openDocViewer = (doc: ViewingDocument) => {
    setIsClosingDocModal(false);
    setViewingDoc(doc);
  };

  const closeDocViewer = () => {
    setIsClosingDocModal(true);
    setTimeout(() => {
      setViewingDoc(null);
      setIsClosingDocModal(false);
    }, 240);
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.testName.trim()) return;

    try {
      setUploadingReport(true);
      const res = await fetch('/api/patient/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'REPORT',
          testName: newReport.testName,
          diagnosticCenter: newReport.diagnosticCenter,
          reportDate: newReport.reportDate,
          category: newReport.category,
          notes: newReport.notes,
          fileUrl: newReport.fileUrl || '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        closeReportModal();
        setNewReport({
          testName: '',
          diagnosticCenter: '',
          reportDate: new Date().toISOString().split('T')[0],
          category: 'BLOOD',
          notes: '',
          fileUrl: '',
        });
        fetchVaultData();
      }
    } catch (err) {
      console.error('Report upload failed:', err);
    } finally {
      setUploadingReport(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.doctorName && p.doctorName.toLowerCase().includes(q)) ||
      (p.hospitalName && p.hospitalName.toLowerCase().includes(q)) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(q)) ||
      p.medicines.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const filteredReports = reports.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.testName.toLowerCase().includes(q) ||
      (r.diagnosticCenter && r.diagnosticCenter.toLowerCase().includes(q)) ||
      (r.notes && r.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-6 sm:py-10 px-4 sm:px-6 font-bengali">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* Header & Back Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              মেডিকেল ফাইল লকার
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              আপনার সমস্ত প্রেসক্রিপশন ও টেস্ট রিপোর্ট সংরক্ষিত রাখার কেন্দ্রীয় আর্কাইভ
            </p>
          </div>

          {/* Top Actions: QR Share & Scan */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-800 font-black text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4 text-sky-600" />
              <span>ডাক্তারকে QR দেখান</span>
            </button>

            <Link
              href="/patient/scanner"
              className="bg-sky-600 hover:bg-sky-700 text-white font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>প্রেসক্রিপশন স্ক্যান</span>
            </Link>
          </div>
        </div>

        {/* Tab Switcher & Search Row */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Clean Segmented Control Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('PRESCRIPTIONS')}
                className={`flex-1 sm:flex-none text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'PRESCRIPTIONS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                প্রেসক্রিপশন ({prescriptions.length})
              </button>

              <button
                onClick={() => setActiveTab('REPORTS')}
                className={`flex-1 sm:flex-none text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'REPORTS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ল্যাব রিপোর্ট ({reports.length})
              </button>
            </div>

            {/* Upload Report Button if on Reports Tab */}
            {activeTab === 'REPORTS' && (
              <button
                onClick={openReportModal}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>রিপোর্ট আপলোড</span>
              </button>
            )}

          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'PRESCRIPTIONS' ? 'ডাক্তার বা ঔষধের নাম খুঁজুন...' : 'টেস্ট বা সেন্টারের নাম খুঁজুন...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-sky-600 focus:bg-white transition-colors"
            />
          </div>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRESCRIPTIONS LIST */}
        {/* ========================================================================= */}
        {activeTab === 'PRESCRIPTIONS' && (
          <div className="space-y-3">
            {loading ? (
              <div className="bg-white rounded-3xl p-10 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ফাইল লোড হচ্ছে...</span>
              </div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">কোনো প্রেসক্রিপশন সংরক্ষিত নেই</h3>
                  <p className="text-xs text-slate-400 font-medium pt-0.5">
                    প্রেসক্রিপশনের ছবি তুলে লকারে সংরক্ষণ করুন।
                  </p>
                </div>
                <Link
                  href="/patient/scanner"
                  className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>প্রেসক্রিপশন স্ক্যান করুন</span>
                </Link>
              </div>
            ) : (
              filteredPrescriptions.map((rx) => (
                <div 
                  key={rx.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                          {rx.consultationDate || 'তারিখ অপ্রাপ্য'}
                        </span>
                        {rx.diagnosis && (
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                            {rx.diagnosis}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-slate-900 pt-0.5">
                        {rx.doctorName || 'বিশেষজ্ঞ ডাক্তার'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {rx.hospitalName || 'হাসপাতাল / চেম্বার'}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Medicines Chips */}
                  {rx.medicines && rx.medicines.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rx.medicines.map((m, mIdx) => (
                        <span 
                          key={mIdx}
                          className="text-[11px] font-black text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70"
                        >
                          💊 {m.name} ({m.dosage})
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openDocViewer({
                          title: rx.doctorName || 'প্রেসক্রিপশন',
                          subtitle: rx.hospitalName || 'চেম্বার / হাসপাতাল',
                          date: rx.consultationDate,
                          fileUrl: rx.imageUrl || '',
                          notes: rx.diagnosis ? `রোগীর অবস্থা / ডায়াগনোসিস: ${rx.diagnosis}` : undefined,
                          type: 'PRESCRIPTION'
                        })}
                        className="text-sky-600 hover:text-sky-700 font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>প্রেসক্রিপশন দেখুন</span>
                      </button>

                      <Link
                        href="/patient/med-schedule"
                        className="text-slate-600 hover:text-sky-700 font-bold flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>মেডিসিন রুটিন</span>
                      </Link>
                    </div>

                    <span className="text-slate-400 font-medium text-[11px]">
                      লকারে সংরক্ষিত
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LAB TEST REPORTS */}
        {/* ========================================================================= */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-3">
            {loading ? (
              <div className="bg-white rounded-3xl p-10 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ফাইল লোড হচ্ছে...</span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-3">
                <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">কোনো টেস্ট রিপোর্ট সংরক্ষিত নেই</h3>
                  <p className="text-xs text-slate-400 font-medium pt-0.5">
                    রক্তের পরীক্ষা বা এক্স-রে রিপোর্ট আপলোড করে নিরাপদে রাখুন।
                  </p>
                </div>
                <button
                  onClick={openReportModal}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>রিপোর্ট আপলোড করুন</span>
                </button>
              </div>
            ) : (
              filteredReports.map((rep) => (
                <div 
                  key={rep.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {rep.category || 'TEST REPORT'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {rep.reportDate}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 pt-0.5">
                        {rep.testName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {rep.diagnosticCenter || 'ডায়াগনস্টিক সেন্টার'}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  {rep.notes && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 font-medium">
                      {rep.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => openDocViewer({
                        title: rep.testName,
                        subtitle: rep.diagnosticCenter || 'ডায়াগনস্টিক সেন্টার',
                        date: rep.reportDate,
                        fileUrl: rep.fileUrl,
                        notes: rep.notes,
                        category: rep.category,
                        type: 'REPORT'
                      })}
                      className="text-sky-600 hover:text-sky-700 font-black flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>রিপোর্ট ফাইল দেখুন</span>
                    </button>

                    <span className="text-slate-400 font-medium text-[11px]">
                      লকারে সংরক্ষিত
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* 🌟 1. HEALTH QR MODAL */}
      <HealthQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* 🌟 2. IN-APP HIGH-RESOLUTION DOCUMENT VIEWER & OFFICIAL PRINT SHEET */}
      {viewingDoc && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs font-bengali ${
            isClosingDocModal ? 'animate-modal-backdrop-exit' : 'animate-modal-backdrop'
          }`}
          onClick={closeDocViewer}
        >
          <div 
            className={`relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] print-sheet-root ${
              isClosingDocModal ? 'animate-modal-spring-exit' : 'animate-modal-spring'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Hidden on Print) */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70 print-hide">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {viewingDoc.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium pt-0.5">
                  {viewingDoc.subtitle} {viewingDoc.date && `• ${viewingDoc.date}`}
                </p>
              </div>

              <button 
                type="button"
                onClick={closeDocViewer}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content & Official Print Letterhead */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)] print:p-0 print:overflow-visible print:max-h-none">
              
              {/* 🏥 1. ORIGINAL SCANNED DOCUMENT / REPORT IMAGE */}
              {viewingDoc.fileUrl ? (
                <div className="space-y-4">
                  <div className="w-full bg-slate-900/5 rounded-2xl overflow-hidden border border-slate-300 p-2 flex items-center justify-center min-h-[260px] max-h-[520px]">
                    <img
                      src={viewingDoc.fileUrl}
                      alt={viewingDoc.title}
                      className="w-full h-full max-h-[500px] object-contain rounded-lg"
                    />
                  </div>

                  {/* Key Metadata and Notes Bar below the Image */}
                  <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">ডকুমেন্টের নাম</span>
                        <span className="font-black text-slate-900 text-sm">{viewingDoc.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">তারিখ</span>
                        <span className="font-bold text-slate-800">{viewingDoc.date || '২০২৬-০৮-২৪'}</span>
                      </div>
                    </div>

                    {viewingDoc.subtitle && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">ডায়াগনস্টিক / চেম্বার:</span>
                        <span className="font-bold text-slate-900">{viewingDoc.subtitle}</span>
                      </div>
                    )}

                    {viewingDoc.notes && (
                      <div className="pt-1">
                        <span className="text-slate-500 font-medium block">ফলাফল / বিবরণ:</span>
                        <p className="font-bold text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                          {viewingDoc.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Fallback if no image was attached */
                <div className="border border-slate-300 rounded-xl p-6 text-center space-y-3 bg-slate-50">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <div>
                    <h4 className="font-black text-slate-900">{viewingDoc.title}</h4>
                    <p className="text-xs text-slate-500">{viewingDoc.subtitle} • {viewingDoc.date}</p>
                  </div>
                  {viewingDoc.notes && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 text-left">
                      {viewingDoc.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons (Hidden on Print) */}
              <div className="w-full grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 print-hide">
                <button
                  type="button"
                  onClick={closeDocViewer}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3 rounded-2xl transition-all cursor-pointer text-center"
                >
                  বন্ধ করুন
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-2xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / সেভ PDF</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🌟 3. UPLOAD REPORT MODAL */}
      {isUploadReportModalOpen && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 font-bengali ${
            isClosingReportModal ? 'animate-modal-backdrop-exit' : 'animate-modal-backdrop'
          }`}
          onClick={closeReportModal}
        >
          <div 
            className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${
              isClosingReportModal ? 'animate-modal-spring-exit' : 'animate-modal-spring'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 bg-slate-50/80 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">ল্যাব টেস্ট রিপোর্ট আপলোড</h3>
                <p className="text-xs text-slate-400 font-medium">মেডিকেল লকারে নিরাপদ সংরক্ষণ</p>
              </div>
              <button 
                onClick={closeReportModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 block">টেস্টের নাম: *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newReport.testName}
                  onChange={(e) => setNewReport({ ...newReport, testName: e.target.value })}
                  placeholder="যেমন: রক্তের পরীক্ষা (CBC), সুগার টেস্ট (FBS), X-Ray"
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-black text-slate-900 focus:outline-sky-600 transition-all"
                />
              </div>

              {/* 📸 File / Photo Upload Dropzone */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 block">রিপোর্টের ছবি বা স্ক্যান কপি:</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 rounded-2xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1">
                    <Camera className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {newReport.fileUrl ? 'ছবি সিলেক্ট করা হয়েছে ✓' : 'ক্যামেরা বা ফাইল থেকে ছবি দিন'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setNewReport({ ...newReport, fileUrl: ev.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 block">ডায়াগনস্টিক সেন্টার:</label>
                <input
                  type="text"
                  value={newReport.diagnosticCenter}
                  onChange={(e) => setNewReport({ ...newReport, diagnosticCenter: e.target.value })}
                  placeholder="যেমন: পপুলার ডায়াগনস্টিক, চুয়াডাঙ্গা"
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-sky-600 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 block">টেস্টের রেজাল্ট বা নোট:</label>
                <input
                  type="text"
                  value={newReport.notes}
                  onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                  placeholder="যেমন: Hemoglobin: 14.2 g/dL, Platelet: 280,000 /uL"
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-sky-600 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploadingReport}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-3.5 rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-75"
                >
                  {uploadingReport ? 'সংরক্ষণ হচ্ছে...' : 'লকারে সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
