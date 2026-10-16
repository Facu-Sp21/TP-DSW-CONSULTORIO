import { fechaDeHoy, motivoQueImpideCerrar } from '../src/turno/turno.estado.js';

describe('fechaDeHoy', () => {
  it('devuelve la fecha con formato YYYY-MM-DD y ceros a la izquierda', () => {
    expect(fechaDeHoy(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('motivoQueImpideCerrar', () => {
  const hoy = '2026-10-07';

  it('permite cerrar un turno pendiente de hoy', () => {
    expect(motivoQueImpideCerrar('PENDIENTE', '2026-10-07', hoy)).toBeUndefined();
  });

  it('permite cerrar un turno pendiente de un día anterior', () => {
    expect(motivoQueImpideCerrar('PENDIENTE', '2026-10-01', hoy)).toBeUndefined();
  });

  it('no permite cerrar un turno de una fecha futura', () => {
    expect(motivoQueImpideCerrar('PENDIENTE', '2026-10-08', hoy)).toMatch(/futura/);
  });

  it.each(['ATENDIDO', 'AUSENTE'] as const)('no permite cerrar un turno que ya está %s', (estado) => {
    expect(motivoQueImpideCerrar(estado, '2026-10-01', hoy)).toMatch(/ya fue atendido/);
  });
});