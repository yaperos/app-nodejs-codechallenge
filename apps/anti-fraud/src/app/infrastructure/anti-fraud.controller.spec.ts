import { Test, TestingModule } from '@nestjs/testing';

import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from '../application/anti-fraud.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [AntiFraudService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AntiFraudController>(AntiFraudController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
