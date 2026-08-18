import 'reflect-metadata';
import {orm, syncSchema} from './src/shared/db/orm.js';
import express from 'express';
import especialidadRoutes from './src/Especialidad/routes.js';
import { errorHandler } from './src/shared/errorHandler.js';
import { RequestContext } from '@mikro-orm/core';


const app = express();
app.use(express.json());

app.use((req, res, next) => { // esto es para que cada request tenga su propio contexto de la base de datos, para que no se mezclen las transacciones
    RequestContext.create(orm.em, next);
});

app.use('/Especialidad', especialidadRoutes);

app.use(errorHandler);

await syncSchema(); // esto es para sincronizar la base de datos con las entidades, solo usar en desarrollo

export { app };