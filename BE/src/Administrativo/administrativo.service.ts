import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { alreadyExistsError } from '../shared/errorsModel.js';
import { hashPassword } from '../shared/auth/password.js';
import { Administrativo } from './administrativo.entity.js';

type AdministrativoInput = {
  nombreCompleto: string;
  legajo: string;
  email: string;
  password?: string;
};

export async function sGetAllAdministrativos(): Promise<Administrativo[]> {
  return await orm.em.find(Administrativo, {});
}

export async function sGetAdministrativoById(id: number): Promise<Administrativo | null> {
  return await orm.em.findOne(Administrativo, { id });
}

// Usado internamente por el login, para comparar la contraseña
export async function sGetAdministrativoByEmail(email: string): Promise<Administrativo | null> {
  return await orm.em.findOne(Administrativo, { email });
}

export async function sCreateAdministrativo(input: AdministrativoInput): Promise<Administrativo> {
  if (!input.password) {
    throw new alreadyExistsError('La contraseña es obligatoria para crear un administrativo');
  }

  const administrativo = orm.em.create(Administrativo, {
    nombreCompleto: input.nombreCompleto,
    legajo: input.legajo,
    email: input.email,
    password: await hashPassword(input.password),
  });

  try {
    await orm.em.persistAndFlush(administrativo);
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe un administrativo con ese legajo o email');
    }
    throw error;
  }

  return administrativo;
}

export async function sUpdateAdministrativo(
  id: number,
  input: Partial<AdministrativoInput>,
): Promise<Administrativo | null> {
  const administrativo = await orm.em.findOne(Administrativo, { id });

  if (!administrativo) {
    return null;
  }

  if (input.nombreCompleto !== undefined) administrativo.nombreCompleto = input.nombreCompleto;
  if (input.legajo !== undefined) administrativo.legajo = input.legajo;
  if (input.email !== undefined) administrativo.email = input.email;

  if (input.password && input.password.trim() !== '') {
    administrativo.password = await hashPassword(input.password);
  }

  try {
    await orm.em.flush();
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe un administrativo con ese legajo o email');
    }
    throw error;
  }

  return administrativo;
}

export async function sDeleteAdministrativo(id: number): Promise<boolean> {
  const administrativo = await orm.em.findOne(Administrativo, { id });

  if (!administrativo) {
    return false;
  }

  await orm.em.removeAndFlush(administrativo);
  return true;
}
