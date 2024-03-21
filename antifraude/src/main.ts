import { NestFactory } from '@nestjs/core';
import { AntiFraudeModule } from './anti-fraude.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from './config';

async function bootstrap() {  
  const { kafka } = config();  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AntiFraudeModule,
    {
      transport: Transport.KAFKA,
      options: kafka.options
    });
  await app.listen();
}
(async () => await bootstrap())();