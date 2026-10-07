import { especialidadBodySchema, especialidadParamsSchema } from '../src/especialidad/especialidad.schema.js';

describe('especialidadBodySchema', () => {
  it('acepta una especialidad con duración válida', () => {
    const result = especialidadBodySchema.safeParse({
      nombre: 'Psicología',
      duracion_minutos: 60,
    });

    expect(result.success).toBe(true);
  });

  it.each([
    { nombre: '', duracion_minutos: 15 },
    { nombre: 'Clínica', duracion_minutos: 0 },
    { nombre: 'Clínica', duracion_minutos: 15.5 },
    { nombre: 'Clínica', duracion_minutos: -10 },
  ])('rechaza datos inválidos: %o', (body) => {
    expect(especialidadBodySchema.safeParse(body).success).toBe(false);
  });
});

describe('especialidadParamsSchema', () => {
  it('convierte el parámetro a número', () => {
    const result = especialidadParamsSchema.safeParse({ cod_especialidad: '3' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cod_especialidad).toBe(3);
    }
  });

  it('rechaza un código no positivo', () => {
    expect(especialidadParamsSchema.safeParse({ cod_especialidad: '0' }).success).toBe(false);
  });
});