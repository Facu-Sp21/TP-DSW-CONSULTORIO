import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload, Rol } from './jwt.js';
import { UnauthorizedError, ForbiddenError } from '../errorsModel.js';

// Esto le "agrega" a Express un campo req.user con el tipo JwtPayload,
// para que TypeScript no se queje al usar req.user en los controllers.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware que valida el header "Authorization: Bearer <token>".
 * Si se le pasa una lista de roles, además verifica que el usuario
 * logueado tenga uno de esos roles.
 *
 * Uso:
 *   router.get('/', requireAuth(), controller)              // cualquier usuario logueado
 *   router.get('/', requireAuth(['administrativo']), ctrl)  // solo administrativos
 */
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
