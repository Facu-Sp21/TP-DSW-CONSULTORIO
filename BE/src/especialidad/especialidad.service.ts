import { orm } from '../shared/db/orm.js';
import { Especialidad } from './especialidad.entity.js';
import { Especialista } from '../especialista/especialista.entity.js';
import { alreadyExistsError } from '../shared/errorsModel.js';

async function EspecialidadIsUnique(nombre: string, cod_especialidad?: number) {
  const especialidadExistente = await orm.em.findOne(Especialidad, { nombre });

  if (especialidadExistente && especialidadExistente.cod_especialidad !== cod_especialidad) {
    throw new alreadyExistsError('Ya existe una especialidad con ese nombre');
  }
}

export async function sGetAllEspecialidades(): Promise<Especialidad[]> {
  return await orm.em.find(Especialidad, {});
}

export async function sGetEspecialidadById(cod_especialidad: number): Promise<Especialidad | null> {
  return await orm.em.findOne(Especialidad, { cod_especialidad }); // como el atributo y el valor son iguales, se puede abreviar cod_especialidad
}

export async function sCreateEspecialidad(nombre: string, duracion_minutos: number): Promise<Especialidad> {
  await EspecialidadIsUnique(nombre);

  const especialidad = orm.em.create(Especialidad, { nombre, duracion_minutos });
  await orm.em.persistAndFlush(especialidad);
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

  await EspecialidadIsUnique(nombre, cod_especialidad);

  especialidad.nombre = nombre;
  especialidad.duracion_minutos = duracion_minutos;
  await orm.em.flush();

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
