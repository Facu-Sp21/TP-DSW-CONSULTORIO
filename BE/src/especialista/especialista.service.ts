import { orm } from '../shared/db/orm.js';
import { Especialidad } from '../especialidad/especialidad.entity.js';
import { Especialista } from './especialista.entity.js';

type EspecialistaInput = {
  matricula: string;
  nombre: string;
  telefono: string;
  especialidad: Especialidad;
};

export async function sGetAllEspecialistas(): Promise<Especialista[]> {
  return await orm.em.find(Especialista, {}, { populate: ['especialidad'] });
}

export async function sGetEspecialistaById(cod_especialista: number): Promise<Especialista | null> {
  return await orm.em.findOne(Especialista, { cod_especialista }, { populate: ['especialidad'] });
}

export async function sCreateEspecialista(input: EspecialistaInput): Promise<Especialista> {
  const especialista = orm.em.create(Especialista, input);
  await orm.em.persistAndFlush(especialista);
  return especialista;
}

export async function sUpdateEspecialista(
  cod_especialista: number,
  input: EspecialistaInput,
): Promise<Especialista | null> {
  const especialista = await orm.em.findOne(Especialista, { cod_especialista });

  if (!especialista) {
    return null;
  }

  especialista.matricula = input.matricula;
  especialista.nombre = input.nombre;
  especialista.telefono = input.telefono;
  especialista.especialidad = input.especialidad;

  await orm.em.flush();

  return especialista;
}

export async function sDeleteEspecialista(cod_especialista: number): Promise<boolean> {
  const especialista = await orm.em.findOne(Especialista, { cod_especialista });

  if (!especialista) {
    return false;
  }

  await orm.em.removeAndFlush(especialista);
  return true;
}
