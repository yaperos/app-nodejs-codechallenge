import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { config } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const { kafka, server } = config();  
  const app = await NestFactory.create(AppModule);  

  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('class-validator'),
      transformerPackage: require('class-transformer'),
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (server.corsEnabled) {
    app.enableCors({
      origin: server.origins,
      allowedHeaders: `${server.allowedHeaders}`,
      methods: `${server.allowedMethods}`,
      credentials: server.corsCredentials,
    });
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: kafka.options
  })
  app.startAllMicroservices();
  
  await app.listen(server.port, async () => {
    const appServer = `http://localhost:${server.port}`;
    console.log(`🚀 Application is running on: ${appServer}/graphql`);
  });

}
(async () => await bootstrap())();
