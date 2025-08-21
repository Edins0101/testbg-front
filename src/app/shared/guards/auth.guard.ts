import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { Services } from '../services/services';

function evaluateAuth(stateUrl: string) {
  const services = inject(Services);
  const router = inject(Router);

  const isLogged = services.auth.isLoggedIn(); // <- OJO: método, no objeto
  return isLogged
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: stateUrl } });
}

export const authGuard: CanActivateFn = (_route, state) => evaluateAuth(state.url);
export const authMatchGuard: CanMatchFn = (_route, segments) =>
  evaluateAuth('/' + segments.map(s => s.path).join('/'));