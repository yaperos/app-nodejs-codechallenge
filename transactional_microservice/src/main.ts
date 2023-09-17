import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [process.env.KAFKA_SERVER],
  //       ssl: true,
  //       sasl: {
  //         mechanism: 'plain',
  //         username: process.env.KAFKA_KEY,
  //         password: process.env.KAFKA_SECRET,
  //       },
  //     },
  //     // producerOnlyMode: true,
  //     consumer: {
  //       groupId: 'kafka-consumer', // Should be the same thing we give in consumer
  //     },
  //     subscribe: {
  //       fromBeginning: true,
  //     },
  //   },
  // });
  // app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
