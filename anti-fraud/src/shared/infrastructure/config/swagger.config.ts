import { INestApplication } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default registerAs('swagger', () => ({
  tittle: 'Anti Fraud',
  path: '/doc',
  version: '1.0',
}));

export const buildDocument = (
  app: INestApplication,
  configService: ConfigService,
) => {
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.tittle'))
    .setVersion(configService.get<string>('swagger.version'))
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, config);
};
