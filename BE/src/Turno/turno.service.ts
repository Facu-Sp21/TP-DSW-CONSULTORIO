import {orm} from '../shared/db/orm.js';
import { Turno } from './turno.entity.js';
import { Afiliado } from '../Afiliado/afiliado.entity.js';
import { Especialista } from '../especialista/especialista.entity.js';
import {enviarCorreo} from '../Email/email.service.js';

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
  await enviarCorreo(turno.afiliado.email, "Confirmación de turno",
  `<p>Estimado/a ${turno.afiliado.nombreCompleto}:</p>
  <br/>
  <p> Le informamos que su turno ha sido confirmado 
  para el día <strong>${turno.fecha}</strong> 
  a las <strong>${turno.hora}</strong> 
  con el especialista <strong>${turno.especialista.nombre}</strong>.</p>
  
  <p><strong>Importante:</strong></p>
  <p>En caso de no poder asistir  le rogamos se comunique a los teléfonos  (0341)xxx xxx/xx (0341) xxx xxxx/xx o  Whatsapp Turnos: +54 x xxx xxxxxxxx</p>
  </br>
  <p>Gracias por elegirnos.</p>`);

  return turno;
}