import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudController', () => {
  let antiFraudController: AntiFraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [AntiFraudService],
    }).compile();

    antiFraudController = app.get<AntiFraudController>(AntiFraudController);
  });

});
