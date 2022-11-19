import { NestFactory } from '@nestjs/core';
import { graphqlHTTP } from 'express-graphql';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
