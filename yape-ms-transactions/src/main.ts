import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

/* Project */
import { AppModule } from './app.module';
import { TransactionProto } from './common/constants/grpc.constants';

async function bootstrap() {
  const url = `${process.env.HOST}:${process.env.PORT}`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url,
        package: TransactionProto.package,
        protoPath: TransactionProto.protoPath,
      },
    },
  );

  app.enableShutdownHooks();

  const logger = new Logger('Bootstrap');

  await app.listen().then(() => {
    logger.log(`Microservice is listening on ${url}`);
  });
}

bootstrap();
