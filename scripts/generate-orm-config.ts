import path = require('path');
import fs = require('fs');
import * as dotenv from 'dotenv';

const relative = path.join(path.relative('.', __dirname), '..');

dotenv.config({ path: `${relative}/.env` });

fs.writeFileSync(
  path.join(__dirname, '/../ormconfig.json'),
  JSON.stringify(
    {
      type: process.env.MAIN_DB_TYPE,
      host: process.env.MAIN_DB_HOST,
      port: parseInt(process.env.MAIN_DB_PORT, 10),
      username: process.env.MAIN_DB_USERNAME,
      password: process.env.MAIN_DB_PASSWORD,
      database: process.env.MAIN_DB_NAME,
      synchronize: process.env.MAIN_DB_SYNC === '1',
      autoLoadEntities: true,
      migrationsTableName: 'migrations',
      cli: {
        migrationsDir: `${relative}/database/migration`
      },
      entities: [`${relative}/src/modules/**/*.entity.ts`],
      migrations: [`${relative}/database/migration/*.ts`],
      seeds: [`${relative}/database/seeds/*.ts`]
    },
    null,
    2
  )
);
