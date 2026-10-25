// Validaciones de formularios

import { hoyISO } from './fechas';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;
const TELEFONO = /^[0-9+()\-\s]+$/;

export function validarEmail(valor: string): string {
  const email = valor.trim();
  if (email === '') return 'Ingresá tu correo electrónico.';
  if (email.length > 120) return 'El correo electrónico no puede superar los 120 caracteres.';
  if (!EMAIL.test(email)) return 'El correo electrónico no es válido. Ejemplo: nombre@gmail.com';
  return '';
}

export function validarPasswordLogin(valor: string): string {
  return valor === '' ? 'Ingresá tu contraseña.' : '';
}

export function validarPasswordRegistro(valor: string): string {
  if (valor === '') return 'Elegí una contraseña.';
  if (valor.length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
  if (valor.length > 100) return 'La contraseña no puede superar los 100 caracteres.';
  return '';
}

export function validarConfirmacion(password: string, confirmacion: string): string {
  if (confirmacion === '') return 'Repetí la contraseña.';
  if (confirmacion !== password) return 'Las contraseñas no coinciden.';
  return '';
}

export function validarNombre(valor: string, etiqueta: 'nombre' | 'apellido'): string {
  const texto = valor.trim();
  if (texto === '') return `Ingresá tu ${etiqueta}.`;
  if (!NOMBRE.test(texto)) return `El ${etiqueta} solo puede tener letras.`;
  if (texto.length > 30) return `El ${etiqueta} no puede superar los 30 caracteres.`;
  return '';
}

export const normalizarDni = (valor: string): string => valor.replace(/\D/g, '');

export function validarDni(valor: string): string {
  if (valor.trim() === '') return 'Ingresá tu DNI.';
  if (/[^\d.\s]/.test(valor)) return 'El DNI solo puede tener números (se aceptan puntos).';
  const cantidad = normalizarDni(valor).length;
  if (cantidad < 7 || cantidad > 8) return 'El DNI debe tener 7 u 8 números.';
  return '';
}

export function validarTelefono(valor: string): string {
  const texto = valor.trim();
  if (texto === '') return 'Ingresá tu teléfono.';
  if (!TELEFONO.test(texto)) return 'El teléfono solo puede tener números, espacios y los símbolos + - ( ).';
  if (texto.replace(/\D/g, '').length < 8) return 'El teléfono debe tener al menos 8 números.';
  if (texto.length > 30) return 'El teléfono no puede superar los 30 caracteres.';
  return '';
}

export function validarDireccion(valor: string): string {
  const texto = valor.trim();
  if (texto === '') return 'Ingresá tu dirección.';
  if (texto.length > 100) return 'La dirección no puede superar los 100 caracteres.';
  return '';
}

export function validarFechaNacimiento(valor: string, hoy: string = hoyISO()): string {
  if (valor === '') return 'Ingresá tu fecha de nacimiento.';
  if (valor > hoy) return 'La fecha de nacimiento no puede ser posterior a hoy.';
  if (valor < '1900-01-01') return 'Revisá la fecha de nacimiento: el año es demasiado antiguo.';
  return '';
}