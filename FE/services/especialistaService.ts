import { apiFetch } from './api';

export interface Especialista {
  cod_especialista: number;
  matricula: string;
  nombre: string;
  telefono: string;
  cod_especialidad?: number;
}

// Cambiamos a las rutas reales de tu backend
export const getEspecialistas = () => {
  return apiFetch<Especialista[]>('/especialista');
};

export const getEspecialistasByEspecialidad = (codEspecialidad: number) => {
  return apiFetch<Especialista[]>(`/especialista?especialidad=${codEspecialidad}`);
};