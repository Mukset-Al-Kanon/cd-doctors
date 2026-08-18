'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function SuperAdminLocationsPage() {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [locType, setLocType] = useState<'DIVISION' | 'DISTRICT'>('DISTRICT');
  const [selectedDivId, setSelectedDivId] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');

  const fetchLocations = () => {
    fetch('/api/admin/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.divisions) {
          setDivisions(data.divisions);
          if (data.divisions.length > 0) setSelectedDivId(data.divisions[0].id);
        }
      });
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: locType,
        divisionId: locType === 'DISTRICT' ? selectedDivId : undefined,
        nameEn,
        nameBn,
      }),
    });

    setNameEn('');
    setNameBn('');
    setShowModal(false);
    fetchLocations();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Bangladesh Location Hierarchy</h1>
          <p className="text-xs text-slate-500 mt-1">Dynamic database-driven management of Divisions and Districts.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-medical text-xs !py-2">
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 border-b pb-2">Add Division or District</h3>
            <form onSubmit={handleAddLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Type *</label>
                <select
                  value={locType}
                  onChange={(e) => setLocType(e.target.value as any)}
                  className="w-full border rounded-xl p-2.5 bg-slate-50"
                >
                  <option value="DISTRICT">District (জেলা)</option>
                  <option value="DIVISION">Division (বিভাগ)</option>
                </select>
              </div>

              {locType === 'DISTRICT' && (
                <div>
                  <label className="block font-semibold mb-1">Under Division *</label>
                  <select
                    value={selectedDivId}
                    onChange={(e) => setSelectedDivId(e.target.value)}
                    className="w-full border rounded-xl p-2.5 bg-slate-50"
                  >
                    {divisions.map((div) => (
                      <option key={div.id} value={div.id}>{div.nameEn} ({div.nameBn})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Chuadanga"
                  className="w-full border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Name (Bangla) *</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="e.g. চুয়াডাঙ্গা"
                  className="w-full border rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-medical text-xs">
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {divisions.map((div) => (
          <div key={div.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <MapPin className="w-4 h-4 text-medical-600" />
              <h3 className="font-bold text-sm text-slate-900">{div.nameEn} Division ({div.nameBn})</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {div.districts.map((dist: any) => (
                <span key={dist.id} className="px-3 py-1 bg-slate-100 rounded-xl font-medium text-slate-700 border">
                  {dist.nameEn} ({dist.nameBn}) — <strong className="text-medical-700">{dist._count.hospitals}</strong> Hospitals
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
