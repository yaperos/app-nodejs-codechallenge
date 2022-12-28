import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'transaction-consumer',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  } as MicroserviceOptions);

  const config = new DocumentBuilder()
      .setTitle('Financial transaction')
      .setDescription('')
      .setVersion('1.0');

  const documentBuild = config.build();

  const document = SwaggerModule.createDocument(app, documentBuild);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
