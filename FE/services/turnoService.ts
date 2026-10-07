import { apiFetch } from './api';

export interface CreateTurnoPayload {
  fecha: string;            
  hora_inicio: string;      
  cod_especialista: number; 
  nro_afiliado: number;     
}

export interface TurnoAdmin {
  cod_turno?: number;
  fecha: string;
  hora_inicio: string;
  cod_especialista: number;
  nro_afiliado: number;
  estado?: string;
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