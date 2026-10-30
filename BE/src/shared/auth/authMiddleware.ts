import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload, Rol } from './jwt.js';
import { UnauthorizedError, ForbiddenError } from '../errorsModel.js';


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}


export function requireAuth(roles?: Rol[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no provisto');
    }

    const token = header.slice('Bearer '.length).trim();

    let payload: JwtPayload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new UnauthorizedError('Token inválido o expirado');
    }

    if (roles && roles.length > 0 && !roles.includes(payload.rol)) {
      throw new ForbiddenError('No tenés permiso para acceder a este recurso');
    }

    req.user = payload;
    next();
  };
}
