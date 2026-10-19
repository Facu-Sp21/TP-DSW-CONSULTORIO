import { apiFetch } from './api';

export interface ObraSocial {
  cod_os: number;
  nombre: string;
}

export const getObrasSociales = () => {
  return apiFetch<ObraSocial[]>('/obraSocial');
};