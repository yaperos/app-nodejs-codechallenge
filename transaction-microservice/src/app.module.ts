import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { LoggerModule } from 'nestjs-pino';
import { envSchema } from './config/env-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: envSchema
    }),
    
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            messageKey: 'message',
          }
        },
        messageKey: 'message',
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
