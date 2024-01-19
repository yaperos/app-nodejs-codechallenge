import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { setApplicationConfig } from 'src/config/app';
import { TRANSACTION_CLIENT_PROVIDER_ALIAS } from 'src/modules/transaction/domain/providers/transaction-client.provider';
import { EmptyLogger } from 'tests/unit/modules/shared/infrastructure/logger/empty-logger';
import { MockTransactionClientProvider } from 'tests/unit/modules/transaction/domain/providers/mock-transaction-client.provider';

import Actions from './actions';
import Expects from './expects';

const getTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .setLogger(new EmptyLogger())
    .overrideProvider(TRANSACTION_CLIENT_PROVIDER_ALIAS)
    .useValue(new MockTransactionClientProvider())
    .compile();

  const app = moduleFixture.createNestApplication();
  setApplicationConfig(app);
  return app;
};

export default {
  ...Actions,
  ...Expects,
  getTestingApp,
};
