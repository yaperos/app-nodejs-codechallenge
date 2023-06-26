import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudService } from './antifraud.service';

describe(AntifraudService, () => {
  let service: AntifraudService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(1000),
          },
        },
      ],
    }).compile();

    service = module.get(AntifraudService);
  });

  describe('when transaction value is less than 1000', () => {
    it('should return approved', () => {
      expect(service.validateTransaction({ id: '1', value: 1000 })).toBe(
        'approved',
      );
    });
  });

  describe('when transaction value is greater than 1000', () => {
    it('should return failed', () => {
      expect(service.validateTransaction({ id: '1', value: 1001 })).toBe(
        'failed',
      );
    });
  });
});
