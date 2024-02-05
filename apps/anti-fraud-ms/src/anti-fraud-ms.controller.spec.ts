import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudMsController } from './anti-fraud-ms.controller';
import { AntiFraudMsService } from './anti-fraud-ms.service';

describe('AntiFraudMsController', () => {
  let antiFraudMsController: AntiFraudMsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudMsController],
      providers: [AntiFraudMsService],
    }).compile();

    antiFraudMsController = app.get<AntiFraudMsController>(AntiFraudMsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(antiFraudMsController.getHello()).toBe('Hello World!');
    });
  });
});
