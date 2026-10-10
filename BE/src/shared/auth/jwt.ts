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
