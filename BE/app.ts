import express from 'express';
import especialidadRoutes from './src/Especialidad/routes.js';
import afiliadoRoutes from './src/Afiliado/routes.js';
import administrativoRoutes from './src/Administrativo/routes.js';
import { errorHandler } from './src/shared/errorHandler.js';

const app = express();
app.use(express.json());

// Tus rutas conectadas
app.use('/Especialidad', especialidadRoutes);
app.use('/Afiliado', afiliadoRoutes);
app.use('/Administrativo', administrativoRoutes);

app.use(errorHandler);

export { app };