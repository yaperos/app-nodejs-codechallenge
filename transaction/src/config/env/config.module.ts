import { ConfigModule as EnvModule } from '@nestjs/config';
import { validate } from './env.validation';

/**
 * Module used to access environment varibales (.env file) programatically
 * https://docs.nestjs.com/techniques/configuration
 *
 * @returns {DynamicModule} Nest Application DynamicModule
 */

export const ConfigModule = EnvModule.forRoot({
  isGlobal: true,
  cache: true,
  validate,
});
