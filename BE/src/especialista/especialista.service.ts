import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { Especialidad } from '../especialidad/especialidad.entity.js';
import { ObraSocial } from '../ObraSocial/obraSocial.entity.js';
import { alreadyExistsError } from '../shared/errorsModel.js';
import { hashPassword } from '../shared/auth/password.js';
import { Especialista } from './especialista.entity.js';

type EspecialistaInput = {
  dni: string;
  matricula: string;
  nombre: string;
  email: string;
  telefono: string;
  contrasena?: string;
  especialidad?: Especialidad | null;
  estado?: boolean;
  consulta_particular?: number;
  obras_sociales?: number[]; // IDs de obras sociales
};

export async function sGetAllEspecialistas(cod_especialidad?: number): Promise<Especialista[]> {
  const filter = cod_especialidad ? { especialidad: { cod_especialidad } } : {};
  return await orm.em.find(Especialista, filter, { populate: ['especialidad', 'obrasSociales'] });
}

export async function sGetEspecialistaById(cod_especialista: number): Promise<Especialista | null> {
  return await orm.em.findOne(Especialista, { cod_especialista }, { populate: ['especialidad', 'obrasSociales'] });
}

export async function sGetEspecialistaByEmail(email: string): Promise<Especialista | null> {
  return await orm.em.findOne(Especialista, { email }, { populate: ['especialidad', 'obrasSociales'] });
}

export async function sCreateEspecialista(input: EspecialistaInput): Promise<Especialista> {
  const especialista = orm.em.create(Especialista, {
    ...input,
    contrasena: await hashPassword(input.contrasena ?? ''),
  } as any);

  if (input.obras_sociales) {
  especialista.obrasSociales.set(
    input.obras_sociales.map((id) => orm.em.getReference(ObraSocial, id as any))
  );
}

  try {
    await orm.em.persistAndFlush(especialista);
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe un especialista con ese DNI, matrícula o email');
    }
    throw error;
  }
  return especialista;
}

export async function sUpdateEspecialista(
  cod_especialista: number,
  input: EspecialistaInput,
): Promise<Especialista | null> {
  const especialista = await orm.em.findOne(
    Especialista, 
    { cod_especialista }, 
    { populate: ['obrasSociales', 'especialidad'] }
  );

  if (!especialista) {
    return null;
  }

  especialista.matricula = input.matricula;
  especialista.dni = input.dni;
  especialista.nombre = input.nombre;
  especialista.email = input.email;
  especialista.telefono = input.telefono;
  
  // Asignar correctamente la especialidad usando getReference si viene en el input
  if (input.especialidad !== undefined) {
    especialista.especialidad = input.especialidad 
      ? orm.em.getReference(Especialidad, (input.especialidad as any).cod_especialidad || input.especialidad) 
      : null;
  }

  if (input.estado !== undefined) especialista.estado = input.estado;
  if (input.consulta_particular !== undefined) especialista.consulta_particular = input.consulta_particular;
  
  if (input.obras_sociales !== undefined) {
    especialista.obrasSociales.set(
      input.obras_sociales.map((id) => orm.em.getReference(ObraSocial, id as any))
    );
  }

  if (input.contrasena && input.contrasena.trim() !== '') {
    especialista.contrasena = await hashPassword(input.contrasena);
  }

  try {
    await orm.em.flush();
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe un especialista con ese DNI, matrícula o email');
    }
    throw error;
  }

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