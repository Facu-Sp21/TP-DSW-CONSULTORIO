import { Router, Request, Response } from 'express';
import z from 'zod';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/schemaValidator.js';
import { Suscripcion } from './suscripcion.entity.js';
import { alreadyExistsError } from '../shared/errorsModel.js';

const router = Router();

const suscripcionBodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Ingresá un correo electrónico válido').max(120),
});

router.post('/', validate({ body: suscripcionBodySchema }), async (_req: Request, res: Response) => {
  const { email } = res.locals.body;

  if (await orm.em.findOne(Suscripcion, { email })) {
    throw new alreadyExistsError('Ese correo ya está suscripto a las novedades');
  }

  const suscripcion = orm.em.create(Suscripcion, { email });
  await orm.em.persistAndFlush(suscripcion);
  res.status(201).json({ message: '¡Listo! Te suscribiste a las novedades.' });
});

export default router;