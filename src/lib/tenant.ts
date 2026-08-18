import { getSession } from './auth';

export async function getTenantContext() {
  const session = await getSession();
  
  if (!session) {
    return { isAuthorized: false, hospitalId: null, role: null, isSuperAdmin: false };
  }

  if (session.role === 'SUPER_ADMIN') {
    return { isAuthorized: true, hospitalId: null, role: session.role, isSuperAdmin: true };
  }

  if (session.role === 'HOSPITAL_ADMIN' || session.role === 'HOSPITAL_STAFF') {
    if (!session.hospitalId) {
      return { isAuthorized: false, hospitalId: null, role: session.role, isSuperAdmin: false };
    }
    return { isAuthorized: true, hospitalId: session.hospitalId, role: session.role, isSuperAdmin: false };
  }

  return { isAuthorized: false, hospitalId: null, role: session.role, isSuperAdmin: false };
}

export function assertTenantAccess(sessionHospitalId: string | null, targetHospitalId: string) {
  if (!sessionHospitalId) return; // Super Admin bypass
  if (sessionHospitalId !== targetHospitalId) {
    throw new Error('TENANT_ISOLATION_VIOLATION: Unauthorized access to external hospital data.');
  }
}
