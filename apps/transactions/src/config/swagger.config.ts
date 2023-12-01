import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export class SwaggerConfig {
  static config = new DocumentBuilder()
    .setTitle('Yape Code Challenge')
    .setDescription('Developer: Luiscarlo Tarazona')
    .setVersion('1.0')
    // .addTag('yape')
    .build();

  static setup = (app: INestApplication<any>) => {
    const document = SwaggerModule.createDocument(app, this.config);
    SwaggerModule.setup('api', app, document);
  };
}
