import 'reflect-metadata';
import {orm, syncSchema} from './src/shared/db/orm.js';
import express from 'express';
import especialidadRoutes from './src/especialidad/especialidad.routes.js';
import especialistaRoutes from './src/especialista/especialista.routes.js';
import { errorHandler } from './src/shared/errorHandler.js';
import { RequestContext } from '@mikro-orm/core';
import { apiReference } from '@scalar/express-api-reference';
import { openApiDocument } from './src/shared/openapi.js';


const app = express();
app.use(express.json());

app.use((req, res, next) => { // esto es para que cada request tenga su propio contexto de la base de datos, para que no se mezclen las transacciones
    RequestContext.create(orm.em, next);
});

app.use('/especialidad', especialidadRoutes);
app.use('/especialista', especialistaRoutes);

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

await syncSchema(); // esto es para sincronizar la base de datos con las entidades, solo usar en desarrollo

export { app };
