import React from 'react';
import Link from 'next/link';
import { Stethoscope, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-nuvicaNavy-950 text-slate-400 text-xs border-t border-nuvicaNavy-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CD Doctors Logo"
                width="40"
                height="40"
                style={{ width: '40px', height: '40px' }}
                className="w-10 h-10 rounded-full object-cover shadow-xs shrink-0"
              />
              <span className="font-black text-xl text-white tracking-tight">
                CD <span className="text-sky-400">Doctors</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed font-medium">
              A healthcare discovery platform for Chuadanga, Bangladesh.
            </p>
          </div>

          {/* Col 2: Directory Links */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">Chuadanga Healthcare</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/hospitals" className="hover:text-sky-400 transition-colors">Hospitals in Chuadanga</Link></li>
              <li><Link href="/doctors" className="hover:text-sky-400 transition-colors">Specialist Doctors</Link></li>
              <li><Link href="/blood" className="hover:text-sky-400 transition-colors">Blood Donor Directory</Link></li>
              <li><Link href="/emergency" className="hover:text-sky-400 transition-colors">24/7 Emergency Ambulance</Link></li>
              <li><Link href="/about" className="hover:text-sky-400 transition-colors">About CD Doctors</Link></li>
            </ul>
          </div>

          {/* Col 3: Platform Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">Chuadanga Support</h4>
            <div className="space-y-2 text-slate-400 font-medium">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /> Chuadanga, Bangladesh</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-sky-400" /> +880 761-62588</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-400" /> support@cddoctors.com</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-nuvicaNavy-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold text-slate-400 text-xs">
          <p>© 2026 CD Doctors. Serving Chuadanga, Bangladesh.</p>
          <p className="flex items-center gap-1.5">
            Designed & Developed by <span className="font-extrabold text-sky-400">Mukset Al Kanon</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
