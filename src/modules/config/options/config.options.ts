import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import { configSchema } from '../schemas/config.schema';
import { serverConfigLoader } from '../loaders';

export const options: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [serverConfigLoader],
  validationSchema: configSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  envFilePath: ['.env', '.env.local', '.env.test'],
};
