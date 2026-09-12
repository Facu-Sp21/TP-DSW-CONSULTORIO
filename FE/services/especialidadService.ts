import { apiFetch } from './api';

export interface Especialidad {
  cod_especialidad: number;
  nombre: string;
}

export interface Especialista {
  cod_especialista: number;
  matricula: string;
  nombre: string;
  telefono: string;
  cod_especialidad: number;
}

export const getEspecialidades = () => {
  return apiFetch<Especialidad[]>('/especialidad');
};

export const getEspecialistasByEspecialidad = (codEspecialidad: number) => {
  return apiFetch<Especialista[]>(`/especialidad/${codEspecialidad}/especialistas`);
};