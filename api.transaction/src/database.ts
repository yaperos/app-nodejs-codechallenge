import { MongoClient } from 'mongodb';

import { config } from './configuration';

export default async () => {
  const client = new MongoClient(config.DB_HOST);

  await client.connect();

  return client.db(config.DB_NAME);
};
