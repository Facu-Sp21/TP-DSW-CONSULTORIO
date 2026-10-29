import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { orm } from '../shared/db/orm.js';
import { Especialidad } from './especialidad.entity.js';
import { Especialista } from '../especialista/especialista.entity.js';
import { alreadyExistsError } from '../shared/errorsModel.js';

export async function sGetAllEspecialidades(estado?:number): Promise<Especialidad[]> {
  const filter = estado === 1? {estado : true} : {};
  return await orm.em.find(Especialidad,filter ,{});
}

export async function sGetEspecialidadById(cod_especialidad: number): Promise<Especialidad | null> {
  return await orm.em.findOne(Especialidad, { cod_especialidad });
}

export async function sCreateEspecialidad(
  nombre: string,
  duracion_minutos: number,
  estado = true,
): Promise<Especialidad> {
  if (duracion_minutos % 5 !== 0) {
    throw new Error('La duración en minutos debe ser un múltiplo de 5.');
  }

  const especialidad = orm.em.create(Especialidad, { nombre, duracion_minutos, estado });
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
  estado?: boolean,
): Promise<Especialidad | null> {
  if (duracion_minutos % 5 !== 0) {
    throw new Error('La duración en minutos debe ser un múltiplo de 5.');
  }

  const especialidad = await orm.em.findOne(Especialidad, { cod_especialidad });

  if (!especialidad) {
    return null;
  }

  especialidad.nombre = nombre;
  especialidad.duracion_minutos = duracion_minutos;
  if (estado !== undefined) especialidad.estado = estado;
  
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
