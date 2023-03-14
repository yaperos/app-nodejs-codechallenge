import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';

describe('AppController', () => {
  let antifraudController: AntifraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntifraudController],
      providers: [AntifraudService],
    }).compile();

    antifraudController = app.get<AntifraudController>(
      AntifraudController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(antifraudController.getHello()).toBe('Hello World!');
    });
  });
});
