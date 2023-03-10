import { Test, TestingModule } from '@nestjs/testing';
import { FraudsController } from './frauds.controller';

describe('FraudsController', () => {
  let controller: FraudsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraudsController],
      providers: [],
    }).compile();

    controller = module.get<FraudsController>(FraudsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
