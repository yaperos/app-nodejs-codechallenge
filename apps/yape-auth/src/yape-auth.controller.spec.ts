import { Test, TestingModule } from '@nestjs/testing';
import { YapeAuthController } from './yape-auth.controller';
import { YapeAuthService } from './yape-auth.service';

describe('YapeAuthController', () => {
  let yapeAuthController: YapeAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [YapeAuthController],
      providers: [YapeAuthService],
    }).compile();

    yapeAuthController = app.get<YapeAuthController>(YapeAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(yapeAuthController.getHello()).toBe('Hello World!');
    });
  });
});
