import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);

  const config = new DocumentBuilder()
    .setTitle('Transaction API')
    .setDescription(
      'This API supports the creation and retrieve of transactions.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
