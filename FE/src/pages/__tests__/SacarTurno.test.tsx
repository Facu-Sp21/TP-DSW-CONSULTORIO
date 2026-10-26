import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { getEspecialidades } from '../../../services/especialidadService';
import { getEspecialistasByEspecialidad } from '../../../services/especialistaService';
import { getPacienteById } from '../../../services/pacienteService';
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
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SacarTurno', () => {
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
