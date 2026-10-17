import { Collection, Entity, ManyToMany, OneToMany, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import type { Paciente } from '../paciente/paciente.entity.js';
import type { Especialista } from '../especialista/especialista.entity.js';
@Entity()
export class ObraSocial
{
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_os!: number & Opt;

  @Property({ length: 60, nullable: false, unique: true, type: 'string' })
  nombre!: string;



  @OneToMany('Paciente', (unPaciente: Paciente) => unPaciente.obraSocial)
  pacientes = new Collection<Paciente>(this);

  @ManyToMany('Especialista', (unEspecialista: Especialista) => unEspecialista.obrasSociales)
  especialistas = new Collection<Especialista>(this);

}