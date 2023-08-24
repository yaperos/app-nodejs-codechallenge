import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
    }).compile();

    controller = module.get<AntiFraudController>(AntiFraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
