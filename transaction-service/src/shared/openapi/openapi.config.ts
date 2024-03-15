import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Cargo Solutions Service')
    .setDescription('Service for register all packages and status of them')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${process.env.PREFIX}/docs`, app, document);
};
