import { Entity, Property, PrimaryKey,Opt, ManyToOne, Collection, OneToMany,OneToOne } from "@mikro-orm/core";
import type { ObraSocial } from "../ObraSocial/obraSocial.entity.js";
import type { Turno } from "../Turno/turno.entity.js";

@Entity()
export class Afiliado {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  cod_afiliado!: number & Opt;

  @Property({ type: 'string', length: 60, nullable: false })
  nombreCompleto!: string;

  @Property({type: 'string', length: 10, nullable: false})//por qué dni unique?
  dni!: string;

  @Property({ type: 'string', length: 60, nullable: false })
  email!: string;

  @Property({ type: 'string', length: 60, nullable: false })
  contrasenia!: string;

  @ManyToOne('ObraSocial', {fieldName: 'cod_os', nullable: false})
  obraSocial!: ObraSocial;


  @OneToMany('Turno', (unTurno: Turno) => unTurno.afiliado)
  turnos = new Collection<Turno>(this);
 

}