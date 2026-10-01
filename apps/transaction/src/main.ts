import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransactionModule } from './transaction.module';
import { createValidationPipe } from './validation';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(createValidationPipe());

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Transactions API')
      .setDescription(
        'Creates transactions (pending) and exposes their anti-fraud result',
      )
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`Transaction service listening on ${port}`, 'Bootstrap');
}
void bootstrap();
