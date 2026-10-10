import { apiFetch } from './api';

export interface Paciente {
  nro_afiliado?: number;
  dni: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  contrasena: string;
  cod_os?: number | null;
}

export const getPacientes = () => {
  return apiFetch<Paciente[]>('/paciente');
};

export const getPacienteById = (nro_afiliado: number) => {
  return apiFetch<Paciente>(`/paciente/${nro_afiliado}`);
};

export const createPaciente = (data: Paciente) => {
  return apiFetch<Paciente>('/paciente', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePaciente = (nro_afiliado: number, data: Partial<Paciente>) => {
  return apiFetch<Paciente>(`/paciente/${nro_afiliado}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deletePaciente = (nro_afiliado: number) => {
  return apiFetch<void>(`/paciente/${nro_afiliado}`, {
    method: 'DELETE',
  });
};
