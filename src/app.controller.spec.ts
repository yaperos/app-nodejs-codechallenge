import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './app.controller';

describe('HealthCheckController', () => {
  let appController: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    appController = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('#healthCheck', () => {
    it('should return "OK"', () => {
      expect(appController.healthCheck()).toBe('OK');
    });
  });
});
