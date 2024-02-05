import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppService } from './app.service';
import tracer from './modules/core/distribution/tracer';

async function bootstrap() {
  tracer.start();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = AppService.port;
  await app.listen(port);
}
bootstrap();
