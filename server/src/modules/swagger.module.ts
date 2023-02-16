import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const setupSwagger = (app: INestApplication) => {
    const swaggerConfig = new DocumentBuilder()
    .setTitle('Main API')
    .setDescription(
      'The current API handles update and creation of transactions'
    ).setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
}

export default setupSwagger;