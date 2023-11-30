import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const validatorService = app.get(AppService); // Obtén una instancia del servicio para escuchar evento de kafka

  await validatorService.initValidation();
  await app.listen(3000);
}
bootstrap();
