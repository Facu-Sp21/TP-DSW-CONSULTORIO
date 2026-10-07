import { Collection, Entity, OneToMany, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Turno } from '../turno/turno.entity.js';

@Entity()
export class Paciente {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  nro_afiliado!: number & Opt;

  @Property({ length: 20, nullable: false, type: 'string', unique: true })
  dni!: string;

  @Property({ length: 60, nullable: false, type: 'string' })
  nombre!: string;

  @Property({ length: 30, nullable: false, type: 'string' })
  telefono!: string;

  @Property({ length: 100, nullable: false, type: 'string' })
  direccion!: string;

  @Property({ length: 120, nullable: false, type: 'string', unique: true })
  email!: string;

  @Property({ length: 100, nullable: false, type: 'string' })
  contrasena!: string;

  @Property({ type: 'number', nullable: true })
  cod_os?: number | null; // Puede ser particular o por obra social

  @OneToMany('Turno', (turno: any) => turno.paciente)
  turnos = new Collection<Turno>(this);
}
