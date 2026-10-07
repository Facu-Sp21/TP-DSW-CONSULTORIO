import { apiFetch } from './api';

export interface Especialista {
  cod_especialista?: number;
  matricula: string;
  nombre: string;
  telefono: string;
  cod_especialidad?: number;
}

export const getEspecialistas = () => {
  return apiFetch<Especialista[]>('/especialista');
};

export const getEspecialistasByEspecialidad = (codEspecialidad: number) => {
  return apiFetch<Especialista[]>(`/especialista?especialidad=${codEspecialidad}`);
};

export const createEspecialista = (data: Omit<Especialista, 'cod_especialista'>) => {
  return apiFetch<Especialista>('/especialista', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateEspecialista = (
  cod_especialista: number,
  data: Omit<Especialista, 'cod_especialista'>
) => {
  return apiFetch<Especialista>(`/especialista/${cod_especialista}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteEspecialista = (cod_especialista: number) => {
  return apiFetch<void>(`/especialista/${cod_especialista}`, {
    method: 'DELETE',
  });
};