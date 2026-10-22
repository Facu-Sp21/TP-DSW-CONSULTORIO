import { apiFetch } from './api';

export interface Especialista {
  cod_especialista?: number;
  dni: string;
  matricula: string;
  nombre: string;
  telefono: string;
  email?: string;
  contrasena?: string;
  cod_especialidad?: number;
  estado?: boolean;
  consulta_particular?: number;
  obrasSociales?: Array<{ cod_os: number; nombre: string }>;
  obras_sociales?: number[];
}

export const getEspecialistas = () => {
  return apiFetch<Especialista[]>('/especialista');
};

export const getEspecialistasByEspecialidad = (codEspecialidad: number) => {
  return apiFetch<Especialista[]>(`/especialista?especialidad=${codEspecialidad}`);
};

//para la parte de profesionales que te acompañan
export const getEspecialistasQueTeAcompanian = async () => {
  const especialistas = await getEspecialistas();
  return especialistas.slice(0, 4);
};

export const createEspecialista = (data: Omit<Especialista, 'cod_especialista'>) => {
  const emailGenerado =
    data.email || `doc${data.matricula.toLowerCase().replace(/[^a-z0-9]/g, '')}@consultorio.com`;

  return apiFetch<Especialista>('/especialista', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      email: emailGenerado,
    }),
  });
};

export const updateEspecialista = (
  cod_especialista: number,
  data: Omit<Especialista, 'cod_especialista'>
) => {
  const emailGenerado =
    data.email || `doc${data.matricula.toLowerCase().replace(/[^a-z0-9]/g, '')}@consultorio.com`;

  return apiFetch<Especialista>(`/especialista/${cod_especialista}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...data,
      email: emailGenerado,
    }),
  });
};

export const deleteEspecialista = (cod_especialista: number) => {
  return apiFetch<void>(`/especialista/${cod_especialista}`, {
    method: 'DELETE',
  });
};