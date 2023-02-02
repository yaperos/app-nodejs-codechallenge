import { Test, TestingModule } from '@nestjs/testing';
import { YapeAntiFraudController } from './yape-anti-fraud.controller';
import { YapeAntiFraudService } from './yape-anti-fraud.service';

describe('YapeAntiFraudController', () => {
  let yapeAntiFraudController: YapeAntiFraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [YapeAntiFraudController],
      providers: [YapeAntiFraudService],
    }).compile();

    yapeAntiFraudController = app.get<YapeAntiFraudController>(YapeAntiFraudController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(yapeAntiFraudController.getHello()).toBe('Hello World!');
    });
  });
});
