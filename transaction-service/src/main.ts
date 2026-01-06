import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { startTransactionStatusConsumer } from './kafka/transaction-status.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const prisma = app.get(PrismaService);
  await startTransactionStatusConsumer(prisma);
  await app.listen(3000);
}
bootstrap();