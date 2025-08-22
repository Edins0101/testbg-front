import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Decodifica el token (JWT) para revisar expiración
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // O usa tu router
      return next(req); // O también puedes abortar aquí, si no quieres enviar la petición
    }
    // Si NO está expirado, agrega el header
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};