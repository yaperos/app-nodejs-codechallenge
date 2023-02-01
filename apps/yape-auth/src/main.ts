import { NestFactory } from '@nestjs/core';
import { YapeAuthModule } from './yape-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(YapeAuthModule);
  await app.listen(3000);
}
bootstrap();
