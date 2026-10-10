'use client';

import React from 'react';
import { User, Stethoscope, Building2 } from 'lucide-react';

export type AuthRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL';

interface AuthRoleSwitcherProps {
  currentRole: AuthRole;
  onRoleChange: (role: AuthRole) => void;
}

export default function AuthRoleSwitcher({ currentRole, onRoleChange }: AuthRoleSwitcherProps) {
  const roles: { id: AuthRole; label: string; icon: any }[] = [
    {
      id: 'PATIENT',
      label: 'সাধারণ রোগী',
      icon: User,
    },
    {
      id: 'DOCTOR',
      label: 'ডাক্তার',
      icon: Stethoscope,
    },
    {
      id: 'HOSPITAL',
      label: 'হাসপাতাল',
      icon: Building2,
    },
  ];

  // Precise 3-step sliding transform
  const pillTranslate = 
    currentRole === 'PATIENT' 
      ? 'translate-x-0' 
      : currentRole === 'DOCTOR' 
        ? 'translate-x-[100%]' 
        : 'translate-x-[200%]';

  return (
    <div className="relative p-1 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-inner flex select-none font-bengali overflow-hidden">
      {/* 🌟 Hardware-Accelerated Sliding Pill Indicator */}
      <div
        className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-xl bg-white shadow-md shadow-slate-300/30 border border-slate-100/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none will-change-transform ${pillTranslate}`}
      />

      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = currentRole === r.id;

        return (
          <button
            key={r.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRoleChange(r.id);
            }}
            className={`relative z-10 flex-1 py-2 sm:py-2.5 px-1.5 rounded-xl font-black text-xs transition-colors duration-200 flex items-center justify-center gap-1.5 text-center cursor-pointer active:scale-98 select-none ${
              isActive
                ? 'text-sky-700 font-black'
                : 'text-slate-500 hover:text-nuvicaNavy-900 font-bold'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 pointer-events-none ${
                isActive ? 'text-sky-600 scale-105' : 'text-slate-400'
              }`}
            />
            <span className="truncate pointer-events-none">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
