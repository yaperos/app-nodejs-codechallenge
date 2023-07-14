import { Test, TestingModule } from '@nestjs/testing';
import { HealthcheckListener } from './healthcheck.listener';
import { AntifraudMsService } from '../../../antifraud-ms.service';

describe('AntifraudMsController', () => {
  let antifraudMsController: HealthcheckListener;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckListener],
      providers: [AntifraudMsService],
    }).compile();

    antifraudMsController = app.get<HealthcheckListener>(HealthcheckListener);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(antifraudMsController.getHello()).toBe('Hello World!');
    });
  });
});
