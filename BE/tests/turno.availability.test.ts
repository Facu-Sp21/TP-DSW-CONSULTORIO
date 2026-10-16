import { chocaEnMinutos, generarSlots, horaAMinutos } from '../src/turno/turno.availability.js';
import { sCreateTurno, sGetHorariosDisponibles, sGetTurnos } from '../src/turno/turno.service.js';
import { orm } from '../src/shared/db/orm.js';
import { esDiaLaboral, esTurnoValido } from '../src/turno/turno.calendar.js';
import { generarHorariosDelDia, validarHorarioTurno } from '../src/turno/turno.schedule.js';

jest.mock('../src/shared/db/orm.js', () => ({
  orm: {
    em: {
      find: jest.fn(),
      create: jest.fn((entity, data) => ({ ...data })),
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

const crearTurno = (fecha: string, hora: string, paciente = 10, especialista = 1, duracion = 60) => ({
  fecha,
  hora_inicio: hora,
  paciente: { nro_afiliado: paciente } as any,
  especialista: { cod_especialista: especialista, especialidad: { duracion_minutos: duracion } } as any,
});

describe('chocaEnMinutos', () => {
  it('rechaza un turno dentro de la duración de otro', () => {
    expect(chocaEnMinutos(10 * 60 + 15, 10 * 60 + 30, 10 * 60, 11 * 60)).toBe(true); // A = [10:15, 10:30], B = [10:00, 11:00] -> true
  });

  it('permite un turno exactamente cuando termina el anterior', () => {
    expect(chocaEnMinutos(11 * 60, 11 * 60 + 15, 10 * 60, 11 * 60)).toBe(false); // A = [11:00, 11:15], B = [10:00, 11:00] -> false
  });
});

describe('generarSlots', () => {
  it('genera slots de acuerdo a la duración', () => {
    expect(generarSlots('08:00', '10:00', 30)).toEqual(['08:00', '08:30', '09:00', '09:30']);
  });
});

describe('sCreateTurno', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-01T09:00:00'));
    jest.clearAllMocks();
  });

  afterAll(() => jest.useRealTimers());

  it('permite dos turnos de especialistas distintos en el mismo horario', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([]);

    await expect(sCreateTurno(crearTurno('2026-08-03', '10:00', 10, 1))).resolves.toBeDefined();
  });

  it('rechaza dos turnos solapados para el mismo paciente', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([
      {
        cod_turno: 7,
        fecha: '2026-08-29',
        hora_inicio: '10:00',
        especialista: { cod_especialista: 3, especialidad: { duracion_minutos: 60 } },
        paciente: { nro_afiliado: 10 },
      },
    ]);

    await expect(sCreateTurno(crearTurno('2026-08-03', '10:30', 10, 2, 30))).rejects.toThrow(
      'El paciente ya tiene un turno asignado en ese horario',
    );
  });

  it('rechaza dos turnos solapados del mismo especialista', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([
      {
        cod_turno: 7,
        fecha: '2026-08-29',
        hora_inicio: '10:00',
        duracion_minutos: 60,
        especialista: { cod_especialista: 1, especialidad: { duracion_minutos: 60 } },
        paciente: { nro_afiliado: 11 },
      },
    ]);

    await expect(sCreateTurno(crearTurno('2026-08-03', '10:30', 11, 1, 30))).rejects.toThrow(
      'El especialista ya tiene un turno asignado en ese horario',
    );
  });

  it('permite al paciente reservar con otro especialista en el mismo horario', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([]);

    await expect(sCreateTurno(crearTurno('2026-08-03', '10:00', 10, 2))).resolves.toBeDefined();
  });

  it('rechaza turnos fuera del horario de atención del consultorio', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([]);

    await expect(sCreateTurno(crearTurno('2026-08-03', '17:30', 10, 1))).rejects.toThrow(
      'El horario debe coincidir con la duración de la consulta y estar dentro de la atención de 08:00 a 17:00',
    );
  });

  it('rechaza turnos que no coinciden con la grilla del especialista', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([]);

    await expect(sCreateTurno(crearTurno('2026-08-03', '08:37'))).rejects.toThrow(
      'El horario debe coincidir con la duración de la consulta y estar dentro de la atención de 08:00 a 17:00',
    );
  });
});

describe('reglas de calendario y horarios', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-01T09:00:00'));
  });

  afterAll(() => jest.useRealTimers());

  it('genera horarios según la duración y sin superar el horario de cierre', () => {
    const horarios = generarHorariosDelDia('2026-08-03', 60);

    expect(horarios).toHaveLength(9);
    expect(horarios[0]).toBe('08:00');
    expect(horarios.at(-1)).toBe('16:00');
  });

  it('rechaza horarios fuera de la grilla y fechas no reservables', () => {
    expect(() => validarHorarioTurno('2026-08-03', '08:15', 30)).toThrow('debe coincidir');
    expect(() => validarHorarioTurno('2026-08-03', '17:00', 30)).toThrow('debe coincidir');
    expect(() => validarHorarioTurno('2026-12-26', '08:00', 30)).toThrow('lunes a viernes');
    expect(() => validarHorarioTurno('2027-02-02', '08:00', 30)).toThrow('seis meses');
  });

  it('identifica días laborales válidos e inválidos', () => {
    expect(esDiaLaboral('2026-08-03')).toBe(true);
    expect(esDiaLaboral('2026-12-25')).toBe(true);
    expect(esTurnoValido('2026-08-03', '10:00', 60)).toBe(true);
    expect(esTurnoValido('2026-08-03', '16:30', 60)).toBe(false);
  });
});

describe('sGetHorariosDisponibles', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-01T09:00:00'));
    jest.clearAllMocks();
  });

  afterAll(() => jest.useRealTimers());

  it('omite los horarios que ya están ocupados', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([
      {
        cod_turno: 8,
        fecha: '2026-08-03',
        hora_inicio: '09:00',
        especialista: { cod_especialista: 1, especialidad: { duracion_minutos: 60 } },
      },
    ]);

    const horarios = await sGetHorariosDisponibles('2026-08-03', {
      cod_especialista: 1,
      especialidad: { duracion_minutos: 60 },
    } as any);

    expect(horarios).toEqual(['08:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']);
  });
});

describe('sGetTurnos', () => {
  it('filtra los turnos por paciente y especialista', async () => {
    (orm.em.find as jest.Mock).mockResolvedValue([]);

    await sGetTurnos({ nro_afiliado: 10, cod_especialista: 2 });

    expect(orm.em.find).toHaveBeenCalledWith(
      expect.anything(),
      { paciente: 10, especialista: 2 },
      { populate: ['paciente', 'especialista'] },
    );
  });
});
