import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const mongoEnvsFactory = async (config: ConfigService) => ({
  uri: config.get<string>('database.uri'),
});

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
