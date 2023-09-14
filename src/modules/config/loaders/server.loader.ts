import { registerAs } from '@nestjs/config';

import { configLoader } from './config.loader';
import { ServerConfigType } from '../types/server.type';

export const serverConfigLoader = registerAs(
  'server',
  (): ServerConfigType => configLoader().server,
);
