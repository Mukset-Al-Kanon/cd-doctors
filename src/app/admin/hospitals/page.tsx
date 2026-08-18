'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  PhoneCall, 
  Phone,
  Mail, 
  Edit3, 
  Trash2, 
  Check,
  CheckCircle2, 
  XCircle, 
  Star,
  AlertTriangle,
  X,
  Image,
  Camera,
  Layers,
  ShieldCheck,
  Globe,
  FileText,
  Sparkles,
  ExternalLink,
  List,
  LayoutGrid,
  Stethoscope,
  Activity,
  PlusCircle,
  Upload
} from 'lucide-react';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<any>(null);
  const [deletingHospital, setDeletingHospital] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    hospitalType: 'Private Hospital',
    address: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    website: '',
    licenseNumber: '',
    description: '',
    logoUrl: '',
    coverUrl: '',
    status: 'ACTIVE',
    isFeatured: false,
    facilitiesText: '24/7 Emergency, Operation Theatre, ICU Support, Pharmacy, Diagnostic Laboratory',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, [fieldName]: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hospitals');
      const data = await res.json();
      if (data.hospitals) {
        setHospitals(data.hospitals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const addPresetFacility = (facility: string) => {
    const currentList = formData.facilitiesText ? formData.facilitiesText.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!currentList.includes(facility)) {
      currentList.push(facility);
      setFormData({ ...formData, facilitiesText: currentList.join(', ') });
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingHospital ? `/api/admin/hospitals/${editingHospital.id}` : '/api/admin/hospitals';
      const method = editingHospital ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setEditingHospital(null);
        resetForm();
        fetchHospitals();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save hospital');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDelete = async () => {
    if (!deletingHospital) return;
    try {
      const res = await fetch(`/api/admin/hospitals/${deletingHospital.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingHospital(null);
        fetchHospitals();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete hospital');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      hospitalType: 'Private Hospital',
      address: '',
      phone: '',
      emergencyPhone: '',
      email: '',
      website: '',
      licenseNumber: '',
      description: '',
      logoUrl: '',
      coverUrl: '',
      status: 'ACTIVE',
      isFeatured: false,
      facilitiesText: '24/7 Emergency, Operation Theatre, ICU Support, Pharmacy, Diagnostic Laboratory',
    });
  };

  const openEdit = (h: any) => {
    setEditingHospital(h);
    setFormData({
      name: h.name,
      hospitalType: h.hospitalType,
      address: h.address,
      phone: h.phone,
      emergencyPhone: h.emergencyPhone,
      email: h.email,
      website: h.website || '',
      licenseNumber: h.licenseNumber,
      description: h.description,
      logoUrl: h.logoUrl || '',
      coverUrl: h.coverUrl || '',
      status: h.status,
      isFeatured: h.isFeatured,
      facilitiesText: h.facilities?.map((f: any) => f.facilityName).join(', ') || '',
    });
    setIsAddModalOpen(true);
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.hospitalType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'FEATURED') return matchesSearch && h.isFeatured;
    return matchesSearch && h.status === statusFilter;
  });

  const defaultLogo = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80';
  const defaultCover = 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&auto=format&fit=crop&q=80';

  const totalActive = hospitals.filter((h) => h.status === 'ACTIVE').length;
  const totalFeatured = hospitals.filter((h) => h.isFeatured).length;
  const totalDoctors = hospitals.reduce((acc, h) => acc + (h._count?.doctors || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-nuvicaNavy-900 tracking-tight leading-tight">
                Hospitals Directory Control Center
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold">
                Chuadanga District Platform • Hospitals & Clinics Management
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            Manage hospital profiles, update cover banners & logos, configure emergency hotlines & facilities for Chuadanga.
          </p>
        </div>

        <Link
          href="/admin/hospitals/new"
          className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 hover:scale-[1.02] active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Add New Hospital
        </Link>
      </div>

      {/* Metric Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Hospitals</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nuvicaNavy-900">{hospitals.length}</span>
            <span className="text-xs text-slate-400 font-semibold">Registered in Chuadanga</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Hospitals</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-700">{totalActive}</span>
            <span className="text-xs text-sky-600 font-bold">Operational & Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Featured Hero Institutes</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700">{totalFeatured}</span>
            <span className="text-xs text-slate-400 font-semibold">Shown in Hero Slider</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Specialist Doctors</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nuvicaNavy-900">{totalDoctors}</span>
            <span className="text-xs text-slate-400 font-semibold">Assigned Profiles</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters, View Mode Toggle */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-80 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-sky-600 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hospital name or area..."
            className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs & View Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex rounded-2xl bg-slate-100 p-1 font-bold text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white text-nuvicaNavy-900 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({hospitals.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-white text-sky-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({totalActive})
            </button>
            <button
              onClick={() => setStatusFilter('FEATURED')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'FEATURED'
                  ? 'bg-white text-amber-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Featured ({totalFeatured})
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'INACTIVE'
                  ? 'bg-white text-slate-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'table' ? 'bg-white text-nuvicaNavy-900 shadow-2xs' : 'text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'grid' ? 'bg-white text-nuvicaNavy-900 shadow-2xs' : 'text-slate-400'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs font-bold border border-slate-200">
          Loading Hospitals Data...
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200 shadow-2xs">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No hospitals found</p>
          <p className="text-xs text-slate-400">No hospital records matched your search or status filter.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Structured Executive Table View */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6 whitespace-nowrap">Hospital & Branding</th>
                  <th className="py-4 px-4 whitespace-nowrap">Location Address</th>
                  <th className="py-4 px-4 whitespace-nowrap">Telephone & Hotline</th>
                  <th className="py-4 px-4 text-center whitespace-nowrap">Doctors & Facilities</th>
                  <th className="py-4 px-4 text-center whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-right whitespace-nowrap">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredHospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={h.logoUrl || defaultLogo}
                          alt={h.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200/90 shrink-0 bg-white shadow-2xs"
                        />
                        <div className="space-y-1">
                          <div className="font-extrabold text-nuvicaNavy-900 text-xs sm:text-sm leading-tight">
                            {h.name}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-md inline-block">
                              {h.hospitalType}
                            </span>
                            {h.isFeatured && (
                              <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full inline-block">
                                ★ Featured Hero
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate text-xs font-semibold text-slate-700">{h.address}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap min-w-[170px]">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 whitespace-nowrap">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="whitespace-nowrap">{h.phone || 'N/A'}</span>
                        </div>
                        {h.emergencyPhone && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-2xs">
                            <PhoneCall className="w-3 h-3 text-rose-600 shrink-0" />
                            <span className="whitespace-nowrap">24/7 Hotline: {h.emergencyPhone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col sm:flex-row items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-slate-700">
                          <Stethoscope className="w-3 h-3 text-sky-600" />
                          {h._count?.doctors || 0} Doctors
                        </span>
                        <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-slate-700">
                          <Building2 className="w-3 h-3 text-sky-600" />
                          {h.facilities?.length || 0} Facilities
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          h.status === 'ACTIVE'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            h.status === 'ACTIVE' ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        ></span>
                        {h.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/hospitals/${h.id}/edit`}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                          title="Edit Hospital Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <a
                          href={`/hospitals/${h.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-bold"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeletingHospital(h)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Hospital"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Structured Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHospitals.map((h) => (
            <div key={h.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                {/* Cover Image */}
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img
                    src={h.coverUrl || defaultCover}
                    alt={h.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {h.isFeatured && (
                      <span className="bg-amber-400 text-nuvicaNavy-950 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                        ★ Featured Hero
                      </span>
                    )}
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm ${
                      h.status === 'ACTIVE' ? 'bg-sky-500 text-white' : 'bg-slate-600 text-slate-200'
                    }`}>
                      {h.status}
                    </span>
                  </div>

                  {/* Logo Overlay */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <img
                      src={h.logoUrl || defaultLogo}
                      alt={h.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md bg-white shrink-0"
                    />
                    <div className="text-white">
                      <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        {h.hospitalType}
                      </span>
                      <h3 className="font-extrabold text-base leading-snug line-clamp-1 mt-0.5">{h.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {h.description}
                  </p>

                  <div className="text-xs text-slate-600 space-y-1.5 font-medium pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{h.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Phone: {h.phone} | Emergency: <strong className="text-rose-700">{h.emergencyPhone}</strong></span>
                    </div>
                  </div>

                  {/* Facilities Chips */}
                  {h.facilities && h.facilities.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {h.facilities.slice(0, 4).map((fac: any, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                          {fac.facilityName}
                        </span>
                      ))}
                      {h.facilities.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400">+{h.facilities.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {/* Stats Count */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100 font-bold text-slate-700">
                    <div>Doctors: <span className="text-nuvicaNavy-900">{h._count?.doctors || 0}</span></div>
                    <div>Depts: <span className="text-nuvicaNavy-900">{h._count?.departments || 0}</span></div>
                    <div>Facilities: <span className="text-nuvicaNavy-900">{h.facilities?.length || 0}</span></div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/admin/hospitals/${h.id}/edit`}
                  className="flex-1 bg-white hover:bg-sky-50 text-nuvicaNavy-900 font-extrabold text-xs py-2.5 px-4 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" /> Edit Profile & Photos
                </Link>

                <a
                  href={`/hospitals/${h.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white hover:bg-slate-100 rounded-xl text-slate-700 border border-slate-200 transition-colors"
                  title="View Public Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setDeletingHospital(h)}
                  className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors"
                  title="Delete Hospital"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STRUCTURED EDIT / ADD HOSPITAL MODAL FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in-overlay">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200/90 my-8 max-h-[90vh] flex flex-col animate-modal-pop">
            {/* Modal Header */}
            <div className="bg-nuvicaNavy-900 text-white p-6 relative flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md border border-sky-400/30">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    {editingHospital ? `Edit Hospital — ${editingHospital.name}` : 'Add New Hospital'}
                  </h2>
                  <p className="text-sky-200 text-xs font-medium">Structured Hospital Profile & Facility Management • Chuadanga District</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              
              {/* SECTION 1: Branding & Media (Logo & Cover Photo) */}
              <div className="bg-sky-50/60 p-5 sm:p-6 rounded-3xl border border-sky-100 space-y-5">
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-600" />
                    1. Hospital Branding & Media
                  </h3>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200/60">
                    Logo & Cover Banner
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Profile Pic / Logo Input Box */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-sky-600" /> Hospital Logo
                      </label>
                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                          className="text-rose-600 hover:text-rose-700 font-extrabold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="w-20 h-20 rounded-2xl border-2 border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center shadow-md relative group">
                        {formData.logoUrl ? (
                          <img
                            src={formData.logoUrl}
                            alt="Hospital Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-slate-300" />
                        )}
                      </div>

                      <div className="space-y-2 flex-1">
                        <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl border border-sky-500 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 w-full">
                          <Upload className="w-3.5 h-3.5" /> Select Image File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'logoUrl')}
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 font-semibold text-center">PNG, JPG or WebP from device</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Or Paste Direct Image Web URL</label>
                      <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleInputChange}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                      />
                    </div>
                  </div>

                  {/* Cover Photo Banner Input Box */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-sky-600" /> Header Cover Banner
                      </label>
                      {formData.coverUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, coverUrl: '' })}
                          className="text-rose-600 hover:text-rose-700 font-extrabold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="w-full h-20 rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative shadow-md">
                      {formData.coverUrl ? (
                        <img
                          src={formData.coverUrl}
                          alt="Cover Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                          <Image className="w-4 h-4 text-slate-300" /> No Cover Banner Uploaded
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl border border-sky-500 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 flex-1">
                        <Upload className="w-3.5 h-3.5" /> Select Cover File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'coverUrl')}
                        />
                      </label>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Or Paste Banner Web URL</label>
                      <input
                        type="text"
                        name="coverUrl"
                        value={formData.coverUrl}
                        onChange={handleInputChange}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Basic Hospital Information */}
              <div className="bg-slate-50/80 p-5 sm:p-6 rounded-3xl border border-slate-200/90 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  2. Basic Hospital Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Damurhuda Digital Hospital & Diagnostic"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Type *</label>
                    <select
                      name="hospitalType"
                      value={formData.hospitalType}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
                    >
                      <option value="Private Hospital">Private Hospital</option>
                      <option value="Super Specialty Hospital">Super Specialty Hospital</option>
                      <option value="Clinic">Clinic</option>
                      <option value="Diagnostic Center">Diagnostic Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">License / Registration Reg *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      required
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. REG-CDG-2026-001"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District Scope</label>
                    <div className="bg-slate-200/80 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-slate-800">
                      Chuadanga District (Fixed Scope)
                    </div>
                  </div>
                </div>

                {/* Status & Featured Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Operational Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE (Publicly Operational)</option>
                      <option value="INACTIVE">INACTIVE (Hidden from Platform)</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  {/* Interactive Featured Toggle Card */}
                  <div
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all select-none ${
                      formData.isFeatured
                        ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-xs ring-1 ring-sky-300'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Star className={`w-4 h-4 ${formData.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-extrabold text-xs">Featured Hospital</div>
                        <span className="text-[10px] text-slate-500 font-medium">Show in Home Hero Slider</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      formData.isFeatured ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {formData.isFeatured && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Contact & Location */}
              <div className="bg-slate-50/80 p-5 sm:p-6 rounded-3xl border border-slate-200/90 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                  <PhoneCall className="w-4 h-4 text-sky-600" />
                  3. Contact & Location Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chuadanga Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Hospital Road, Chuadanga Sadar"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Telephone *</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+880 761-..."
                        className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">24/7 Hotline</label>
                      <input
                        type="text"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        placeholder="+880 1711-..."
                        className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="info@hospital.com"
                        className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Description & Facilities */}
              <div className="bg-slate-50/80 p-5 sm:p-6 rounded-3xl border border-slate-200/90 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
                  <FileText className="w-4 h-4 text-sky-600" />
                  4. Description & Facilities
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Profile Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Comprehensive summary of hospital care..."
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Facilities List (Comma Separated)</label>
                    <input
                      type="text"
                      name="facilitiesText"
                      value={formData.facilitiesText}
                      onChange={handleInputChange}
                      placeholder="24/7 Emergency, ICU Support, Operation Theatre, Pharmacy, Diagnostic Laboratory"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                    />

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-extrabold text-slate-400 mr-1">Quick Add:</span>
                      {[
                        '24/7 Emergency',
                        'ICU & CCU Support',
                        'Operation Theatre',
                        'Ambulance Service',
                        'Blood Bank Unit',
                        'Pharmacy',
                        'Diagnostic Laboratory',
                      ].map((fac) => (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => addPresetFacility(fac)}
                          className="text-[10px] font-bold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2.5 py-1 rounded-full border border-slate-200 hover:border-sky-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          + {fac}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md shadow-sky-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingHospital ? 'Save Changes' : 'Create Hospital Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingHospital && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-nuvicaNavy-900">Delete Hospital Record</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900">{deletingHospital.name}</strong>? This action will remove all associated departments and facilities.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingHospital(null)}
                className="px-5 py-2.5 rounded-2xl text-xs font-extrabold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
