import { especialistaBodySchema, especialistaParamsSchema } from '../src/especialista/especialista.schema.js';

describe('especialistaBodySchema', () => {
  const especialista = {
    matricula: 'MP-12345',
    nombre: 'Laura Gómez',
    email: 'laura@example.com',
    telefono: '3415551234',
    cod_especialidad: 1,
  };

  it('acepta un especialista válido', () => {
    expect(especialistaBodySchema.safeParse(especialista).success).toBe(true);
  });

  it.each([
    'matricula',
    'nombre',
    'telefono',
  ])('rechaza %s vacío', (campo) => {
    expect(especialistaBodySchema.safeParse({ ...especialista, [campo]: '' }).success).toBe(false); // esto es lo que se espera, que falle la validación si el campo está vacío
  });

  it('rechaza una especialidad inválida', () => {
    expect(especialistaBodySchema.safeParse({ ...especialista, cod_especialidad: 0 }).success).toBe(false);
  });
});

describe('especialistaParamsSchema', () => {
  it('convierte el código a número', () => {
    const result = especialistaParamsSchema.safeParse({ cod_especialista: '7' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cod_especialista).toBe(7);
    }
  });

  it('rechaza un código inválido', () => {
    expect(especialistaParamsSchema.safeParse({ cod_especialista: '-1' }).success).toBe(false);
  });
});
