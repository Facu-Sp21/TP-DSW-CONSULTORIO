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

export type AccionConfirmacion = 'confirmar' | 'cancelar';

export interface ResponderConfirmacionPayload {
  token: string;
  accion: AccionConfirmacion;
}

export interface ResponderConfirmacionResponse {
  cod_turno: number;
  estado: 'CONFIRMADO' | 'CANCELADO';
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

export const confirmacionTurno = (
  data: ResponderConfirmacionPayload,
) => {
  return apiFetch<ResponderConfirmacionResponse>('/turno/confirmar-asistencia',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )};