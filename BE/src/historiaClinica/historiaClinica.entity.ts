import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Paciente } from '../paciente/paciente.entity.js';
import type { Especialista } from '../especialista/especialista.entity.js';
import type { Turno } from '../turno/turno.entity.js';

// Una entrada por consulta realizada: se crea cuando el especialista atiende un turno.
@Entity()
export class HistoriaClinica {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_historia!: number & Opt;

  @ManyToOne('Paciente', { fieldName: 'nro_afiliado', nullable: false })
  paciente!: Paciente;

  @ManyToOne('Especialista', { fieldName: 'cod_especialista', nullable: false })
  especialista!: Especialista;

  // unique: un turno genera como máximo una entrada de historia clínica
  @ManyToOne('Turno', { fieldName: 'cod_turno', nullable: false, unique: true })
  turno!: Turno;

  @Property({ type: 'text', nullable: false })
  diagnostico!: string;

  @Property({ type: 'text', nullable: true })
  indicaciones?: string;
}