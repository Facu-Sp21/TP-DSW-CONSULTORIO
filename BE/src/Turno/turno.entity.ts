import {Entity, PrimaryKey, Opt, Property, ManyToOne} from '@mikro-orm/core';
import type {Afiliado}  from '../Afiliado/afiliado.entity.js';
import type {Especialista} from '../especialista/especialista.entity.js';

@Entity()
export class Turno {

   @PrimaryKey({ type: 'number', autoincrement: true })
    cod_turno!: number & Opt;

    @Property({ type: 'date', nullable: false })
    fecha!: Date;

    @Property({ type: 'string', length: 20, nullable: false })
    hora!: string;

    @ManyToOne('Afiliado', {fieldName: 'cod_afiliado', nullable: false})
    afiliado!: Afiliado;

    @ManyToOne('Especialista', {fieldName: 'cod_especialista', nullable: false})
    especialista!: Especialista;




}