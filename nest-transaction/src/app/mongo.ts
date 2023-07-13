import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { mongoEnvsFactory } from './Enviroment';

export const CustomMongooseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: mongoEnvsFactory,
});

export const MongooseModuleForTest = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: () => ({
    uri: 'mongodb://localhost:27017/test-db',
  }),
});
