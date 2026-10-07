import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { sCreatePaciente } from '../src/paciente/paciente.service.js';
import { sCreateEspecialista } from '../src/especialista/especialista.service.js';
import { sCreateEspecialidad } from '../src/especialidad/especialidad.service.js';
import { orm } from '../src/shared/db/orm.js';

jest.mock('../src/shared/db/orm.js', () => ({ // esto configura un mock para el objeto `orm` que se importa desde el archivo `orm.js`
  orm: {
    em: {
      create: jest.fn((_entity: unknown, data: Record<string, unknown>) => ({ ...data })),
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

describe('reglas de negocio', () => {
  const pacienteBase = {
    dni: '40111222',
    nombre: 'Ana Perez',
    telefono: '3415551234',
    direccion: 'Calle 123',
    email: 'ana@example.com',
    contrasena: 'secreto',
  };

  const especialistaBase = {
    matricula: 'MP-12345',
    nombre: 'Laura Gómez',
    email: 'laura@example.com',
    telefono: '3415551234',
    especialidad: { cod_especialidad: 1, nombre: 'Cardiología', duracion_minutos: 45 } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rechaza crear un paciente con DNI duplicado', async () => {
    (orm.em.persistAndFlush as jest.Mock).mockRejectedValue(new UniqueConstraintViolationException(new Error()));

    await expect(sCreatePaciente(pacienteBase)).rejects.toThrow('Ya existe un paciente con ese DNI o email');
  });

  it('rechaza crear un paciente con email duplicado', async () => {
    (orm.em.persistAndFlush as jest.Mock).mockRejectedValue(new UniqueConstraintViolationException(new Error()));

    await expect(sCreatePaciente(pacienteBase)).rejects.toThrow('Ya existe un paciente con ese DNI o email');
  });

  it('rechaza crear un especialista con matrícula o email duplicados', async () => {
    (orm.em.persistAndFlush as jest.Mock).mockRejectedValue(new UniqueConstraintViolationException(new Error()));

    await expect(sCreateEspecialista(especialistaBase)).rejects.toThrow('Ya existe un especialista con esa matrícula o email');
  });

  it('rechaza crear una especialidad con nombre duplicado', async () => {
    (orm.em.persistAndFlush as jest.Mock).mockRejectedValue(new UniqueConstraintViolationException(new Error()));

    await expect(sCreateEspecialidad('Cardiología', 45)).rejects.toThrow(
      'Ya existe una especialidad con ese nombre',
    );
  });
});
