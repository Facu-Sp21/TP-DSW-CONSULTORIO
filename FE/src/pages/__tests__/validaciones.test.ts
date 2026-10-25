import { describe, expect, it } from 'vitest';
import {
  normalizarDni,
  validarConfirmacion,
  validarDireccion,
  validarDni,
  validarEmail,
  validarFechaNacimiento,
  validarNombre,
  validarPasswordLogin,
  validarPasswordRegistro,
  validarTelefono,
} from '../../../services/validaciones';

describe('validarEmail', () => {
  it('acepta un correo válido', () => {
    expect(validarEmail('nombre@gmail.com')).toBe('');
    expect(validarEmail('  nombre@gmail.com  ')).toBe('');
  });

  it.each(['', '   '])('pide el correo cuando está vacío: "%s"', (valor) => {
    expect(validarEmail(valor)).toBe('Ingresá tu correo electrónico.');
  });

  it.each(['nombre', 'nombre@', '@gmail.com', 'nombre@gmail', 'nom bre@gmail.com'])('rechaza un formato inválido: %s', (valor) => {
    expect(validarEmail(valor)).toMatch(/no es válido/);
  });

  it('rechaza un correo de más de 120 caracteres', () => {
    expect(validarEmail(`${'a'.repeat(120)}@gmail.com`)).toMatch(/120 caracteres/);
  });
});

describe('contraseñas', () => {
  it('en el login solo pide que no esté vacía', () => {
    expect(validarPasswordLogin('')).toBe('Ingresá tu contraseña.');
    expect(validarPasswordLogin('a')).toBe('');
  });

  it('al registrarse pide al menos 4 caracteres (igual que el backend)', () => {
    expect(validarPasswordRegistro('')).toBe('Elegí una contraseña.');
    expect(validarPasswordRegistro('abc')).toMatch(/al menos 4/);
    expect(validarPasswordRegistro('abcd')).toBe('');
  });

  it('la confirmación debe estar completa y coincidir', () => {
    expect(validarConfirmacion('abcd', '')).toBe('Repetí la contraseña.');
    expect(validarConfirmacion('abcd', 'abce')).toBe('Las contraseñas no coinciden.');
    expect(validarConfirmacion('abcd', 'abcd')).toBe('');
  });
});

describe('validarNombre', () => {
  it('acepta nombres con tildes, ñ, espacios y guiones', () => {
    expect(validarNombre('María José', 'nombre')).toBe('');
    expect(validarNombre('Peña-Núñez', 'apellido')).toBe('');
    expect(validarNombre("O'Connor", 'apellido')).toBe('');
  });

  it('indica cuál de los dos campos falta', () => {
    expect(validarNombre('', 'nombre')).toBe('Ingresá tu nombre.');
    expect(validarNombre('  ', 'apellido')).toBe('Ingresá tu apellido.');
  });

  it('rechaza números y símbolos', () => {
    expect(validarNombre('Juan3', 'nombre')).toBe('El nombre solo puede tener letras.');
    expect(validarNombre('Pérez@', 'apellido')).toBe('El apellido solo puede tener letras.');
  });

  it('rechaza más de 30 caracteres', () => {
    expect(validarNombre('a'.repeat(31), 'nombre')).toMatch(/30 caracteres/);
  });
});

describe('DNI', () => {
  it.each(['38123456', '38.123.456', '9.123.456', ' 38 123 456 '])('acepta %s', (valor) => {
    expect(validarDni(valor)).toBe('');
  });

  it('pide el DNI cuando está vacío', () => {
    expect(validarDni('')).toBe('Ingresá tu DNI.');
  });

  it('rechaza letras o símbolos', () => {
    expect(validarDni('38.123.45a')).toMatch(/solo puede tener números/);
    expect(validarDni('38-123-456')).toMatch(/solo puede tener números/);
  });

  it.each(['123456', '123456789'])('rechaza cantidades de números distintas de 7 u 8: %s', (valor) => {
    expect(validarDni(valor)).toBe('El DNI debe tener 7 u 8 números.');
  });

  it('normalizarDni deja solo los números', () => {
    expect(normalizarDni('38.123.456')).toBe('38123456');
  });
});

describe('validarTelefono', () => {
  it.each(['+54 9 11 1234-5678', '341-555-0100', '(341) 555 0100'])('acepta %s', (valor) => {
    expect(validarTelefono(valor)).toBe('');
  });

  it('pide el teléfono cuando está vacío', () => {
    expect(validarTelefono('')).toBe('Ingresá tu teléfono.');
  });

  it('rechaza letras', () => {
    expect(validarTelefono('341-abc-0100')).toMatch(/solo puede tener números/);
  });

  it('rechaza menos de 8 números y más de 30 caracteres', () => {
    expect(validarTelefono('12345')).toMatch(/al menos 8 números/);
    expect(validarTelefono('1'.repeat(31))).toMatch(/30 caracteres/);
  });
});

describe('validarDireccion', () => {
  it('valida vacío y largo máximo', () => {
    expect(validarDireccion('')).toBe('Ingresá tu dirección.');
    expect(validarDireccion('a'.repeat(101))).toMatch(/100 caracteres/);
    expect(validarDireccion('Av. Siempre Viva 742')).toBe('');
  });
});

describe('validarFechaNacimiento', () => {
  const hoy = '2026-10-20';

  it('acepta una fecha pasada, incluso hoy', () => {
    expect(validarFechaNacimiento('1994-05-12', hoy)).toBe('');
    expect(validarFechaNacimiento('2026-10-20', hoy)).toBe('');
  });

  it('pide la fecha cuando está vacía', () => {
    expect(validarFechaNacimiento('', hoy)).toBe('Ingresá tu fecha de nacimiento.');
  });

  it('rechaza una fecha futura', () => {
    expect(validarFechaNacimiento('2026-10-21', hoy)).toBe('La fecha de nacimiento no puede ser posterior a hoy.');
  });

  it('rechaza un año demasiado antiguo', () => {
    expect(validarFechaNacimiento('1850-01-01', hoy)).toMatch(/demasiado antiguo/);
  });
});