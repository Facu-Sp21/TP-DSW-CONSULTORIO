import { apiFetch } from './api';

export const suscribirse = (email: string) =>
  apiFetch<{ message: string }>('/suscripcion', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });