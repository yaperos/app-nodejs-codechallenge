import { Test, TestingModule } from '@nestjs/testing';
import { TransfertypesResolver } from './transfertypes.resolver';
import { TransfertypesService } from './transfertypes.service';

describe('TransfertypesResolver', () => {
  let resolver: TransfertypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfertypesResolver, TransfertypesService],
    }).compile();

    resolver = module.get<TransfertypesResolver>(TransfertypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
