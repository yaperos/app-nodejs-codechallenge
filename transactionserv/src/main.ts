import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  
  const appConfig = new AppConfig();

  app.enableCors({ origin: appConfig.allowedOrigins });
  app.setGlobalPrefix(appConfig.globalPrefix);
  
  await app.listen(appConfig.port, () => {
    console.log(`Server listening on port ${appConfig.port}`);
  });
}
bootstrap();