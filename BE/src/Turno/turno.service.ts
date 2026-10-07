import {orm} from '../shared/db/orm.js';
import { Turno } from './turno.entity.js';
import { Afiliado } from '../Afiliado/afiliado.entity.js';
import { Especialista } from '../especialista/especialista.entity.js';
import {enviarCorreo} from '../Email/email.service.js';
import {mailFormatTurno} from '../Email/email.template.js';

type TurnoInput = {
  fecha: Date;
  hora: string;
  afiliado: Afiliado;
  especialista: Especialista;
}
export async function sCreateTurno(input: TurnoInput): Promise<Turno> {
  const turno = orm.em.create(Turno, input);
  orm.em.persist(turno);
  await orm.em.flush();
  //después de crear el turno, se envia el correo al afiliado
  await enviarCorreo(turno.afiliado.email,  "Confirmación de turno",mailFormatTurno(turno) );

  return turno;
}