import { NestFactory } from '@nestjs/core';

import { TransactionsApiModule } from './transactions-api.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsApiModule);
  await app.listen(process.env.port ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
