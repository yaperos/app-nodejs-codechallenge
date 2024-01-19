import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmptyLogger } from 'tests/unit/modules/shared/infrastructure/logger/empty-logger';

import { AppModule } from '../../../src/app.module';
import { startAllMicroservices } from '../../../src/config/app';

let application: INestApplication;

BeforeAll(async () => {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .setLogger(new EmptyLogger())
    .compile();

  application = testingModule.createNestApplication();
  await startAllMicroservices(application);
  await application.init();
});

AfterAll({ timeout: 10000 }, async () => {
  await application.close();
});

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export { application, sleep };
