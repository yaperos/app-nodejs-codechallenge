import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * The entry file of the application which uses the core
 * function NestFactory to create a Nest application instance.
 * (Arranque inicial de la aplicacion)
 * 
 * @author RRG
 */
async function bootstrap() {
  const httpapp = await NestFactory.create(AppModule);


  /** Provide GlobalPrefix service and exclude health base path */
  httpapp.setGlobalPrefix(process.env.API_ADDRESS, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  httpapp.enableCors();

  httpapp.enableCors();
  httpapp.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('MS Desafio Tecnico')
    .setDescription('MS Desafio Tecnico YAPE')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(httpapp, options);

  SwaggerModule.setup('api', httpapp, document);


  await httpapp.listen(3001);
}
bootstrap();
