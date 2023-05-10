import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudSystemController } from './anti-fraud-system.controller';
import { AntiFraudSystemService } from './anti-fraud-system.service';

describe('AntiFraudSystemController', () => {
  let antiFraudSystemController: AntiFraudSystemController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudSystemController],
      providers: [AntiFraudSystemService],
    }).compile();

    antiFraudSystemController = app.get<AntiFraudSystemController>(
      AntiFraudSystemController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(antiFraudSystemController.getHello()).toBe('Hello World!');
    });
  });
});
