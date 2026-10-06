import { apiFetch } from './api';

export interface Especialidad {
  cod_especialidad?: number;
  nombre: string;
}

export const getEspecialidades = () => {
  return apiFetch<Especialidad[]>('/especialidad');
};

export const createEspecialidad = (data: { nombre: string }) => {
  return apiFetch<Especialidad>('/especialidad', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateEspecialidad = (cod_especialidad: number, data: { nombre: string }) => {
  return apiFetch<Especialidad>(`/especialidad/${cod_especialidad}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteEspecialidad = (cod_especialidad: number) => {
  return apiFetch<void>(`/especialidad/${cod_especialidad}`, {
    method: 'DELETE',
  });
};