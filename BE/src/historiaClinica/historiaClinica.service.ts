import { orm } from '../shared/db/orm.js';
import { HistoriaClinica } from './historiaClinica.entity.js';
import { Paciente }  from '../paciente/paciente.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { Especialista } from '../especialista/especialista.entity.js';
import { NotFoundError } from '@mikro-orm/core';

type hcInput ={
  cod_turno: number,
  diagnostico: string,
  indicaciones?: string,
}

/** Consultas anteriores de un paciente, de la más nueva a la más vieja. */
export async function sGetHistoriaDePaciente(nro_afiliado: number){
  return await orm.em.find(
    HistoriaClinica,
    { paciente: { nro_afiliado } },
    {
      // 'paciente' NO se carga a propósito: así la respuesta no incluye sus datos (como la contraseña)
      populate: ['turno', 'especialista'],
      // el especialista sí se carga (para mostrar su nombre), pero sin su contraseña
      exclude: ['especialista.contrasena'],
      orderBy: { turno: { fecha: 'desc', hora_inicio: 'desc' } },
    },
  );
}

export async function sCreateHistoriaDePaciente(input: hcInput): Promise<HistoriaClinica>{

  const turno = await orm.em.findOne(Turno, {cod_turno: input.cod_turno})
  if( !turno ) throw new NotFoundError('Turno no encontrado');

  const hc = orm.em.create(HistoriaClinica,{paciente:turno.paciente,especialista:turno.especialista,turno, diagnostico: input.diagnostico, indicaciones:input.indicaciones});
  orm.em.persist(hc);
  await orm.em.flush();
  return hc;

}