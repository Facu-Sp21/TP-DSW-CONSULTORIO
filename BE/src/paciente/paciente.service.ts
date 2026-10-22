import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { alreadyExistsError } from '../shared/errorsModel.js';
import { hashPassword } from '../shared/auth/password.js';
import { Paciente } from './paciente.entity.js';
import { ObraSocial } from '../ObraSocial/obraSocial.entity.js';

type PacienteInput = {
  dni: string;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  contrasena?: string; // <-- Ahora es opcional
  cod_os?: number | null;
};

export async function sGetAllPacientes(): Promise<Paciente[]> {
  return await orm.em.find(Paciente, {}, { populate: ['obraSocial'] });
}

export async function sGetPacienteById(nro_afiliado: number): Promise<Paciente | null> {
  return await orm.em.findOne(Paciente, { nro_afiliado }, { populate: ['obraSocial'] });
}

// Usado internamente por el login, para comparar la contraseña
export async function sGetPacienteByEmail(email: string): Promise<Paciente | null> {
  return await orm.em.findOne(Paciente, { email });
}

export async function sCreatePaciente(input: PacienteInput): Promise<Paciente> {
  const obraSocial = input.cod_os
    ? await orm.em.findOne(ObraSocial, { cod_os: input.cod_os })
    : null;

  // Si no puso contraseña, autogeneramos una por defecto (ej: usamos su DNI o una clave genérica)
  const passwordPlana = (input.contrasena && input.contrasena.trim() !== '') 
    ? input.contrasena 
    : input.dni; // O podés poner una fija como '123456'

  const hashedPassword = await hashPassword(passwordPlana);

  const paciente = orm.em.create(Paciente, {
    dni: input.dni,
    nombre: input.nombre,
    telefono: input.telefono,
    direccion: input.direccion,
    email: input.email,
    obraSocial,
    contrasena: hashedPassword,
  });
  
  try {
    await orm.em.persistAndFlush(paciente);
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
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
  const paciente = await orm.em.findOne(Paciente, { nro_afiliado }, { populate: ['obraSocial'] });

  if (!paciente) {
    return null;
  }

  if (input.dni !== undefined) paciente.dni = input.dni;
  if (input.nombre !== undefined) paciente.nombre = input.nombre;
  if (input.telefono !== undefined) paciente.telefono = input.telefono;
  if (input.direccion !== undefined) paciente.direccion = input.direccion;
  if (input.email !== undefined) paciente.email = input.email;
  
  if (input.cod_os !== undefined) {
    paciente.obraSocial = input.cod_os
      ? await orm.em.findOne(ObraSocial, { cod_os: input.cod_os })
      : null;
  }

  if (input.contrasena && input.contrasena.trim() !== '') {
    paciente.contrasena = await hashPassword(input.contrasena);
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