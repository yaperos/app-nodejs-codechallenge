import { Test, TestingModule } from '@nestjs/testing';
import { MsAntiFraudController } from './ms-anti-fraud.controller';
import { MsAntiFraudService } from './ms-anti-fraud.service';

describe('MsAntiFraudController', () => {
  let msAntiFraudController: MsAntiFraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsAntiFraudController],
      providers: [MsAntiFraudService],
    }).compile();

    msAntiFraudController = app.get<MsAntiFraudController>(MsAntiFraudController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msAntiFraudController.getHello()).toBe('Hello World!');
    });
  });
});
