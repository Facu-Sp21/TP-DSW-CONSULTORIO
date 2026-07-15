import express from 'express';
import especialidadRoutes from './src/Especialidad/routes.js';
import afiliadoRoutes from './src/Afiliado/routes.js';
import { errorHandler } from './src/shared/errorHandler.js';

const app = express();
app.use(express.json());

// Tus rutas conectadas
app.use('/Especialidad', especialidadRoutes);
app.use('/Afiliado', afiliadoRoutes);

app.use(errorHandler);

export { app };