import { apiFetch } from './api';

export interface Especialidad {
  cod_especialidad?: number;
  nombre: string;
  duracion_minutos?: number;
  estado?: boolean;
}

export const getEspecialidades = (estado?: number) => {
  const query = estado === 1 ? '?estado=1' : '';
  return apiFetch<Especialidad[]>(`/especialidad${query}`);
};

export const createEspecialidad = (data: { nombre: string; duracion_minutos?: number; estado?: boolean }) => {
  return apiFetch<Especialidad>('/especialidad', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      duracion_minutos: data.duracion_minutos ?? 15, // Asigna 15 por defecto si no viene
    }),
  });
};

export const updateEspecialidad = (
  cod_especialidad: number, 
  data: { nombre: string; duracion_minutos?: number; estado?: boolean }
) => {
  return apiFetch<Especialidad>(`/especialidad/${cod_especialidad}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...data,
      duracion_minutos: data.duracion_minutos ?? 15,
    }),
  });
};

export const deleteEspecialidad = (cod_especialidad: number) => {
  return apiFetch<void>(`/especialidad/${cod_especialidad}`, {
    method: 'DELETE',
  });
};