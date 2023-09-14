import { registerAs } from '@nestjs/config';

import { configLoader } from './config.loader';
import { DatabaseConfigType } from '../types/database.type';

export const databaseConfigLoader = registerAs(
  'database',
  (): DatabaseConfigType => configLoader().database,
);
