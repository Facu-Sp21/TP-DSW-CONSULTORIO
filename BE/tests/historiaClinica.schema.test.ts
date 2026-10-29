import { atenderTurnoBodySchema, historiaQuerySchema } from '../src/historiaClinica/historiaClinica.schema.js';

describe('atenderTurnoBodySchema', () => {
  it('acepta un diagnóstico con indicaciones', () => {
    const result = atenderTurnoBodySchema.safeParse({ diagnostico: 'Faringitis viral', indicaciones: 'Reposo' });
    expect(result.success).toBe(true);
  });

  it('las indicaciones son opcionales', () => {
    expect(atenderTurnoBodySchema.safeParse({ diagnostico: 'Faringitis viral' }).success).toBe(true);
  });

  it('elimina espacios sobrantes del diagnóstico', () => {
    const result = atenderTurnoBodySchema.safeParse({ diagnostico: '   Faringitis   ' });
    expect(result.success && result.data.diagnostico).toBe('Faringitis');
  });

  it.each([{}, { diagnostico: '' }, { diagnostico: 'ab' }, { diagnostico: '   ' }])(
    'rechaza un diagnóstico faltante o demasiado corto: %j',
    (body) => {
      expect(atenderTurnoBodySchema.safeParse(body).success).toBe(false);
    },
  );
});

describe('historiaQuerySchema', () => {
  it('convierte el número de afiliado de texto a número', () => {
    const result = historiaQuerySchema.safeParse({ nro_afiliado: '3' });
    expect(result.success && result.data.nro_afiliado).toBe(3);
  });

  it.each([{}, { nro_afiliado: '0' }, { nro_afiliado: 'abc' }])('rechaza un número de afiliado inválido: %j', (query) => {
    expect(historiaQuerySchema.safeParse(query).success).toBe(false);
  });
});