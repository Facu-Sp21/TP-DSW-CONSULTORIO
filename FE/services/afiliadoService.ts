import { apiFetch } from './api';

export interface RegistrarAfiliadoDTO {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  contrasena: string;
  cod_os?: number;
}

export interface AfiliadoResponse {
  nro_afiliado: number;
  id: number;
  nombre: string;
  nombreCompleto?: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  cod_os?: number | null;
}

export type Afiliado = AfiliadoResponse;

export const registrarAfiliado = (data: RegistrarAfiliadoDTO) => {
  return apiFetch<AfiliadoResponse>('/paciente', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const createAfiliado = registrarAfiliado;

export const getAfiliados = async () => {
  const data = await apiFetch<any[]>('/paciente');
  return data.map((p) => ({
    ...p,
    id: p.nro_afiliado,
    nombreCompleto: p.nombre,
  })) as AfiliadoResponse[];
};

export const updateAfiliado = (id: number, data: Partial<RegistrarAfiliadoDTO>) => {
  return apiFetch<AfiliadoResponse>(`/paciente/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAfiliado = (id: number) => {
  return apiFetch<void>(`/paciente/${id}`, {
    method: 'DELETE',
  });
};