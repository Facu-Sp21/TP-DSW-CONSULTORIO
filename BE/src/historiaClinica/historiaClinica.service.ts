import { orm } from '../shared/db/orm.js';
import { HistoriaClinica } from './historiaClinica.entity.js';

/** Consultas anteriores de un paciente, de la más nueva a la más vieja. */
export async function sGetHistoriaDePaciente(nro_afiliado: number) {
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