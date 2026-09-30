async function bootstrap(): Promise<void> {

  const { ValidationPipe } = await import('@nestjs/common');
  const { ConfigService } = await import('@nestjs/config');
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module.js');


  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('PORT', 3000));
}

void bootstrap();
