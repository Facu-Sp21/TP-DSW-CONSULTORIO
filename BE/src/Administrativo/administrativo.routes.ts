import { Router } from 'express';
import {
  cCreateAdministrativo,
  cDeleteAdministrativo,
  cGetAllAdministrativos,
  cGetAdministrativoById,
  cUpdateAdministrativo,
} from './administrativo..controller.js';
import { validate } from '../shared/schemaValidator.js';
import { administrativoBodySchema, administrativoParamsSchema } from './administrativo.schema.js';
import { requireAuth } from '../shared/auth/authMiddleware.js';

const administrativoRouter = Router();

// Crear un nuevo administrativo: solo un administrativo ya logueado puede dar de alta a otro.
// (el primer administrativo del sistema hay que cargarlo a mano en la base de datos, una sola vez)
administrativoRouter.post(
  '/',
  requireAuth(['administrativo']),
  validate({ body: administrativoBodySchema }),
  cCreateAdministrativo,
);

administrativoRouter.get('/', requireAuth(['administrativo']), cGetAllAdministrativos);

administrativoRouter.get(
  '/:id',
  requireAuth(['administrativo']),
  validate({ params: administrativoParamsSchema }),
  cGetAdministrativoById,
);

administrativoRouter.put(
  '/:id',
  requireAuth(['administrativo']),
  validate({ body: administrativoBodySchema, params: administrativoParamsSchema }),
  cUpdateAdministrativo,
);

administrativoRouter.delete(
  '/:id',
  requireAuth(['administrativo']),
  validate({ params: administrativoParamsSchema }),
  cDeleteAdministrativo,
);

export default administrativoRouter;
