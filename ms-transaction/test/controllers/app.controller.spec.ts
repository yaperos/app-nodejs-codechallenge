import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@src/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "[TRANSACTION] Yape Ninja 🥷"', () => {
      expect(appController.appStatus()).toBe(`[TRANSACTION] Yape Ninja 🥷`);
    });
  });
});
