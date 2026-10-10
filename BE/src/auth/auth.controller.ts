import { Request, Response } from 'express';
import { sLogin } from './auth.service.js';

export async function cLogin(req: Request, res: Response) {
  const { email, password } = res.locals.body;
  const resultado = await sLogin(email, password);
  res.json(resultado);
}

// Devuelve los datos del usuario logueado a partir del token.
// Útil para que el frontend valide la sesión al recargar la página.
export async function cMe(req: Request, res: Response) {
  res.json(req.user);
}
