import { Collection, Entity, OneToMany, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Especialista } from '../especialista/especialista.entity.js';

@Entity()
export class Especialidad {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_especialidad!: number & Opt;

  @Property({ length: 60, nullable: false, unique: true, type: 'string' })
  nombre!: string;

  @Property({ nullable: false, type: 'number', default: 15 })
  duracion_minutos!: number;

  @OneToMany('Especialista', (especialista: any) => especialista.especialidad)
  especialistas = new Collection<Especialista>(this);
}