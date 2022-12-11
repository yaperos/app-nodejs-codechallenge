import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [AntiFraudService],
    }).compile();

    controller = module.get<AntiFraudController>(AntiFraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
