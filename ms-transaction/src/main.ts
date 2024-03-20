import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createDocument } from './shared/config/swagger/swagger';

async function bootstrap() {
  try {
    const env = process.env.NODE_ENV;
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER, 'localhost:9092'],
        },
        consumer: {
          groupId: 'antifraude-consumer',
          allowAutoTopicCreation: true,
        },
      },
    });
    if (env !== 'production') {
      SwaggerModule.setup('doc', app, createDocument(app));
    }
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3000);
    Logger.log(
      `🚀  Server running on http://localhost:${process.env.PORT || 3000}`,
      'Bootstrap',
      false,
    );
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit();
  }
}
bootstrap().catch((error) => {
  Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
  throw error;
});
