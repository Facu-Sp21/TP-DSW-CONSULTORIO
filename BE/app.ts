import express from 'express';
import especialidadRoutes from './src/Especialidad/routes.js';
import { errorHandler } from './src/shared/errorHandler.js';


const app = express();
app.use(express.json());

app.use('/Especialidad', especialidadRoutes);

app.use(errorHandler);


export { app };