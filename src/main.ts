import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(3333);
  } catch (error) {
    console.error(`Error al iniciar la aplicación! ${error}`);
  }
}
bootstrap();
