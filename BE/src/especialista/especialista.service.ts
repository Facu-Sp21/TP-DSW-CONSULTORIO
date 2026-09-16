import { orm } from '../shared/db/orm.js';
import { Especialidad } from '../especialidad/especialidad.entity.js';
import { alreadyExistsError } from '../shared/errorsModel.js';
import { Especialista } from './especialista.entity.js';

type EspecialistaInput = {
  matricula: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: Especialidad;
};

async function EspecialistaIsUnique(matricula: string, email: string, cod_especialista?: number) { 
  const especialistaConMatricula = await orm.em.findOne(Especialista, { matricula });
  const especialistaConEmail = await orm.em.findOne(Especialista, { email });

  const duplicado = [especialistaConMatricula, especialistaConEmail].some(
    (especialista) => especialista && especialista.cod_especialista !== cod_especialista,
  );

  if (duplicado) {
    throw new alreadyExistsError('Ya existe un especialista con esa matrícula o email');
  }
}

export async function sGetAllEspecialistas(): Promise<Especialista[]> {
  return await orm.em.find(Especialista, {}, { populate: ['especialidad'] });
}

export async function sGetEspecialistaById(cod_especialista: number): Promise<Especialista | null> {
  return await orm.em.findOne(Especialista, { cod_especialista }, { populate: ['especialidad'] });
}

export async function sCreateEspecialista(input: EspecialistaInput): Promise<Especialista> {
  await EspecialistaIsUnique(input.matricula, input.email);

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

  await EspecialistaIsUnique(input.matricula, input.email, cod_especialista);

  especialista.matricula = input.matricula;
  especialista.nombre = input.nombre;
  especialista.email = input.email;
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
