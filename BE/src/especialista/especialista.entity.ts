import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Especialidad } from '../especialidad/especialidad.entity.js';

@Entity()
export class Especialista {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_especialista!: number & Opt;

  @Property({ length: 30, nullable: false, type: 'string', unique: true })
  matricula!: string;

  @Property({ length: 60, nullable: false, type: 'string' })
  nombre!: string;

  @Property({ length: 120, nullable: false, type: 'string', unique: true })
  email!: string;

  @Property({ length: 30, nullable: false, type: 'string' })
  telefono!: string;

  @Property({ length: 255, nullable: false, type: 'string' })
  contrasena!: string;

  @ManyToOne('Especialidad', { fieldName: 'cod_especialidad', nullable: true })
  especialidad?: Especialidad | null;
}