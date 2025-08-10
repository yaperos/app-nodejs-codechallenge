import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /', () => {
    it('should return hello payload from service', () => {
      expect(appController.hello()).toEqual({ message: 'Hello!' });
    });
  });
});
