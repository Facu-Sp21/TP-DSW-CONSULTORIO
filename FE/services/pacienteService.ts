import { apiFetch } from './api';

export interface RegistrarPacienteDTO {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  contrasena?: string;
  cod_os?: number | null;
}

export interface PacienteResponse {
  nro_afiliado?: number;
  id?: number;
  nombre: string;
  nombreCompleto?: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  cod_os?: number | null;
  obraSocial?: {
    cod_os: number;
    nombre: string;
  } | null;
}

export type Paciente = PacienteResponse;

export const createPaciente = (data: RegistrarPacienteDTO) => {
  return apiFetch<PacienteResponse>('/paciente', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPacientes = async () => {
  const data = await apiFetch<any[]>('/paciente');
  return data.map((p) => ({
    ...p,
    id: p.nro_afiliado,
    nombreCompleto: p.nombre,
  })) as PacienteResponse[];
};

export const getPacienteById = (id: number) => {
  return apiFetch<PacienteResponse>(`/paciente/${id}`);
};

export const updatePaciente = (id: number, data: Partial<RegistrarPacienteDTO>) => {
  return apiFetch<PacienteResponse>(`/paciente/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deletePaciente = (id: number) => {
  return apiFetch<void>(`/paciente/${id}`, {
    method: 'DELETE',
  });
};
