import express from 'express';
import type { AddressInfo } from 'node:net';
import pacienteRoutes from '../src/paciente/paciente.routes.js';
import { orm } from '../src/shared/db/orm.js';
import { errorHandler } from '../src/shared/errorHandler.js';

jest.mock('../src/shared/db/orm.js', () => ({
  orm: {
    em: {
      create: jest.fn((_entity: unknown, data: Record<string, unknown>) => ({ ...data })),
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    },
  },
}));

describe('integración HTTP de pacientes', () => {
  const app = express();
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;

  beforeAll(async () => {
    app.use(express.json());
    app.use('/paciente', pacienteRoutes);
    app.use(errorHandler);

    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => resolve());
    });

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (orm.em.persistAndFlush as jest.Mock).mockResolvedValue(undefined);
  });

  it('registra un paciente válido y responde con HTTP 201', async () => {
    const response = await fetch(`${baseUrl}/paciente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dni: '40111222',
        nombre: 'Ana Perez',
        telefono: '3415551234',
        direccion: 'Calle 123',
        email: 'ana@example.com',
        contrasena: 'secreto',
      }),
    });
    const paciente = await response.json();

    expect(response.status).toBe(201);
    expect(paciente).toMatchObject({
      dni: '40111222',
      nombre: 'Ana Perez',
      email: 'ana@example.com',
    });
    expect(orm.em.persistAndFlush).toHaveBeenCalledTimes(1);
  });

  it('rechaza un paciente inválido con HTTP 400 sin persistirlo', async () => {
    const response = await fetch(`${baseUrl}/paciente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dni: '',
        nombre: 'Ana Perez',
        telefono: '3415551234',
        direccion: 'Calle 123',
        email: 'email-invalido',
        contrasena: 'secreto',
      }),
    });
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.message).toBe('Validation error');
    expect(orm.em.persistAndFlush).not.toHaveBeenCalled();
  });
});
