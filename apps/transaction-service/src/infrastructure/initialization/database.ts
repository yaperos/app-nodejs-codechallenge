import { surrealDb } from '../di';
import {
  DATABASE_CONNECTION_URL,
  DATABASE_NAME,
  DATABASE_NAMESPACE,
  DATABASE_PASSWORD,
  DATABASE_USER,
} from '../environment';

export const initDatabase = async () => {
  await surrealDb.connect(DATABASE_CONNECTION_URL, {
    auth: {
      database: DATABASE_NAME,
      namespace: DATABASE_NAMESPACE,
      password: DATABASE_PASSWORD,
      username: DATABASE_USER,
    },
  });
};
