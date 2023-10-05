import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const dns:string = process.env.DNS;
  const kafkaPort:string = process.env.KAFKA_PORT
  const broker: string = `${dns}:${kafkaPort}`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [broker],
        },
        consumer: {
          groupId: 'anti-fraud-validated',
        },
      }, 
    }
  );
  await app.listen();
}
bootstrap();
