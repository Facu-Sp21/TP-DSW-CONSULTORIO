import { describe, expect, it } from 'vitest';
import { esHorarioPasado } from '../turno';

describe('esHorarioPasado', () => {
  const ahora = new Date(2026, 9, 29, 16, 22);

  it('identifica como pasados los horarios de fechas anteriores', () => {
    expect(esHorarioPasado('2026-10-28', '17:00', ahora)).toBe(true);
  });

  it('oculta los horarios anteriores o iguales a la hora actual del día', () => {
    expect(esHorarioPasado('2026-10-29', '16:00', ahora)).toBe(true);
    expect(esHorarioPasado('2026-10-29', '16:22', ahora)).toBe(true);
  });

  it('mantiene disponibles los horarios futuros', () => {
    expect(esHorarioPasado('2026-10-29', '16:30', ahora)).toBe(false);
    expect(esHorarioPasado('2026-10-30', '08:00', ahora)).toBe(false);
  });
});
