import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { Especialidad } from './especialidad.entity.js';
import { Especialista } from '../especialista/especialista.entity.js';
import { alreadyExistsError } from '../shared/errorsModel.js';

export async function sGetAllEspecialidades(): Promise<Especialidad[]> {
  return await orm.em.find(Especialidad, {});
}

export async function sGetEspecialidadById(cod_especialidad: number): Promise<Especialidad | null> {
  return await orm.em.findOne(Especialidad, { cod_especialidad }); // como el atributo y el valor son iguales, se puede abreviar cod_especialidad
}

export async function sCreateEspecialidad(nombre: string, duracion_minutos: number): Promise<Especialidad> {
  const especialidad = orm.em.create(Especialidad, { nombre, duracion_minutos });
  try {
    await orm.em.persistAndFlush(especialidad);
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe una especialidad con ese nombre');
    }
    throw error;
  }
  return especialidad;
}

export async function sUpdateEspecialidad(
  cod_especialidad: number,
  nombre: string,
  duracion_minutos: number,
): Promise<Especialidad | null> {
  const especialidad = await orm.em.findOne(Especialidad, { cod_especialidad });

  if (!especialidad) {
    return null;
  }

  especialidad.nombre = nombre;
  especialidad.duracion_minutos = duracion_minutos;
  try {
    await orm.em.flush();
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      throw new alreadyExistsError('Ya existe una especialidad con ese nombre');
    }
    throw error;
  }

  return especialidad;
}

export async function sDeleteEspecialidad(cod_especialidad: number): Promise<boolean> {
  const especialidad = await orm.em.findOne(Especialidad, { cod_especialidad });

  if (!especialidad) {
    return false;
  }

  await orm.em.removeAndFlush(especialidad); 
  return true;
}

export async function sGetEspecialistasByEspecialidad(cod_especialidad: number): Promise<Especialista[]> {
  return await orm.em.find(Especialista, { especialidad: { cod_especialidad } });
}
