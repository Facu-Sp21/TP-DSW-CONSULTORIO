import { apiFetch } from './api';

export interface CreateTurnoPayload {
  fecha: string;            
  hora_inicio: string;      
  cod_especialista: number; 
  nro_afiliado: number;     
  cod_os?: number | null;
}

export interface TurnoAdmin {
  cod_turno?: number;
  fecha: string;
  hora_inicio: string;
  cod_especialista: number;
  nro_afiliado: number;
  estado?: string;
  obraSocial?: {
    cod_os: number;
    nombre: string;
  } | null;
  paciente?: {
    nro_afiliado: number;
    nombre: string;
    dni: string;
  };
  especialista?: {
    cod_especialista: number;
    nombre: string;
    matricula: string;
  };
}

export const getTurnos = () => {
  return apiFetch<TurnoAdmin[]>('/turno');
};

export const getTurnosPaciente = (nroAfiliado: number) => {
  return apiFetch<TurnoAdmin[]>(`/turno?nro_afiliado=${nroAfiliado}`);
};

export const createTurno = (data: CreateTurnoPayload) => {
  return apiFetch<TurnoAdmin>('/turno', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const cancelarTurno = (cod_turno: number) => {
  return apiFetch<void>(`/turno/${cod_turno}`, {
    method: 'DELETE',
  });
};