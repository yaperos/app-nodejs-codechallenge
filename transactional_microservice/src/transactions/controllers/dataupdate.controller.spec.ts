import { Test, TestingModule } from '@nestjs/testing';
import { DataupdateController } from './dataupdate.controller';

describe('DataupdateController', () => {
  let controller: DataupdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataupdateController],
    }).compile();

    controller = module.get<DataupdateController>(DataupdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
