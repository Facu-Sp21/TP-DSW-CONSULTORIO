import 'reflect-metadata';
import { orm, syncSchema } from './src/shared/db/orm.js';
import express from 'express';
import cors from 'cors';

import especialidadRoutes from './src/especialidad/especialidad.routes.js';
import especialistaRoutes from './src/especialista/especialista.routes.js';
import afiliadoRoutes from './src/Afiliado/routes.js';
import { errorHandler } from './src/shared/errorHandler.js';
import { RequestContext } from '@mikro-orm/core';
import { apiReference } from '@scalar/express-api-reference';
import { openApiDocument } from './src/shared/openapi.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});

app.use('/especialidad', especialidadRoutes);
app.use('/especialista', especialistaRoutes);
app.use('/afiliado', afiliadoRoutes);

app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument);
});

app.use(
    '/docs',
    apiReference({
        theme: 'alternate',
        spec: {
            url: '/openapi.json',
        },
    }),
);

app.use(errorHandler);

await syncSchema();

export { app };
