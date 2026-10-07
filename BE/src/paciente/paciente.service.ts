import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { alreadyExistsError } from '../shared/errorsModel.js';
import { Paciente } from './paciente.entity.js';

type PacienteInput = {
  dni: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  contrasena: string;
  cod_os?: number | null;
};

export async function sGetAllPacientes(): Promise<Paciente[]> {
  return await orm.em.find(Paciente, {});
}

export async function sGetPacienteById(nro_afiliado: number): Promise<Paciente | null> {
  return await orm.em.findOne(Paciente, { nro_afiliado });
}

export async function sCreatePaciente(input: PacienteInput): Promise<Paciente> {
  const paciente = orm.em.create(Paciente, input);
  try {
    await orm.em.persistAndFlush(paciente);
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) { // ese error es de MikroORM y se lanza cuando se viola una restricción de unicidad en la base de datos
      throw new alreadyExistsError('Ya existe un paciente con ese DNI o email');  
    }
    throw error;
  }
  return paciente;
}

export async function sUpdatePaciente(
  nro_afiliado: number, 
  input: Partial<PacienteInput>
): Promise<Paciente | null> {
  const paciente = await orm.em.findOne(Paciente, { nro_afiliado });

  if (!paciente) {
    return null;
  }

  if (input.dni !== undefined) paciente.dni = input.dni;
  if (input.nombre !== undefined) paciente.nombre = input.nombre;
  if (input.telefono !== undefined) paciente.telefono = input.telefono;
  if (input.direccion !== undefined) paciente.direccion = input.direccion;
  if (input.email !== undefined) paciente.email = input.email;
  if (input.cod_os !== undefined) paciente.cod_os = input.cod_os ?? null;

  if (input.contrasena && input.contrasena.trim() !== '') {
    paciente.contrasena = input.contrasena;
  }

  try {
    await orm.em.flush();
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe un paciente con ese DNI o email');
    }
    throw error;
  }

  return paciente;
}

export async function sDeletePaciente(nro_afiliado: number): Promise<boolean> {
  const paciente = await orm.em.findOne(Paciente, { nro_afiliado });

  if (!paciente) {
    return false;
  }

  await orm.em.removeAndFlush(paciente);
  return true;
}
