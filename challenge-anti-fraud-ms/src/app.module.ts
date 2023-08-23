import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { GetAntiFraudValidationEventCommandHandler } from './module/application/command/anti-fraud-validation.command';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudValidationInfrastructure } from './module/infrastructure/anti-fraud-validation.infrastructure';
import { AntiFraudValidationController } from './module/interfaces/controller/v1/anti-fraud-validation.controller';

const imports = [
  ConfigModule.forRoot(),
  CqrsModule,
  HttpModule,
  TerminusModule,
  ClientsModule.register([
    {
      name: process.env.CLIENT_MODULE_REGISTER,
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.BROKER],
        },
        consumer: {
          groupId: process.env.GROUP_ID,
        },
      },
    },
  ]),
];

const controllers = [AntiFraudValidationController];

const providersFactory = [];
const providersApplication = [GetAntiFraudValidationEventCommandHandler];
const providersInfrastructure = [AntiFraudValidationInfrastructure];
@Module({
  imports: [...imports],
  controllers: [...controllers],
  providers: [
    Logger,
    ...providersFactory,
    ...providersApplication,
    ...providersInfrastructure,
  ],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('PORT') || 80;
  }
}
