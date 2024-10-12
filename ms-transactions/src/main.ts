import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Swagger } from './classes/Swagger.class';
import { ClassValidator } from './classes/ClassValidator.class';
require('dotenv').config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Swagger.config(app);
  
  app.useGlobalPipes(new ClassValidator());
  app.use(helmet());

  await app.listen(process.env.APP_PORT);
}
bootstrap();
