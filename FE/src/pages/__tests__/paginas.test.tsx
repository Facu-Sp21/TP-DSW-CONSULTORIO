import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { getEspecialidades } from '../../../services/especialidadService';
import { Contacto } from '../Contacto';
import { Especialidades } from '../Especialidades';
import { Legal } from '../Legal';
import { Nosotros } from '../Nosotros';

vi.mock('../../../services/especialidadService', () => ({
  getEspecialidades: vi.fn(),
}));

const renderConRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('páginas públicas', () => {
  it('Nosotros enlaza el botón de agendar al flujo de turnos', () => {
    renderConRouter(<Nosotros />);

    expect(screen.getByRole('link', { name: 'Agendar Turno Online' }).getAttribute('href'))
      .toBe('/sacar-turno');
  });

  it('Contacto muestra los días y horarios de atención correctos', () => {
    renderConRouter(<Contacto />);

    expect(screen.getByText('Lunes a viernes de 08:00 a 17:00 hs')).toBeTruthy();
  });

  it('Legal muestra el título y el contenido de privacidad', () => {
    renderConRouter(<Legal tipo="privacidad" />);

    expect(screen.getByRole('heading', { name: 'Políticas de privacidad' })).toBeTruthy();
    expect(screen.getByText(/Las contraseñas se almacenan cifradas/)).toBeTruthy();
  });

  it('Especialidades filtra los resultados según la búsqueda', async () => {
    vi.mocked(getEspecialidades).mockResolvedValue([
      { cod_especialidad: 1, nombre: 'Cardiología' },
      { cod_especialidad: 2, nombre: 'Pediatría' },
    ]);
    renderConRouter(<Especialidades />);

    const busqueda = await screen.findByPlaceholderText(/Buscar por especialidad/);
    await screen.findByRole('heading', { name: 'Cardiología' });
    fireEvent.change(busqueda, { target: { value: 'pedi' } });

    expect(screen.getByRole('heading', { name: 'Pediatría' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Cardiología' })).toBeNull();
  });
});
