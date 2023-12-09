import { Test, TestingModule } from '@nestjs/testing';
import { MsAntifraudController } from './ms-antifraud.controller';
import { MsAntifraudService } from './ms-antifraud.service';

describe('MsAntifraudController', () => {
  let msAntifraudController: MsAntifraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsAntifraudController],
      providers: [MsAntifraudService],
    }).compile();

    msAntifraudController = app.get<MsAntifraudController>(MsAntifraudController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msAntifraudController.getHello()).toBe('Hello World!');
    });
  });
});
