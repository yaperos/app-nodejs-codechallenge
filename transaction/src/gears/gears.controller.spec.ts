import { Test, TestingModule } from '@nestjs/testing';
import { GearsController } from './gears.controller';
import { GearsService } from './gears.service';

describe('GearsController', () => {
  let controller: GearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GearsController],
      providers: [GearsService],
    }).compile();

    controller = module.get<GearsController>(GearsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
