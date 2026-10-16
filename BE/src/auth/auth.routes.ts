import { Router } from 'express';
import { cLogin, cMe } from './auth.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { loginBodySchema } from './auth.schema.js';
import { requireAuth } from '../shared/auth/authMiddleware.js';

const authRouter = Router();

authRouter.post('/login', validate({ body: loginBodySchema }), cLogin);
authRouter.get('/me', requireAuth(), cMe);

export default authRouter;
