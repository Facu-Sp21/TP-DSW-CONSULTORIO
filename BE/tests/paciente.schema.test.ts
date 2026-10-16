import { pacienteBodySchema } from '../src/paciente/paciente.schema.js';

describe('pacienteBodySchema', () => {
  const paciente = {
    dni: '40111222',
    nombre: 'Ana Perez',
    telefono: '3415551234',
    direccion: 'Calle 123',
    email: 'ana@example.com',
    contrasena: 'secreto',
  };

  it('acepta un paciente válido', () => {
    expect(pacienteBodySchema.safeParse(paciente).success).toBe(true);
  });

  it('rechaza un email inválido', () => {
    expect(pacienteBodySchema.safeParse({ ...paciente, email: 'no-es-un-email' }).success).toBe(false);
  });

  it.each([
    'dni',
    'nombre',
    'telefono',
    'direccion',
    'contrasena',
  ])('rechaza %s vacío', (campo) => {
    expect(pacienteBodySchema.safeParse({ ...paciente, [campo]: '' }).success).toBe(false);
  });
});
