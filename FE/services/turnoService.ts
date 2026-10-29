import { apiFetch } from './api';

export interface TurnoAdmin {
  id?: number;
  fecha: string;
  hora: string;
  especialistaId: number;
  afiliadoId?: number;
  estado: string;
}

export const getTurnos = () => {
  return apiFetch<TurnoAdmin[]>('/turno');
};

export const createTurno = (data: TurnoAdmin) => {
  return apiFetch<TurnoAdmin>('/turno', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const cancelarTurno = (id: number) => {
  return apiFetch<TurnoAdmin>(`/turno/${id}/cancelar`, {
    method: 'PUT',
  });
};