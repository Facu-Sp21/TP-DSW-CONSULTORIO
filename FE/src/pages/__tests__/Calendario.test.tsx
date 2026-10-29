import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { getTurnosPaciente } from '../../../services/turnoService';
import { Calendario } from '../Usuario';

vi.mock('../../../services/authService', () => ({
  getUsuarioActual: () => ({ id: 1, email: 'paciente@example.com', nombre: 'Paciente', rol: 'paciente' }),
  isAuthenticated: () => true,
  logout: vi.fn(),
}));

vi.mock('../../../services/turnoService', () => ({
  cancelarTurno: vi.fn(),
  getTurnosPaciente: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Calendario de pacientes', () => {
  it('permite navegar los meses hasta el límite de seis meses', async () => {
    vi.mocked(getTurnosPaciente).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/calendario']}>
        <Calendario />
      </MemoryRouter>,
    );

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
