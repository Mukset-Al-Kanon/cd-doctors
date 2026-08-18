'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export default function SuperAdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Audit Logs</h1>
        <p className="text-xs text-slate-500 mt-1">Audit log of system activities, hospital registrations, and status changes.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">No activity logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{log.user?.name || 'System'}</div>
                      <div className="text-[11px] text-slate-500">{log.user?.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="badge-medical text-[10px] py-0.5">{log.action}</span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
