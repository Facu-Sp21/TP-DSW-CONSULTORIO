import { orm } from '../shared/db/orm.js';
import { Especialidad } from './especialidad.entity.js';

export async function sGetAllEspecialidades(): Promise<Especialidad[]> {
  return await orm.em.find(Especialidad, {});
}

export async function sGetEspecialidadById(cod_especialidad: number): Promise<Especialidad | null> {
  return await orm.em.findOne(Especialidad, { cod_especialidad }); // como el atributo y el valor son iguales, se puede abreviar cod_especialidad
}

export async function sCreateEspecialidad(nombre: string): Promise<Especialidad> {
  const especialidad = orm.em.create(Especialidad, { nombre });
  await orm.em.persistAndFlush(especialidad);
  return especialidad;
}

export async function sUpdateEspecialidad(cod_especialidad: number,nombre: string): Promise<Especialidad | null> {
  const especialidad = await orm.em.findOne(Especialidad, { cod_especialidad });

  if (!especialidad) {
    return null;
  }

  especialidad.nombre = nombre;
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