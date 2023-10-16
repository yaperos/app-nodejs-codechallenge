import { Module } from '@nestjs/common';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
import { LoggerModule } from 'modules/logger/logger.module';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';

@Module({
  imports: [
    LoggerModule.forRoot('Antifraud module'),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService, ClientKafka],
})
export class AntifraudModule {}
