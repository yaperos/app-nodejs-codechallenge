import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfigService } from './cache-config.service';

describe('CacheConfigService', () => {
  let service: CacheConfigService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'redis') {
                return {
                  host: 'localhost',
                  port: 6379,
                };
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheConfigService>(CacheConfigService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return redis config', () => {
    expect(service.createCacheOptions()).toEqual(
      expect.objectContaining({
        ttl: 30,
        isGlobal: true,
        host: 'localhost',
        port: 6379,
      }),
    );
  });
});
