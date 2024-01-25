import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigEnv } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ConfigEnv.port, () => {
    console.log(`Transaction service is running on port ${ConfigEnv.port}`);
  });
}
bootstrap();
