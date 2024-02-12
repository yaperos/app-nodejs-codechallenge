import { NestFactory } from '@nestjs/core';
import { MsModule } from './ms.module';

async function bootstrap() {
  const app = await NestFactory.create(MsModule);
  await app.listen(3000);
}
bootstrap();
