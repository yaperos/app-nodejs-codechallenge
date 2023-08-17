import { DataType, newDb } from 'pg-mem';
import { v4 } from 'uuid';
import * as path from 'path';

const getDatasourceMock = async () => {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });
  db.public.registerFunction({
    implementation: () => '5',
    name: 'version',
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });
  db.public.interceptQueries((queryText) => {
    if (
      queryText.search(/(pg_views|pg_matviews|pg_tables|pg_enum|columns)/g) > -1
    ) {
      return [];
    }
    return null;
  });
  db.public.registerFunction({
    name: 'jsonb_typeof',
    args: [DataType.jsonb],
    returns: DataType.text,
    implementation: (x) => (x ? x.constructor.name : null),
  });

  const datasource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    autoLoadEntities: true,
    database: 'db_yape',
    name: 'db_yape',
    entities: [path.join(__dirname, '../../src/**/*/*.entity{.ts,.js}')],
  });
  await datasource.initialize();
  await datasource.synchronize();
  return datasource;
};
export { getDatasourceMock };
