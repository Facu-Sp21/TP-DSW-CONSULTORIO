import { describe, expect, it } from 'vitest';
import { esHorarioPasado, tieneConflictoDeTurno } from '../turno';

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

describe('tieneConflictoDeTurno', () => {
  const turnos = [
    {
      fecha: '2026-10-30',
      hora_inicio: '09:00',
      cod_especialista: 2,
      nro_afiliado: 10,
      especialista: { cod_especialista: 2, especialidad: { duracion_minutos: 60 } },
      paciente: { nro_afiliado: 10 },
    },
  ];

  it('detecta el solapamiento del paciente aunque sea con otro especialista', () => {
    expect(tieneConflictoDeTurno('2026-10-30', '08:30', 45, 1, 10, turnos)).toBe(true);
  });

  it('permite un horario del paciente que empieza cuando termina su turno anterior', () => {
    expect(tieneConflictoDeTurno('2026-10-30', '10:00', 45, 1, 10, turnos)).toBe(false);
  });

  it('detecta el solapamiento del especialista con otro paciente', () => {
    expect(tieneConflictoDeTurno('2026-10-30', '09:30', 45, 2, 11, turnos)).toBe(true);
  });

  it('ignora turnos cancelados y fechas diferentes', () => {
    const cancelado = { ...turnos[0], estado: 'CANCELADO' };

    expect(tieneConflictoDeTurno('2026-10-30', '09:00', 45, 1, 10, [cancelado])).toBe(false);
    expect(tieneConflictoDeTurno('2026-10-31', '09:00', 45, 1, 10, turnos)).toBe(false);
  });
});
