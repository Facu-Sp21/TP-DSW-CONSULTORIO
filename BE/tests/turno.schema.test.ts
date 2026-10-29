import { turnoBodySchema } from '../src/turno/turno.schema.js';

describe('turnoBodySchema', () => {
  const body = (fecha: string, hora_inicio: string) => ({
    fecha,
    hora_inicio,
    nro_afiliado: 1,
    cod_especialista: 2,
  });

  it('acepta una fecha y hora válidas', () => {
    const result = turnoBodySchema.safeParse(body('2027-02-10', '14:30'));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fecha).toBe('2027-02-10');
      expect(result.data.hora_inicio).toBe('14:30');
    }
  });

  it.each([
    ['1920-11-10', '14:30'],
    ['2026-15-33', '14:30'],
    ['2026-02-29', '24:30'],
    ['2026-30-40', '14:30'],
    ['2026-12-01', '25:00'],
    ['2026-09-21', '14:50'],
    ['2026/12/01', '14:30'],
    ['2026-09-21', '19:30'], // esto deberia recha
  ])('rechaza una fecha u hora inválida: %s %s', (fecha, hora_inicio) => {
    expect(turnoBodySchema.safeParse(body(fecha, hora_inicio)).success).toBe(false);
  });
});
