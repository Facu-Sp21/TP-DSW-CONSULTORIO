import { Collection, Entity, ManyToMany, ManyToOne, Opt, PrimaryKey, Property,OneToMany } from '@mikro-orm/core';
import type { Especialidad } from '../especialidad/especialidad.entity.js';
import type { ObraSocial } from '../ObraSocial/obraSocial.entity.js';
import type { Turno } from '../turno/turno.entity.js';


@Entity()
export class Especialista {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_especialista!: number & Opt;

  @Property({ length: 20, nullable: false, type: 'string', unique: true })
  dni!: string;
  
  @Property({ length: 30, nullable: false, type: 'string', unique: true })
  matricula!: string;

  @Property({ length: 60, nullable: false, type: 'string' })
  nombre!: string;

  @Property({ length: 120, nullable: false, type: 'string', unique: true })
  email!: string;

  @Property({ length: 30, nullable: false, type: 'string' })
  telefono!: string;

  //@ManyToOne('Especialidad', { fieldName: 'cod_especialidad', nullable: false })
  //especialidad!: Especialidad;

  @OneToMany('Turno', (unTurno: Turno) => unTurno.especialista)
  turnos = new Collection<Turno>(this);
  
  @Property({ length: 255, nullable: false, type: 'string' })
  contrasena!: string;

  @Property({ nullable: false, type: 'boolean', default: true })
  estado: boolean = true;

  @Property({ nullable: false, type: 'number', default: 0 })
  consulta_particular: number = 0;

  @ManyToOne('Especialidad', { fieldName: 'cod_especialidad', nullable: true })
  especialidad?: Especialidad | null;

  @ManyToMany('ObraSocial', (obraSocial: ObraSocial) => obraSocial.especialistas, {
    owner: true,
    pivotTable: 'obra_social_especialista',
  })
  obrasSociales = new Collection<ObraSocial>(this);
}


