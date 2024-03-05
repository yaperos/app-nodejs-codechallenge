import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EnvironmentService } from './common/config/environment/environment.config';
import { TransactionKafkaConfigService } from './common/config/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const transactionKafkaConfigService = app.get(TransactionKafkaConfigService);
  const environmentService = app.get(EnvironmentService);
  const port = environmentService.apiPort;

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.connectMicroservice<MicroserviceOptions>(
    transactionKafkaConfigService.createClientOptions(),
  );

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
