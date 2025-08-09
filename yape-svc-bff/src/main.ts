import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

/* Project */
import { AppModule } from './app.module';
import { GrpcToGqlExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  app.setGlobalPrefix(process.env.API_PREFIX ?? '');

  app.useGlobalFilters(new GrpcToGqlExceptionFilter());

  const logger = new Logger('Bootstrap');

  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}

bootstrap();
