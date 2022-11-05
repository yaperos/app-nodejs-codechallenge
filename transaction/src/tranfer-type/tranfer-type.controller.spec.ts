import { Test, TestingModule } from '@nestjs/testing';
import { TranferTypeController } from './tranfer-type.controller';
import { TranferTypeService } from './tranfer-type.service';

describe('TranferTypeController', () => {
  let controller: TranferTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranferTypeController],
      providers: [TranferTypeService],
    }).compile();

    controller = module.get<TranferTypeController>(TranferTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
