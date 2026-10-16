import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Administrativo {
  @PrimaryKey({ type: 'number', autoincrement: true, unique: true })
  id!: number & Opt;

  @Property({ length: 100, nullable: false, type: 'string' })
  nombreCompleto!: string;

  @Property({ length: 10, nullable: false, type: 'string', unique: true })
  legajo!: string;

  @Property({ length: 120, nullable: false, type: 'string', unique: true })
  email!: string;

  @Property({ length: 255, nullable: false, type: 'string' })
  password!: string;
}
