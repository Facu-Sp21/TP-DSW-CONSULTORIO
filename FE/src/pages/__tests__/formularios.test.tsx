import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApiError } from '../../../services/api';
import { login } from '../../../services/authService';
import { createPaciente } from '../../../services/pacienteService';
import { Login } from '../Login';
import { Registro } from '../Registro';

vi.mock('../../../services/authService', () => ({
  login: vi.fn(),
  rutaSegunRol: vi.fn(() => '/usuario'),
}));
vi.mock('../../../services/pacienteService', () => ({
  createPaciente: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const renderConRouter = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);
const escribir = (etiqueta: string, valor: string) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const mensajesDeError = () => [...document.querySelectorAll('.invalid-feedback')].map((m) => m.textContent);
const marcado = (etiqueta: string) => screen.getByLabelText(etiqueta).classList.contains('is-invalid');

describe('Login', () => {
  it('al enviar vacío señala cada campo y no llama al servidor', () => {
    renderConRouter(<Login />);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByText('Ingresá tu correo electrónico.')).toBeTruthy();
    expect(screen.getByText('Ingresá tu contraseña.')).toBeTruthy();
    expect(marcado('Correo electrónico')).toBe(true);
    expect(marcado('Contraseña')).toBe(true);
    expect(document.activeElement?.id).toBe('email');
    expect(login).not.toHaveBeenCalled();
  });

  it('señala solo el campo que está mal', () => {
    renderConRouter(<Login />);
    escribir('Correo electrónico', 'nombre@');
    escribir('Contraseña', 'secreta');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(mensajesDeError()).toEqual(['El correo electrónico no es válido. Ejemplo: nombre@gmail.com']);
    expect(marcado('Correo electrónico')).toBe(true);
    expect(marcado('Contraseña')).toBe(false);
  });

  it('el error desaparece apenas la persona corrige el campo', () => {
    renderConRouter(<Login />);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Ingresá tu correo electrónico.')).toBeTruthy();

    escribir('Correo electrónico', 'nombre@gmail.com');

    expect(screen.queryByText('Ingresá tu correo electrónico.')).toBeNull();
    expect(marcado('Correo electrónico')).toBe(false);
  });

  it('con datos válidos llama al login con el correo sin espacios', async () => {
    vi.mocked(login).mockResolvedValue({ token: 't', user: { id: 1, email: 'a@a.com', nombre: 'A', rol: 'paciente' } });
    renderConRouter(<Login />);
    escribir('Correo electrónico', '  nombre@gmail.com ');
    escribir('Contraseña', 'secreta');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('nombre@gmail.com', 'secreta'));
  });

  it('con credenciales incorrectas marca los dos campos y muestra el aviso general', async () => {
    vi.mocked(login).mockRejectedValue(new ApiError('Email o contraseña incorrectos', 401));
    renderConRouter(<Login />);
    escribir('Correo electrónico', 'nombre@gmail.com');
    escribir('Contraseña', 'equivocada');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByText('El correo o la contraseña no son correctos.')).toBeTruthy();
    expect(marcado('Correo electrónico')).toBe(true);
    expect(marcado('Contraseña')).toBe(true);
    expect(mensajesDeError()).toEqual([]);
  });

  it('sin conexión con el servidor muestra un aviso entendible', async () => {
    vi.mocked(login).mockRejectedValue(new TypeError('Failed to fetch'));
    renderConRouter(<Login />);
    escribir('Correo electrónico', 'nombre@gmail.com');
    escribir('Contraseña', 'secreta');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByText(/No pudimos conectarnos con el servidor/)).toBeTruthy();
  });
});

describe('Registro', () => {
  const completarValido = () => {
    escribir('Nombre', 'María José');
    escribir('Apellido', 'Pérez');
    escribir('DNI', '38.123.456');
    escribir('Fecha de nacimiento', '1994-05-12');
    escribir('Teléfono', '+54 9 11 1234-5678');
    escribir('Dirección', 'Av. Siempre Viva 742');
    escribir('Correo electrónico', 'maria@gmail.com');
    escribir('Contraseña', 'secreta');
    escribir('Confirmar contraseña', 'secreta');
  };
  const enviar = () => fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

  it('al enviar vacío señala los nueve campos y no llama al servidor', () => {
    renderConRouter(<Registro />);
    enviar();

    expect(mensajesDeError()).toHaveLength(9);
    expect(document.activeElement?.id).toBe('nombre');
    expect(createPaciente).not.toHaveBeenCalled();
  });

  it('señala solo el DNI cuando tiene letras', () => {
    renderConRouter(<Registro />);
    completarValido();
    escribir('DNI', '38.123.45a');
    enviar();

    expect(mensajesDeError()).toEqual(['El DNI solo puede tener números (se aceptan puntos).']);
    expect(marcado('DNI')).toBe(true);
    expect(marcado('Teléfono')).toBe(false);
    expect(createPaciente).not.toHaveBeenCalled();
  });

  it('señala la confirmación cuando las contraseñas no coinciden', () => {
    renderConRouter(<Registro />);
    completarValido();
    escribir('Confirmar contraseña', 'otra');
    enviar();

    expect(mensajesDeError()).toEqual(['Las contraseñas no coinciden.']);
    expect(marcado('Confirmar contraseña')).toBe(true);
    expect(marcado('Contraseña')).toBe(false);
  });

  it('al cambiar la contraseña revisa de nuevo la confirmación', () => {
    renderConRouter(<Registro />);
    completarValido();
    escribir('Confirmar contraseña', 'otra');
    enviar();
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy();

    escribir('Contraseña', 'otra');

    expect(screen.queryByText('Las contraseñas no coinciden.')).toBeNull();
  });

  it('con datos válidos manda el DNI solo con números y los textos sin espacios sobrantes', async () => {
    vi.mocked(createPaciente).mockResolvedValue({} as never);
    vi.mocked(login).mockResolvedValue({ token: 't', user: { id: 1, email: 'm@m.com', nombre: 'M', rol: 'paciente' } });
    renderConRouter(<Registro />);
    completarValido();
    escribir('Nombre', '  María José ');
    enviar();

    await waitFor(() =>
      expect(createPaciente).toHaveBeenCalledWith({
        nombre: 'María José Pérez',
        dni: '38123456',
        telefono: '+54 9 11 1234-5678',
        direccion: 'Av. Siempre Viva 742',
        email: 'maria@gmail.com',
        contrasena: 'secreta',
      }),
    );
    await waitFor(() => expect(login).toHaveBeenCalledWith('maria@gmail.com', 'secreta'));
  });

  it.each([
    ['nombre', 'Nombre'],
    ['dni', 'DNI'],
    ['telefono', 'Teléfono'],
    ['direccion', 'Dirección'],
    ['email', 'Correo electrónico'],
    ['contrasena', 'Contraseña'],
  ])('muestra un error de validación del servidor sobre "%s" debajo del campo "%s"', async (campoDelBackend, etiqueta) => {
    vi.mocked(createPaciente).mockRejectedValue(
      new ApiError('Validation error', 400, [{ path: campoDelBackend, message: `Error del servidor en ${campoDelBackend}` }]),
    );
    renderConRouter(<Registro />);
    completarValido();
    enviar();

    expect(await screen.findByText(`Error del servidor en ${campoDelBackend}`)).toBeTruthy();
    expect(marcado(etiqueta)).toBe(true);
    expect(document.querySelectorAll('.is-invalid')).toHaveLength(1); // solo ese campo, ningún otro
    expect(document.activeElement?.id).toBe(screen.getByLabelText(etiqueta).id); // y el cursor va ahí
  });

  it('cuando el servidor dice "DNI o email" ya registrado marca los dos campos', async () => {
    vi.mocked(createPaciente).mockRejectedValue(new ApiError('Ya existe un paciente con ese DNI o email', 409));
    renderConRouter(<Registro />);
    completarValido();
    enviar();

    await waitFor(() => expect(marcado('DNI')).toBe(true));
    expect(marcado('Correo electrónico')).toBe(true);
    expect(marcado('Teléfono')).toBe(false);
  });

  it('cuando el servidor nombra solo el DNI marca solo el DNI', async () => {
    vi.mocked(createPaciente).mockRejectedValue(new ApiError('Ya existe un paciente con ese DNI', 409));
    renderConRouter(<Registro />);
    completarValido();
    enviar();

    expect(await screen.findByText('Ya existe un paciente con ese DNI')).toBeTruthy();
    expect(marcado('DNI')).toBe(true);
    expect(marcado('Correo electrónico')).toBe(false);
  });

  it('un error del servidor que no corresponde a un campo se muestra como aviso general', async () => {
    vi.mocked(createPaciente).mockRejectedValue(new ApiError('Error interno del servidor', 500));
    renderConRouter(<Registro />);
    completarValido();
    enviar();

    expect(await screen.findByText('Error interno del servidor')).toBeTruthy();
    expect(mensajesDeError()).toEqual([]);
  });
});