import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Suscripcion {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  id!: number & Opt;

  @Property({ length: 120, nullable: false, unique: true, type: 'string' })
  email!: string;

  @Property({ type: 'datetime' })
  creadaEn: Date & Opt = new Date();
}