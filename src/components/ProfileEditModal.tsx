'use client';

import React, { useState } from 'react';
import { User, X, Check, Loader2, Mail, Phone, Shield, LogOut } from 'lucide-react';

interface ProfileEditModalProps {
  user: {
    name: string;
    email: string;
    phone?: string | null;
    role: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedData: { name: string; email: string; phone?: string }) => void;
  onLogout: () => void;
}

export default function ProfileEditModal({
  user,
  isOpen,
  onClose,
  onProfileUpdated,
  onLogout,
}: ProfileEditModalProps) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleSmoothClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      onProfileUpdated({ name, email, phone });
      setTimeout(() => {
        setSuccess(false);
        handleSmoothClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md ${
        isClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'
      }`}
      onClick={handleSmoothClose}
    >
      <div 
        className={`bg-white border border-slate-200/90 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden ${
          isClosing ? 'animate-modal-exit' : 'animate-modal-pop'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-sky-600 text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Edit Your Profile</h2>
              <p className="text-sky-100 text-xs font-medium">Update account details & contact information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSmoothClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-sky-600" /> Profile updated successfully!
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-600" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600" /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801700000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* User Role Badge */}
          <div className="pt-1 flex items-center justify-between bg-sky-50/60 p-3 rounded-2xl border border-sky-100/80">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-600" /> Account Role:
            </span>
            <span className="text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 px-2.5 py-1 rounded-md">
              {user.role || 'USER'}
            </span>
          </div>

          {/* Action Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200/80 hover:border-rose-500 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] hover:shadow-md hover:shadow-rose-500/20 active:scale-[0.95] cursor-pointer select-none"
            >
              <LogOut className="w-4 h-4 text-rose-500 group-hover:text-white transition-transform duration-300 ease-out group-hover:-translate-x-0.5 group-hover:scale-110 shrink-0" />
              <span className="whitespace-nowrap">Log Out</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:via-sky-600 hover:to-sky-800 text-white text-xs font-black whitespace-nowrap shadow-md shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] active:scale-[0.95] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer select-none overflow-hidden"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-sky-200 group-hover:text-white transition-transform duration-300 group-hover:scale-125 shrink-0" />
              )}
              <span className="tracking-wide whitespace-nowrap">{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
