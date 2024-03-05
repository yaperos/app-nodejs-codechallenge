import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';

describe('AntifraudController', () => {
  let controller: AntifraudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntifraudController],
      providers: [AntifraudService],
    }).compile();

    controller = module.get<AntifraudController>(AntifraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
