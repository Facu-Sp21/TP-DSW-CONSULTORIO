import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tp-consultorio-dev-secret-cambiar-en-produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

export type Rol = 'paciente' | 'especialista' | 'administrativo';

export interface JwtPayload {
  id: number;
  email: string;
  nombre: string;
  legajo?: string;
  rol: Rol;
}

//toma los datos y los firma (payload, jwtPayLoad es la info que se guarda en el token)
//payload es el contenido del token
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

//toma el token y lo verifica, devolviendo el payload 
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

//token para confirmar el turno


export interface TokenGestionTurnoPayload {
  tipo: 'gestion-turno';
  cod_turno: number;
}

export function signTokenGestionTurno(cod_turno: number): string {
  return jwt.sign({tipo: 'gestion-turno',cod_turno},JWT_SECRET,{ expiresIn: '48h' } as jwt.SignOptions);
}

export function verifyTokenGestionTurno(token: string): TokenGestionTurnoPayload 
{
  const payload = jwt.verify(token,JWT_SECRET) as TokenGestionTurnoPayload;
  if (payload.tipo !== 'gestion-turno') 
  {
    throw new Error('Token inválido para la gestión del turno');
  }
  return payload;
}
