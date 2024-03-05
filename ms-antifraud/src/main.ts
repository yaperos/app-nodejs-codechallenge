import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EnvironmentService } from './common/config/environment';
import { AntifraudKafkaConfigService } from './common/config/kafka/antifraud/antifraud.config';

async function bootstrap() {
  const configService = new ConfigService()
  const environmentService = new EnvironmentService(configService)
  const antifraudKafkaConfigService = new AntifraudKafkaConfigService(environmentService)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    antifraudKafkaConfigService.createClientOptions()
  )

  await app.listen()
    .then(() => console.log('ms-antifraud is listening'));
}
bootstrap();
