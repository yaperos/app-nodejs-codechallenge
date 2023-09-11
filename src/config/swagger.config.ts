import { INestApplication } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default registerAs('swagger', () => ({
  tittle: 'Yape',
  description: 'La demo se encarga de validar si la transacción fue exitosa o no',
  path: '/doc',
  version: '1.0',
  nameTag: 'yape-transactions'
}));

export const buildDocument = (app: INestApplication, configService: ConfigService) => {
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.tittle'))
    .setDescription(configService.get<string>('swagger.description'))
    .setVersion(configService.get<string>('swagger.version'))
    .addTag(configService.get<string>('swagger.nameTag'))
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, config);
};
