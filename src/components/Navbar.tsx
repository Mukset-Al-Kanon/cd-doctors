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
  Sparkles
} from 'lucide-react';
import ProfileEditModal from './ProfileEditModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [user, setUser] = useState<{ name: string; email: string; phone?: string | null; role: string } | null>(null);

  const closeMobileMenu = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 360);
  };

  const openMobileMenu = () => {
    setIsClosing(false);
    setMobileMenuOpen(true);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMobileMenu();
    setTimeout(() => {
      router.push(href);
    }, 340);
  };

  // If on admin routes, do not render public Navbar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Fetch current logged-in admin user session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/admin/login';
  };

  const handleProfileUpdated = (updatedData: { name: string; email: string; phone?: string }) => {
    if (user) {
      setUser({
        ...user,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
      });
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home, iconColor: 'text-sky-600' },
    { name: 'Hospitals', href: '/hospitals', icon: Building2, iconColor: 'text-sky-600' },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope, iconColor: 'text-sky-600' },
    { name: 'Blood', href: '/blood', icon: Droplet, iconColor: 'text-rose-500 fill-rose-500' },
    { name: 'Emergency', href: '/emergency', icon: Siren, iconColor: 'text-amber-500' },
    { name: 'About', href: '/about', icon: Info, iconColor: 'text-sky-600' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav-nuvica">
        {/* Main Nuvica Navbar - Full Width Edge-to-Edge */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side: Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0 mr-auto md:mr-0">
              <img
                src="/logo.png"
                alt="CD Doctors Logo"
                width="44"
                height="44"
                style={{ width: '44px', height: '44px' }}
                className="w-11 h-11 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0"
              />
              <div>
                <div className="font-extrabold text-2xl text-nuvicaNavy-900 tracking-tight leading-none">
                  CD <span className="text-nuvicaNavy-800">Doctors</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-sky-500 ml-1"></span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wide mt-0.5">
                  Digital Healthcare Platform
                </p>
              </div>
            </Link>

            {/* Right Side: Navigation Links & Profile Control Grouped Together */}
            <div className="hidden md:flex items-center gap-3">
              <nav className="flex items-center gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`group relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 ease-out select-none ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/35 scale-[1.02]'
                          : 'text-slate-700 hover:text-sky-600 hover:bg-white hover:shadow-md hover:shadow-sky-500/15 hover:-translate-y-0.5 active:scale-95'
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="h-5 w-px bg-slate-200/90 my-auto shrink-0"></div>

              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-white hover:border-sky-300 p-1.5 pl-2.5 pr-3.5 rounded-full border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer shrink-0"
                    title="Profile Settings & Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-600 group-hover:bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-black text-nuvicaNavy-900 truncate max-w-[110px]">{user.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="লগআউট করুন"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs text-white bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all duration-300 border border-sky-500 hover:scale-[1.02] active:scale-95 shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span className="tracking-wide">Login / Sign Up</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => (mobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation - Root Level Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] md:hidden">
          {/* Dark Backdrop Overlay */}
          <div 
            className={`fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity ${
              isClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'
            }`}
            onClick={closeMobileMenu}
          ></div>

          {/* Solid White Slide Panel - Right Side */}
          <div 
            className={`fixed inset-y-0 right-0 w-[295px] max-w-[85vw] bg-white h-[100dvh] shadow-2xl z-[100000] flex flex-col overflow-y-auto p-4 space-y-4 ${
              isClosing ? 'animate-slide-to-right-exit' : 'animate-slide-from-right'
            }`}
          >
            <div className="space-y-4">
              {/* Close Button & Brand Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover shadow-2xs" />
                  <div>
                    <span className="font-black text-sm text-nuvicaNavy-900 block leading-tight">CD Doctors</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">Chuadanga Healthcare</span>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sleek Sky/Navy Profile Banner Box */}
              <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-nuvicaNavy-900 p-4 rounded-2xl text-white shadow-md flex items-center gap-3.5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm text-white truncate leading-snug">
                    {user ? `Hello, ${user.name}!` : 'Hello there!'}
                  </h3>
                  {user ? (
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        setProfileModalOpen(true);
                      }}
                      className="text-xs text-sky-200 hover:text-white font-extrabold flex items-center gap-1 mt-0.5 cursor-pointer"
                    >
                      Profile Settings <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={(e) => handleNavClick(e, '/login')}
                      className="text-xs text-sky-200 hover:text-white font-extrabold flex items-center gap-1 mt-0.5"
                    >
                      Sign in / Register <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Main Category / Navigation Links (Clean Rounded Box) */}
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/80 divide-y divide-slate-200/70 shadow-2xs">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`group flex items-center justify-between py-3 px-3.5 text-xs font-extrabold transition-all duration-300 ease-out rounded-xl touch-manipulation select-none active:scale-[0.97] ${
                        isActive
                          ? 'bg-sky-600 text-white font-black shadow-md shadow-sky-600/35 translate-x-0.5'
                          : 'text-slate-800 hover:bg-white hover:text-sky-600 hover:shadow-xs hover:translate-x-1 active:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {Icon && (
                          <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${isActive ? 'text-white' : link.iconColor || 'text-sky-600'}`} />
                        )}
                        <span className="tracking-wide">{link.name}</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Action Button Section directly below menu links */}
              {(user?.role === 'ADMIN' || !user) && (
                <div className="pt-2">
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={(e) => handleNavClick(e, '/admin')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sky-50 text-sky-800 text-xs font-black transition-colors border border-sky-100 shadow-xs"
                    >
                      <LayoutDashboard className="w-4 h-4 text-sky-600" />
                      Admin Dashboard
                    </Link>
                  )}
                  {!user && (
                    <Link
                      href="/login"
                      onClick={(e) => handleNavClick(e, '/login')}
                      className="w-full py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <User className="w-4 h-4 text-white" />
                      Sign In / Register
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {user && (
        <ProfileEditModal
          user={user}
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onProfileUpdated={handleProfileUpdated}
          onLogout={() => {
            setProfileModalOpen(false);
            handleLogout();
          }}
        />
      )}
    </>
  );
}
