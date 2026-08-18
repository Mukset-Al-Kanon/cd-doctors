'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Building2, 
  Truck, 
  Droplet, 
  Flame, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  X, 
  Phone,
  ArrowUpRight,
  Search,
  Filter,
  LayoutGrid,
  List,
  Activity,
  Layers,
  Power
} from 'lucide-react';

interface Helpline {
  id: string;
  title: string;
  number: string;
  desc: string;
  badge: string;
  icon: string;
  isAvailable: boolean;
  orderIndex: number;
}

const AVAILABLE_ICONS = [
  { id: 'PhoneCall', label: 'Phone Call', icon: PhoneCall },
  { id: 'ShieldAlert', label: 'Emergency Shield', icon: ShieldAlert },
  { id: 'Building2', label: 'Hospital', icon: Building2 },
  { id: 'HeartPulse', label: 'Specialized Care', icon: HeartPulse },
  { id: 'Droplet', label: 'Blood Unit', icon: Droplet },
  { id: 'Truck', label: 'Ambulance Transport', icon: Truck },
  { id: 'Flame', label: 'Fire & Rescue', icon: Flame },
];

const BADGE_PRESETS = [
  'National 24/7',
  'Chuadanga Sadar',
  'Chuadanga',
  'Blood Unit',
  'Air Ambulance',
  'Rescue Unit',
  'Emergency 24/7',
];

export default function AdminEmergencyPage() {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHelpline, setEditingHelpline] = useState<Helpline | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [desc, setDesc] = useState('');
  const [badge, setBadge] = useState('Emergency 24/7');
  const [icon, setIcon] = useState('PhoneCall');
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchHelplines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/emergency');
      const data = await res.json();
      if (data.helplines) {
        setHelplines(data.helplines);
      }
    } catch (err) {
      setErrorMessage('Failed to load emergency helplines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelplines();
  }, []);

  const openAddModal = () => {
    setEditingHelpline(null);
    setTitle('');
    setNumber('');
    setDesc('');
    setBadge('Emergency 24/7');
    setIcon('PhoneCall');
    setIsAvailable(true);
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const openEditModal = (h: Helpline) => {
    setEditingHelpline(h);
    setTitle(h.title);
    setNumber(h.number);
    setDesc(h.desc);
    setBadge(h.badge);
    setIcon(h.icon || 'PhoneCall');
    setIsAvailable(h.isAvailable);
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      const url = editingHelpline
        ? `/api/admin/emergency/${editingHelpline.id}`
        : '/api/admin/emergency';
      const method = editingHelpline ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          number,
          desc,
          badge,
          icon,
          isAvailable,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save helpline.');
        setSaving(false);
        return;
      }

      setSuccessMessage(
        editingHelpline ? 'Helpline updated successfully!' : 'New helpline added successfully!'
      );
      setIsModalOpen(false);
      fetchHelplines();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Network error while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this emergency helpline?')) return;

    try {
      const res = await fetch(`/api/admin/emergency/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Failed to delete helpline.');
        return;
      }

      setSuccessMessage('Helpline deleted successfully!');
      fetchHelplines();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error deleting helpline.');
    }
  };

  const toggleStatus = async (h: Helpline) => {
    try {
      const res = await fetch(`/api/admin/emergency/${h.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !h.isAvailable }),
      });

      if (res.ok) {
        fetchHelplines();
      }
    } catch (err) {
      alert('Failed to toggle status.');
    }
  };

  // Filtered helplines logic
  const filteredHelplines = helplines.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.badge.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'active') return matchesSearch && h.isAvailable;
    if (statusFilter === 'disabled') return matchesSearch && !h.isAvailable;
    return matchesSearch;
  });

  const activeCount = helplines.filter((h) => h.isAvailable).length;
  const disabledCount = helplines.filter((h) => !h.isAvailable).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-nuvicaNavy-900 tracking-tight leading-tight">
                Emergency Helplines Manager
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold">
                Chuadanga District Platform • Central Hotline Control
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            Configure national emergency service, local Chuadanga hospital helplines & ambulance numbers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/emergency"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl transition-all flex items-center gap-1.5"
          >
            <span>Live Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={openAddModal}
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add New Helpline
          </button>
        </div>
      </div>

      {/* Structured Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Helplines</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-nuvicaNavy-900">{helplines.length}</span>
            <span className="text-xs text-slate-400 font-semibold">Configured Hotline Cards</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Hotlines</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-700">{activeCount}</span>
            <span className="text-xs text-sky-600 font-bold">Publicly Visible</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Disabled Hotlines</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Power className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700">{disabledCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Hidden from Public</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Scope</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-nuvicaNavy-900">Chuadanga + National</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-sky-50 border border-sky-200 text-sky-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Toolbar: Search, Filters, View Mode Toggle */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-80 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-sky-600 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search helpline title or number..."
            className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs & View Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex rounded-2xl bg-slate-100 p-1 font-bold text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-nuvicaNavy-900 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({helplines.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-sky-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('disabled')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                statusFilter === 'disabled'
                  ? 'bg-white text-rose-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Disabled ({disabledCount})
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

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs font-bold border border-slate-200">
          Loading emergency helplines...
        </div>
      ) : filteredHelplines.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200 shadow-2xs">
          <PhoneCall className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No emergency helplines found</p>
          <p className="text-xs text-slate-400">Try adjusting your search query or add a new helpline.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Structured Executive Table View */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Helpline Name & Info</th>
                  <th className="py-4 px-4">Category Tag</th>
                  <th className="py-4 px-4">Phone Number</th>
                  <th className="py-4 px-4 text-center">Visibility Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredHelplines.map((h) => {
                  const IconComp = AVAILABLE_ICONS.find((i) => i.id === h.icon)?.icon || PhoneCall;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-extrabold text-nuvicaNavy-900 text-xs sm:text-sm">{h.title}</div>
                            <div className="text-slate-400 text-[11px] font-medium line-clamp-1">{h.desc}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full">
                          {h.badge}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <a
                          href={`tel:${h.number}`}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-sky-700 hover:text-sky-800 hover:underline bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full"
                        >
                          <Phone className="w-3 h-3 text-sky-600" />
                          {h.number}
                        </a>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(h)}
                          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border transition-all ${
                            h.isAvailable
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              h.isAvailable ? 'bg-sky-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          ></span>
                          {h.isAvailable ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(h)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-bold"
                            title="Edit Helpline"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(h.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete Helpline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Structured Executive Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHelplines.map((h) => {
            const IconComp = AVAILABLE_ICONS.find((i) => i.id === h.icon)?.icon || PhoneCall;
            return (
              <div
                key={h.id}
                className={`bg-white border rounded-3xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  h.isAvailable ? 'border-slate-200/90' : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-2xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full">
                      {h.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-base text-nuvicaNavy-900 leading-snug">{h.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{h.desc}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-sky-700 font-extrabold text-sm pt-1">
                    <Phone className="w-4 h-4 text-sky-600" />
                    {h.number}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleStatus(h)}
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border transition-all ${
                      h.isAvailable
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {h.isAvailable ? '✓ Active' : '✕ Disabled'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(h)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-bold"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-lg text-nuvicaNavy-900">
                  {editingHelpline ? 'Edit Emergency Helpline' : 'Add New Emergency Helpline'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editingHelpline ? 'Update details for this hotline card' : 'Create a new helpline card for the public page'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Helpline Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chuadanga Sadar Hospital Emergency"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-nuvicaNavy-900 focus:outline-none focus:border-sky-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. +880 761-63105 or 999"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-nuvicaNavy-900 focus:outline-none focus:border-sky-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. 24/7 Outdoor Emergency, ICU & Patient Admission"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-nuvicaNavy-900 focus:outline-none focus:border-sky-600 focus:bg-white transition-all"
                />
              </div>

              {/* Badge Tag Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Badge Tag Label
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Chuadanga Sadar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-nuvicaNavy-900 focus:outline-none focus:border-sky-600 focus:bg-white transition-all mb-2"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">Presets:</span>
                  {BADGE_PRESETS.map((bp) => (
                    <button
                      key={bp}
                      type="button"
                      onClick={() => setBadge(bp)}
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-all border ${
                        badge === bp
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {bp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Select Card Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {AVAILABLE_ICONS.map((ic) => {
                    const IconC = ic.icon;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setIcon(ic.id)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                          icon === ic.id
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm scale-105'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={ic.label}
                      >
                        <IconC className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="isAvailable" className="text-xs font-extrabold text-slate-700 cursor-pointer">
                  Publicly Active (Visible on Emergency Directory)
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl text-xs font-extrabold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingHelpline ? 'Update Helpline' : 'Create Helpline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
