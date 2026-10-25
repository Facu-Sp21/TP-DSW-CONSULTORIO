import { apiFetch } from './api';

export interface ObraSocial {
  cod_os: number;
  nombre: string;
}

export const getObrasSociales = () => {
  return apiFetch<ObraSocial[]>('/obraSocial');
};

export const createObraSocial = (data: { nombre: string }) => {
  return apiFetch<ObraSocial>('/obraSocial', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateObraSocial = (cod: number, data: { nombre: string }) => {
  return apiFetch<ObraSocial>(`/obraSocial/${cod}`, {
    method: 'PUT', // O 'PATCH' según cómo esté definido en el backend
    body: JSON.stringify(data),
  });
};

export const deleteObraSocial = (cod: number) => {
  return apiFetch<void>(`/obraSocial/${cod}`, {
    method: 'DELETE',
  });
};