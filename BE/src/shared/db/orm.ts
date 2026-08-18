import { MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
  entities: ['./dist/**/entity.js'],
  entitiesTs: ['./src/**/entity.ts'],
  dbName: 'consultorio-db',
  clientUrl: 'mysql://user:password@localhost:3306/consultorio-db',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: { // Nunca usar en produccion, solo para desarrollo porque borra y crea la base de datos cada vez que se ejecuta
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: []
    }
})

export const syncSchema = async () => { // esto es para sincronizar la base de datos con las entidades, solo usar en desarrollo
  const generator = orm.schema;
  await generator.update();
}
