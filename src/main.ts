import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api') 
  await app.listen(configService.get('PORT'));
  console.log(`Application running on: ${await app.getUrl()}`);

}
bootstrap();
