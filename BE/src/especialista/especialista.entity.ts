import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Especialidad } from '../especialidad/especialidad.entity.js';

@Entity()
export class Especialista {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_especialista!: number & Opt;

  @Property({ length: 30, nullable: false, type: 'string' })
  matricula!: string;

  @Property({ length: 60, nullable: false, type: 'string' })
  nombre!: string;

  @Property({ length: 30, nullable: false, type: 'string' })
  telefono!: string;

  @ManyToOne('Especialidad', { fieldName: 'cod_especialidad', nullable: false })
  especialidad!: Especialidad;
}
