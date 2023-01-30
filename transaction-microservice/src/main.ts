import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';
import { ResponseFormat } from './infrastructure/common/interceptors/response.interceptors';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));


  //Swagger documentation. Only for dev enviroment
  if(env !== 'production'){
    const configuration = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Yape Code Challenge')
      .setDescription('Transaction microservice')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, configuration, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true
    });
    SwaggerModule.setup('api', app, document)
  }

  await app.listen(3000);
}
bootstrap();
