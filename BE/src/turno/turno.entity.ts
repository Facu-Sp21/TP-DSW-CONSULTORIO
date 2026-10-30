import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Paciente } from '../paciente/paciente.entity.js';
import type { Especialista } from '../especialista/especialista.entity.js';
import type { ObraSocial } from '../ObraSocial/obraSocial.entity.js';
import type { EstadoTurno } from './turno.estado.js';

@Entity()
export class Turno {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_turno!: number & Opt;

 
  @Property({ nullable: false, type: 'date' })
  fecha!: string; 


  @Property({ nullable: false, type: 'time' })
  hora_inicio!: string;
  

  @Property({ length: 10, nullable: false, type: 'string', default: 'PENDIENTE' })
  estado: EstadoTurno & Opt = 'PENDIENTE';

  @ManyToOne('Paciente', { fieldName: 'nro_afiliado', nullable: false })
  paciente!: Paciente;

  @ManyToOne('Especialista', { fieldName: 'cod_especialista', nullable: false })
  especialista!: Especialista;

  @ManyToOne('ObraSocial', { fieldName: 'cod_os', nullable: true })
  obraSocial?: ObraSocial | null;
}