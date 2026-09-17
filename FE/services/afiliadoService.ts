import { apiFetch } from './api';

export interface RegistrarAfiliadoDTO {
  nombreCompleto: string;
  dni: string;
  email: string;
  password?: string;
  obraSocialId?: number;
}

export interface AfiliadoResponse {
  id: number;
  nombreCompleto: string;
  dni: string;
  email: string;
  obraSocialId?: number;
}

export const registrarAfiliado = (data: RegistrarAfiliadoDTO) => {
  return apiFetch<AfiliadoResponse>('/afiliado', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAfiliados = () => {
  return apiFetch<AfiliadoResponse[]>('/afiliado');
};