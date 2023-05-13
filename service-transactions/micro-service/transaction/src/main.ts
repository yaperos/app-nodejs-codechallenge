import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PrismaService} from "../../../src/prisma/prisma.service";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService, { strict: false});
  await prismaService.enableShutdownHooks(app)
  await app.listen(3007);
  console.log(`Application : ${await app.getUrl()}`);
}
bootstrap().then();
