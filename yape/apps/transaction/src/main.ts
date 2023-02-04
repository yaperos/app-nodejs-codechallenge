import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {PrismaService} from "../../../src/infrastructure/prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const prismaService = app.get(PrismaService, { strict: false});
  await prismaService.enableShutdownHooks(app)

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().then();
