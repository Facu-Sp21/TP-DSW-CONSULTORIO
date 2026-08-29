import { Entity, PrimaryKey, Property, Opt } from '@mikro-orm/core';

@Entity()
export class Especialidad {
  @PrimaryKey( { type: 'number', autoincrement: true, unique: true })
  cod_especialidad!: number & Opt;  // esto es para no tener problemas con typescript ya que  cod_especialidad lo genera la base de datos

  @Property({ length: 60, nullable: false, unique: true, type: 'string' })
  nombre!: string;
}
