import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { Services } from '../services/services';
import  {jwtDecode, JwtPayload } from 'jwt-decode';

type RoleClaimPayload = JwtPayload & {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | number;
  role?: string | number;
  roles?: Array<string | number>;
};

const ADMIN_ROLE = 1;

function getRoleFromJwt(token: string | null): number | null {
  if (!token) return null;
  try {
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
    const payload = jwtDecode<RoleClaimPayload>(raw);

    const rawRole =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload.role ??
      (Array.isArray(payload.roles) ? payload.roles[0] : undefined);

    if (rawRole === undefined || rawRole === null) return null;

    const n = typeof rawRole === 'string' ? parseInt(rawRole, 10) : Number(rawRole);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function evaluateAuth(stateUrl: string) {
  const services = inject(Services);
  const router = inject(Router);

  if (!services.auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { redirect: stateUrl } });
  }

  const token = services.auth.getToken?.() ?? localStorage.getItem('token');
  const role = getRoleFromJwt(token);
  const isAdmin = role === ADMIN_ROLE;

  if (!isAdmin) {
    alert('⚠️ Necesitas permisos de administrador para entrar aquí.');
    return false; 
  }

  return true;
}

export const authGuard: CanActivateFn = (_route, state) => evaluateAuth(state.url);

export const authMatchGuard: CanMatchFn = (_route, segments) =>
  evaluateAuth('/' + segments.map((s) => s.path).join('/'));
