import Link from 'next/link';
import { Building2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-medical-50 text-medical-600 border border-medical-200 flex items-center justify-center mx-auto">
        <Building2 className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900">Page Not Found</h2>
      <p className="text-xs text-slate-500">
        The requested hospital or doctor profile could not be found in Chuadanga District.
      </p>
      <Link href="/" className="btn-medical text-xs !py-2.5 inline-flex items-center gap-2">
        <Home className="w-4 h-4" /> Return to CD Doctors Homepage
      </Link>
    </div>
  );
}
