import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  process.on('SIGTERM', () => {
    app.close().then(() => {
      console.log('Application closed');
    });
  });
}
bootstrap();
