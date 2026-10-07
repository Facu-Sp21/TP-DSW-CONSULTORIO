import { Entity, PrimaryKey, Property, OneToMany,Collection,Opt,ManyToMany } from '@mikro-orm/core';
import type { Afiliado } from '../Afiliado/afiliado.entity.js';
import type { Especialista } from '../especialista/especialista.entity.js';
@Entity()
export class ObraSocial
{
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_os!: number & Opt;

  @Property({ length: 60, nullable: false, unique: true, type: 'string' })
  nombre!: string;


  @OneToMany('Afiliado', (unAfiliado: Afiliado) => unAfiliado.obraSocial)
  pacientes= new Collection<Afiliado>(this);

  @ManyToMany('Especialista', (unEspecialista: Especialista) => unEspecialista.obrasSociales)
 especialistas = new Collection<Especialista>(this);

}