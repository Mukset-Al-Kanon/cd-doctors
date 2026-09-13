'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Stethoscope, 
  Search, 
  User, 
  Menu, 
  X, 
  MapPin, 
  Globe, 
  LogIn, 
  LayoutDashboard,
  LogOut,
  Edit3,
  Droplet,
  ChevronRight,
  Building2,
  Siren,
  PhoneCall,
  Home,
  Info,
  UserPlus,
  ScanLine,
  Sparkles,
  Pill,
  ShieldCheck,
  Bell,
  ChevronLeft,
  MoreVertical,
  Activity,
  Video
} from 'lucide-react';
import ProfileEditModal from './ProfileEditModal';
import NotificationModal from './NotificationModal';
import { getDistrictWithDivision } from './CustomLocationSelector';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    district?: string | null;
  } | null>(null);

  // Hide Navbar completely on login, register, doctor portal, and admin portal
  const isDoctorPortal = pathname === '/doctor' || pathname.startsWith('/doctor/');
  const isAdminPortal = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuthPage = 
    pathname === '/login' || 
    pathname.startsWith('/login/') || 
    pathname === '/register' || 
    pathname.startsWith('/register/');

  // Fetch user session
  useEffect(() => {
    if (isDoctorPortal || isAdminPortal || isAuthPage) return;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [pathname, isDoctorPortal, isAdminPortal, isAuthPage]);

  if (isAuthPage || isDoctorPortal || isAdminPortal) {
    return null;
  }

  const closeMobileMenu = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const openMobileMenu = () => {
    setIsClosing(false);
    setMobileMenuOpen(true);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  const handleProfileUpdated = (updatedData: { name: string; email: string; phone?: string; district?: string }) => {
    if (user) {
      setUser({
        ...user,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        district: updatedData.district,
      });
    }
  };

  const navLinks = [
    { name: 'হোম', href: '/', icon: Home },
    { name: 'টেলিমেডিসিন', href: '/telemedicine', icon: Video },
    { name: 'হাসপাতাল', href: '/hospitals', icon: Building2 },
    { name: 'ডাক্তার', href: '/doctors', icon: Stethoscope },
    { name: 'সিরিয়াল ট্র্যাকার', href: '/serial-tracker', icon: Activity },
    { name: 'মেডিসিন রুটিন', href: '/patient/med-schedule', icon: Pill },
    { name: 'হেলথ লকার', href: '/patient/vault', icon: ShieldCheck },
    { name: 'রক্তদান', href: '/blood', icon: Droplet },
    { name: 'জরুরি সেবা', href: '/emergency', icon: Siren },
    { name: 'স্বাস্থ্যবার্তা', href: '/health-tips', icon: Sparkles },
  ];

  // Dynamic Screen Title for Sub-Pages
  const getSubPageTitle = (path: string) => {
    if (path === '/telemedicine' || path.startsWith('/telemedicine/')) return 'টেলিমেডিসিন';
    if (path === '/doctors') return 'বিশেষজ্ঞ ডাক্তার';
    if (path.startsWith('/doctors/')) return 'ডাক্তারের প্রোফাইল';
    if (path === '/hospitals') return 'হাসপাতাল ও ডায়াগনস্টিক';
    if (path.startsWith('/hospitals/')) return 'হাসপাতাল বিবরণ';
    if (path === '/serial-tracker' || path.startsWith('/track/')) return 'লাইভ সিরিয়াল ট্র্যাকার';
    if (path === '/patient/med-schedule') return 'মেডিসিন রুটিন';
    if (path === '/patient/vault') return 'ডিজিটাল মেডিকেল লকার';
    if (path === '/patient/scanner') return 'প্রেসক্রিপশন স্ক্যানার';
    if (path === '/blood') return 'রক্তদান নেটওয়ার্ক';
    if (path === '/emergency') return 'জরুরি হেল্পলাইন';
    if (path === '/health-tips') return 'স্বাস্থ্যবার্তা ও পরামর্শ';
    if (path.startsWith('/book/')) return 'ডাক্তার চেম্বার ও সিরিয়াল';
    if (path === '/districts') return 'জেলা নির্বাচন';
    return 'CD Doctors';
  };

  const isHomepage = pathname === '/';

  // Check if current page is Blood or Emergency page
  const isRedHeader = 
    pathname === '/blood' || 
    pathname.startsWith('/blood/') || 
    pathname === '/emergency' || 
    pathname.startsWith('/emergency/');

  return (
    <>
      {/* 📱 1. NATIVE MOBILE HERO APP BAR (Red on Blood & Emergency, Sky Blue on Others) */}
      {/* 📱 1. NATIVE MOBILE HERO APP BAR */}
      {/* ========================================================================= */}
      {isHomepage ? (
        /* 🌟 HOMEPAGE SCENIC MEDICAL ART HEADER (Wide Panoramic View, Sticky with Upward White Curve) */
        <div className="block md:hidden sticky top-0 z-40 w-full aspect-[2.75/1] min-h-[135px] max-h-[165px] overflow-hidden bg-[#73B0EB] font-bengali select-none shadow-xs">
          {/* Layer 1: Scenic Medical Artwork Background (Full Wide Panoramic Display) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img 
              src="/images/mobile-header-medical-art.png" 
              alt="Medical Header Artwork" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Layer 2: Soft Sky Vignette for Text Legibility */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(8, 30, 65, 0.35) 0%, rgba(8, 30, 65, 0.05) 50%, rgba(8, 30, 65, 0.12) 100%)'
            }}
          />

          {/* Layer 3: Top Greeting & Actions Row (Positioned in the Middle of Header) */}
          <div className="relative z-10 w-full pt-9 xs:pt-10.5 pb-3 px-3.5 xs:px-4">
            <div className="flex items-center justify-between">
              
              {/* User Avatar & Greeting */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => user ? setProfileModalOpen(true) : router.push('/login')}
                  className="relative w-[40px] h-[40px] rounded-full border-2 border-white overflow-hidden shadow-sm bg-white/20 shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="text-left flex flex-col justify-center pt-1">
                  <h3 className="text-[15px] xs:text-[16px] font-bold text-white leading-tight tracking-tight">
                    <span>{user?.name || 'গেস্ট ভিজিটর'}</span>
                  </h3>
                  <div className="text-[11px] xs:text-[11.5px] text-white/90 font-medium pt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-100" />
                    <span>{getDistrictWithDivision(user?.district)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Notification Bell + Hamburger Menu */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setNotificationModalOpen(true)}
                  className="w-[36px] h-[36px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 border border-white/30 cursor-pointer relative shadow-sm"
                  aria-label="Notifications"
                  title="নোটিফিকেশন"
                >
                  <Bell className="w-3.5 h-3.5 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => openMobileMenu()}
                  className="w-[36px] h-[36px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 border border-white/30 cursor-pointer relative shadow-sm"
                  aria-label="Menu"
                  title="মেনু"
                >
                  <Menu className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

            </div>
          </div>

          {/* Layer 4: Seamless Upward White Bottom Curve (Preserving original overlapping design while sticky) */}
          <div className="absolute -bottom-0.5 left-0 right-0 h-4 xs:h-5 bg-[#73B0EB] pointer-events-none z-20">
            <div className="w-full h-full bg-white rounded-t-[14px] xs:rounded-t-[16px] sm:rounded-t-[18px] shadow-[0_-3px_10px_rgba(4,20,50,0.06)]" />
          </div>
        </div>
      ) : (
        /* 🌟 SUB-PAGE COMPACT HEADER BAR */
        <div className={`block md:hidden sticky top-0 z-50 font-bengali select-none w-full ${
          isRedHeader 
            ? 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 shadow-md' 
            : 'bg-[#649DD3]'
        } rounded-b-[18px] sm:rounded-b-[20px] overflow-hidden mobile-header-bar transition-colors duration-300`}>
          <div className="w-full pt-3 pb-3 px-4 sm:px-5">
            <div className="flex items-center justify-between">
              
              {/* Back Arrow Button */}
              <button
                type="button"
                onClick={() => router.back()}
                className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 border border-white/25 cursor-pointer shrink-0 shadow-2xs"
                aria-label="Go Back"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              {/* Centered Page Title */}
              <h2 className="text-[16.5px] sm:text-[18px] font-bold text-white tracking-wide truncate max-w-[200px] text-center">
                {getSubPageTitle(pathname)}
              </h2>

              {/* Contextual Action / Option Menu */}
              <button
                type="button"
                onClick={() => openMobileMenu()}
                className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 border border-white/25 cursor-pointer shrink-0 shadow-2xs"
                aria-label="Options"
              >
                <Menu className="w-4 h-4 text-white" />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💻 2. DESKTOP NAVBAR (Visible only on desktop screens >= md)              */}
      {/* ========================================================================= */}
      <header className={`hidden md:block sticky top-0 z-50 font-bengali transition-colors duration-300 desktop-header-bar ${
        isRedHeader
          ? 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 border-b border-rose-700/80 shadow-md'
          : 'bg-[#F4F5F7]/95 backdrop-blur-md border-b border-slate-200/60 shadow-2xs'
      }`}>
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Side: Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/logo.png"
                alt="CD Doctors Logo"
                width="44"
                height="44"
                style={{ width: '44px', height: '44px' }}
                className={`w-11 h-11 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0 ${
                  isRedHeader ? 'border-2 border-white/40' : ''
                }`}
              />
              <div>
                <div className={`font-extrabold text-2xl tracking-tight leading-none ${
                  isRedHeader ? 'text-white' : 'text-nuvicaNavy-900'
                }`}>
                  CD <span className={isRedHeader ? 'text-white/90' : 'text-nuvicaNavy-800'}>Doctors</span>
                  <span className={`inline-block w-2 h-2 rounded-full ml-1 ${
                    isRedHeader ? 'bg-white' : 'bg-sky-500'
                  }`}></span>
                </div>
                <p className={`text-[10px] font-semibold tracking-wide mt-0.5 ${
                  isRedHeader ? 'text-rose-100' : 'text-slate-500'
                }`}>
                  Digital Healthcare Platform
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`group relative px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 select-none ${
                        isRedHeader
                          ? isActive
                            ? 'bg-white text-rose-700 shadow-sm'
                            : 'text-white/90 hover:text-white hover:bg-white/20'
                          : isActive
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'text-slate-700 hover:text-sky-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className={`h-5 w-px my-auto shrink-0 ${
                isRedHeader ? 'bg-white/25' : 'bg-slate-200'
              }`} />

              {/* Profile / Login */}
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className={`flex items-center gap-2 p-1.5 pl-2.5 pr-3.5 rounded-full border shadow-2xs transition-all cursor-pointer shrink-0 ${
                      isRedHeader
                        ? 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                        : 'bg-slate-100 hover:bg-white border-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isRedHeader ? 'bg-white text-rose-600' : 'bg-sky-600 text-white'
                    }`}>
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-black truncate max-w-[110px] ${
                      isRedHeader ? 'text-white' : 'text-slate-900'
                    }`}>{user.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isRedHeader ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-rose-600'
                    }`}
                    title="লগআউট"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs shadow-sm transition-all cursor-pointer ${
                    isRedHeader
                      ? 'bg-white text-rose-600 hover:bg-rose-50'
                      : 'text-white bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>লগইন / সাইন আপ</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 📱 3. MOBILE SLIDE-OUT DRAWER MENU                                       */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] md:hidden font-bengali">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="CD Doctors" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-black text-base text-slate-900">CD Doctors</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? (isRedHeader ? 'bg-rose-50 text-rose-700 font-black' : 'bg-sky-50 text-sky-700 font-black')
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <link.icon className={`w-4 h-4 ${
                        isActive
                          ? (isRedHeader ? 'text-rose-600' : 'text-sky-600')
                          : 'text-slate-400'
                      }`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {user ? (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 truncate">{user.name}</span>
                <button onClick={handleLogout} className="text-xs font-bold text-rose-600">লগআউট</button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="w-full bg-sky-600 text-white font-black text-xs py-3 rounded-xl text-center block shadow-xs"
              >
                লগইন / সাইন আপ
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {profileModalOpen && user && (
        <ProfileEditModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onProfileUpdated={handleProfileUpdated}
          onLogout={handleLogout}
        />
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        userDistrict={user?.district}
      />
    </>
  );
}
