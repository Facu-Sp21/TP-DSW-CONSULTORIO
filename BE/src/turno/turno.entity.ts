import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Paciente } from '../paciente/paciente.entity.js';
import type { Especialista } from '../especialista/especialista.entity.js';

@Entity()
export class Turno {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_turno!: number & Opt;

  // Formato estricto: 'YYYY-MM-DD' (ej: '2026-09-22')
  @Property({ nullable: false, type: 'date' })
  fecha!: string; 

  // Formato estricto: 'HH:mm' (ej: '17:00')
  @Property({ nullable: false, type: 'time' })
  hora_inicio!: string; 

  @ManyToOne('Paciente', { fieldName: 'nro_afiliado', nullable: false })
  paciente!: Paciente;

  @ManyToOne('Especialista', { fieldName: 'cod_especialista', nullable: false })
  especialista!: Especialista;
}