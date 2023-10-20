import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '../core-library/src/config/config.service';
import { Logger } from '@nestjs/common';
import { microServiceKafka } from '../core-library/src/config/kafka.service';
import { KafkaConstants } from '../core-library/src/common/constants/kafka.constant';


async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger
  });
  const configService = app.get(ConfigService);
  app.useLogger(logger);
  if(KafkaConstants.General.LOGS_ENABLED){
    logger.log(`Kafka config: ${JSON.stringify(microServiceKafka)}`)
    logger.log(`Kafka Global config: ${JSON.stringify(KafkaConstants)}`)
  }
  app.connectMicroservice(microServiceKafka);
  await app.startAllMicroservices();

  await app.listen(configService.port);
}
bootstrap();
