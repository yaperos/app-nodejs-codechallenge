import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudsController } from './anti-frauds.controller';
import { AntiFraudsService } from './anti-frauds.service';

describe('AntiFraudsController', () => {
  let controller: AntiFraudsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudsController],
      providers: [AntiFraudsService],
    }).compile();

    controller = module.get<AntiFraudsController>(AntiFraudsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
