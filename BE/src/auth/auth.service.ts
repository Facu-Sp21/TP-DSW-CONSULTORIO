import { comparePassword } from '../shared/auth/password.js';
import { signToken, JwtPayload } from '../shared/auth/jwt.js';
import { UnauthorizedError } from '../shared/errorsModel.js';
import { sGetAdministrativoByEmail } from '../Administrativo/administrativo.service.js';
import { sGetEspecialistaByEmail } from '../especialista/especialista.service.js';
import { sGetPacienteByEmail } from '../paciente/paciente.service.js';

export interface LoginResult {
  token: string;
  user: JwtPayload;
}

/**
 * Busca el email en Administrativo, Especialista y Paciente (en ese orden) y
 * valida la contraseña contra el que lo encuentre primero.
 *
 * Nota: como las 3 tablas son independientes, si el mismo email estuviera
 * registrado en más de una, siempre va a loguear con el primero que encuentre
 * en ese orden. Para este proyecto no debería pasar en la práctica.
 */
export async function sLogin(email: string, password: string): Promise<LoginResult> {
  const emailNormalizado = email.trim().toLowerCase();

  const administrativo = await sGetAdministrativoByEmail(emailNormalizado);
  if (administrativo) {
    const esValida = await comparePassword(password, administrativo.password);
    if (!esValida) throw new UnauthorizedError('Email o contraseña incorrectos');

    const payload: JwtPayload = {
      id: administrativo.id,
      email: administrativo.email,
      nombre: administrativo.nombreCompleto,
      legajo: administrativo.legajo,
      rol: 'administrativo',
    };
    return { token: signToken(payload), user: payload };
  }

  const especialista = await sGetEspecialistaByEmail(emailNormalizado);
  if (especialista) {
    const esValida = await comparePassword(password, especialista.contrasena);
    if (!esValida) throw new UnauthorizedError('Email o contraseña incorrectos');

    const payload: JwtPayload = {
      id: especialista.cod_especialista,
      email: especialista.email,
      nombre: especialista.nombre,
      rol: 'especialista',
    };
    return { token: signToken(payload), user: payload };
  }

  const paciente = await sGetPacienteByEmail(emailNormalizado);
  if (paciente) {
    const esValida = await comparePassword(password, paciente.contrasena);
    if (!esValida) throw new UnauthorizedError('Email o contraseña incorrectos');

    const payload: JwtPayload = {
      id: paciente.nro_afiliado,
      email: paciente.email,
      nombre: paciente.nombre,
      rol: 'paciente',
    };
    return { token: signToken(payload), user: payload };
  }

  // No revelamos si el email existe o no, por seguridad
  throw new UnauthorizedError('Email o contraseña incorrectos');
}
