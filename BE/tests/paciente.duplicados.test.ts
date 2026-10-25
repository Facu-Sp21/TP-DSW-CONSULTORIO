import { mensajeDeDuplicado } from '../src/paciente/paciente.duplicado.js';

describe('mensajeDeDuplicado', () => {
  it('avisa que el DNI está repetido cuando se viola la clave única del DNI', () => {
    const error = new Error("Duplicate entry '38444555' for key 'paciente_dni_unique'");
    expect(mensajeDeDuplicado(error)).toBe('Ya existe un paciente con ese DNI');
  });

  it('avisa que el email está repetido cuando se viola la clave única del email', () => {
    const error = new Error("Duplicate entry 'pablo@mail.com' for key 'paciente_email_unique'");
    expect(mensajeDeDuplicado(error)).toBe('Ya existe un paciente con ese email');
  });

  it('mira el nombre de la clave y no el valor repetido', () => {
    const error = new Error("Duplicate entry 'dni@mail.com' for key 'paciente_email_unique'");
    expect(mensajeDeDuplicado(error)).toBe('Ya existe un paciente con ese email');
  });

  it.each([new Error('dup'), new Error("Duplicate entry 'x' for key 'otra_clave'"), 'texto suelto', undefined])(
    'si no se puede saber cuál fue, nombra a los dos: %s',
    (error) => {
      expect(mensajeDeDuplicado(error)).toBe('Ya existe un paciente con ese DNI o email');
    },
  );
});