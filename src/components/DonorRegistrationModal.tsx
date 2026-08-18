'use client';

import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentUser?: { name: string; email: string; phone?: string } | null;
}

export default function DonorRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}: DonorRegistrationModalProps) {
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bloodGroup: 'O+',
    age: '',
    gender: 'Male',
    address: '',
    area: 'Chuadanga Sadar',
    availability: 'available',
    lastDonationDate: '',
    note: '',
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isUnauthenticated, setIsUnauthenticated] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  React.useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Front-end validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanedPhone = formData.phone.trim();
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanedPhone)) {
      setErrorMessage('Please enter a valid 11-digit Bangladesh mobile number (e.g. 01712345678).');
      return;
    }

    const numAge = Number(formData.age);
    if (isNaN(numAge) || numAge < 18 || numAge > 65) {
      setErrorMessage('Age must be between 18 and 65 years.');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Please enter your address or landmark.');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('You must agree to the privacy consent to register.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/blood/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setIsUnauthenticated(true);
        }
        throw new Error(data.error || 'Failed to submit registration');
      }

      setSubmittedSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={handleClose}
      className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col transform ${
          isClosing ? 'animate-modal-spring-out' : 'animate-modal-spring-in'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-nuvicaNavy-950 via-nuvicaNavy-900 to-rose-950 text-white p-6 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 active:scale-90 transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Register as a Blood Donor
              </h2>
              <p className="text-xs text-rose-200 font-medium">
                Join the CD Doctors donor network in Chuadanga and help save lives.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {submittedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-nuvicaNavy-900">
                  Thank you for registering as a blood donor!
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Your information has been submitted for review. Once approved by our team, your donor profile will appear in the CD Doctors Blood Donor Directory.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="btn-nuvica-primary text-xs !py-3 !px-8 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  {isUnauthenticated && (
                    <div className="pt-1">
                      <a
                        href="/login?redirect=/blood"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition-all"
                      >
                        Login / Register Account First
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Md. Rahat Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Blood Group */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Blood Group <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-rose-700 bg-rose-50/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Area / Upazila */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Area / Upazila <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  >
                    <option value="Chuadanga Sadar">Chuadanga Sadar</option>
                    <option value="Alamdanga">Alamdanga</option>
                    <option value="Damurhuda">Damurhuda</option>
                    <option value="Jibannagar">Jibannagar</option>
                  </select>
                </div>

                {/* Initial Availability */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="available">Available Now</option>
                    <option value="unavailable">Currently Unavailable</option>
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Address / Neighborhood <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Station Para / Hospital Road"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>


              </div>

              {/* Consent & Privacy Box */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 shrink-0"
                    required
                  />
                  <label htmlFor="consent" className="text-xs text-slate-700 font-medium leading-tight">
                    I agree that my submitted information may be displayed on the CD Doctors Blood Donor Directory so that people in need can contact me for blood donation. <span className="text-rose-500 font-bold">*</span>
                  </label>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold pt-1 border-t border-sky-200/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Privacy Protection: Only your name, blood group, age, general area, and phone number are publicly listed.</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-nuvica-primary !bg-rose-600 hover:!bg-rose-700 text-xs !py-3.5 !px-6 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>Submit Registration</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
