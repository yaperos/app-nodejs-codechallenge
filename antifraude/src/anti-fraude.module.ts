import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudeController } from './anti-fraude.controller';
import { AntiFraudeService } from './anti-fraude.service';
import { config, validationSchema, environments} from './config';
import { ANTIFRAUDE_TRANSACTION } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[`${process.env.NODE_ENV}`],
      ignoreEnvFile: process.env.NODE_ENV === 'production' || false,
      load: [config],
      validationSchema
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ANTIFRAUDE_TRANSACTION,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: configService.get('config.kafka.options')
          }),
          inject: [ConfigService]
        }
      ]
    })
  ],
  controllers: [AntiFraudeController],
  providers: [AntiFraudeService],
})
export class AntiFraudeModule {}
