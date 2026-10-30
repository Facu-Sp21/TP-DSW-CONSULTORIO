import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { getEspecialidades } from '../../../services/especialidadService';
import { getEspecialistasByEspecialidad } from '../../../services/especialistaService';
import { getPacienteById } from '../../../services/pacienteService';
import { getHorariosDisponibles, getTurnosPaciente } from '../../../services/turnoService';
import { SacarTurno } from '../SacarTurno';

vi.mock('../../../services/authService', () => ({
  getUsuarioActual: () => ({ id: 1, email: 'paciente@example.com', nombre: 'Paciente', rol: 'paciente' }),
  isAuthenticated: () => true,
  logout: vi.fn(),
}));

vi.mock('../../../services/especialidadService', () => ({
  getEspecialidades: vi.fn(),
}));

vi.mock('../../../services/especialistaService', () => ({
  getEspecialistasByEspecialidad: vi.fn(),
}));

vi.mock('../../../services/pacienteService', () => ({
  getPacienteById: vi.fn(),
}));

vi.mock('../../../services/turnoService', () => ({
  createTurno: vi.fn(),
  getHorariosDisponibles: vi.fn(),
  getTurnosPaciente: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('SacarTurno', () => {
  it('oculta horarios que se solapan con otros turnos del paciente', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 29, 10, 0));
    vi.mocked(getEspecialidades).mockResolvedValue([
      { cod_especialidad: 1, nombre: 'Cardiología', duracion_minutos: 45 },
    ]);
    vi.mocked(getEspecialistasByEspecialidad).mockResolvedValue([
      {
        cod_especialista: 1,
        dni: '123',
        matricula: 'MAT-1',
        nombre: 'Dra. Test',
        telefono: '123',
        obrasSociales: [{ cod_os: 1, nombre: 'Obra Social' }],
      },
    ]);
    vi.mocked(getPacienteById).mockResolvedValue({
      id: 1,
      nombre: 'Paciente',
      dni: '123',
      email: 'paciente@example.com',
      telefono: '123',
      direccion: 'Calle 123',
      cod_os: 1,
    });
    vi.mocked(getHorariosDisponibles).mockResolvedValue({
      fecha: '2026-10-30',
      horarios: ['08:00', '08:30', '09:30', '10:00'],
    });
    vi.mocked(getTurnosPaciente).mockResolvedValue([
      {
        fecha: '2026-10-30',
        hora_inicio: '09:00',
        cod_especialista: 2,
        nro_afiliado: 1,
        especialista: {
          cod_especialista: 2,
          nombre: 'Otro especialista',
          matricula: 'MAT-2',
          especialidad: { nombre: 'Pediatría', duracion_minutos: 60 },
        },
      },
    ]);

    render(
      <MemoryRouter initialEntries={['/sacar-turno?especialidad=1']}>
        <SacarTurno />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'Elegí tu especialista' });
    fireEvent.click(await screen.findByRole('button', { name: /Dra\. Test/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }));
    const dateButton = screen
      .getAllByRole('button', { name: '30' })
      .find((button) => !button.hasAttribute('disabled'));
    if (!dateButton) throw new Error('No se encontró la fecha de prueba habilitada.');
    fireEvent.click(dateButton);

    expect(await screen.findByRole('button', { name: '08:00' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '08:30' })).toBeNull();
    expect(screen.queryByRole('button', { name: '09:30' })).toBeNull();
    expect(screen.getByRole('button', { name: '10:00' })).toBeTruthy();
    expect(getTurnosPaciente).toHaveBeenCalledWith(1);
  });

  it('oculta especialidades y especialistas inactivos al reservar', async () => {
    vi.mocked(getEspecialidades).mockResolvedValue([
      { cod_especialidad: 1, nombre: 'Cardiología inactiva', estado: false },
      { cod_especialidad: 2, nombre: 'Cardiología activa', estado: true },
    ]);
    vi.mocked(getEspecialistasByEspecialidad).mockResolvedValue([
      {
        cod_especialista: 1,
        dni: '123',
        matricula: 'MAT-1',
        nombre: 'Dra. Inactiva',
        telefono: '123',
        estado: false,
      },
      {
        cod_especialista: 2,
        dni: '456',
        matricula: 'MAT-2',
        nombre: 'Dra. Activa',
        telefono: '456',
        estado: true,
      },
    ]);
    vi.mocked(getPacienteById).mockResolvedValue({
      id: 1,
      nombre: 'Paciente',
      dni: '123',
      email: 'paciente@example.com',
      telefono: '123',
      direccion: 'Calle 123',
      cod_os: 1,
    });

    render(
      <MemoryRouter initialEntries={['/sacar-turno']}>
        <SacarTurno />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('button', { name: /Cardiología activa/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Cardiología inactiva/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Cardiología activa/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }));

    expect(await screen.findByRole('button', { name: /Dra\. Activa/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Dra\. Inactiva/ })).toBeNull();
  });

  it('permite navegar los meses hasta el límite de reserva de seis meses', async () => {
    vi.mocked(getEspecialidades).mockResolvedValue([
      { cod_especialidad: 1, nombre: 'Cardiología' },
    ]);
    vi.mocked(getEspecialistasByEspecialidad).mockResolvedValue([
      {
        cod_especialista: 1,
        dni: '123',
        matricula: 'MAT-1',
        nombre: 'Dra. Test',
        telefono: '123',
        obrasSociales: [{ cod_os: 1, nombre: 'Obra Social' }],
      },
    ]);
    vi.mocked(getPacienteById).mockResolvedValue({
      id: 1,
      nombre: 'Paciente',
      dni: '123',
      email: 'paciente@example.com',
      telefono: '123',
      direccion: 'Calle 123',
      cod_os: 1,
    });

    render(
      <MemoryRouter initialEntries={['/sacar-turno?especialidad=1']}>
        <SacarTurno />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'Elegí tu especialista' });
    fireEvent.click(await screen.findByRole('button', { name: /Dra\. Test/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }));

    const today = new Date();
    const minMonth = today.getFullYear() * 12 + today.getMonth();
    const limit = new Date(today);
    limit.setHours(0, 0, 0, 0);
    limit.setMonth(limit.getMonth() + 6);
    const maxMonth = limit.getFullYear() * 12 + limit.getMonth();
    const monthLabel = (monthOffset: number) => {
      const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      return month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    };

    expect(await screen.findByRole('heading', { name: monthLabel(0) })).toBeTruthy();
    for (let offset = 1; offset <= maxMonth - minMonth; offset += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
      expect(screen.getByRole('heading', { name: monthLabel(offset) })).toBeTruthy();
    }

    expect(screen.getByRole('button', { name: 'Mes siguiente' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByRole('heading', { name: monthLabel(maxMonth - minMonth - 1) })).toBeTruthy();
  });
});
