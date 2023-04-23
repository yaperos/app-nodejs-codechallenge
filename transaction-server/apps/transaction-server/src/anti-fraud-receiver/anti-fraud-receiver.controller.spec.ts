import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudReceiverController } from './anti-fraud-receiver.controller';
import { AntiFraudReceiverService } from './anti-fraud-receiver.service';

describe('AntiFraudReceiverController', () => {
  let controller: AntiFraudReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudReceiverController],
      providers: [AntiFraudReceiverService],
    }).compile();

    controller = module.get<AntiFraudReceiverController>(AntiFraudReceiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
