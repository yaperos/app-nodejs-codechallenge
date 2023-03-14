import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from '../../application/security.service';
import { SecurityController } from './security.controller';

describe('SecurityController', () => {
  let controller: SecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [SecurityService],
    }).compile();

    controller = module.get<SecurityController>(SecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
