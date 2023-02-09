import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmConfigService } from './type-orm-config.service';

describe('TypeOrmConfigService', () => {
  let service: TypeOrmConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'database') {
                return {
                  host: 'localhost',
                  port: 6379,
                  database: 'yape',
                  password: 'password',
                  username: 'username',
                };
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
    module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return typeorm config', () => {
    expect(service.createTypeOrmOptions()).toEqual(
      expect.objectContaining({
        host: 'localhost',
        database: 'yape',
        password: 'password',
        username: 'username',
      }),
    );
  });
});
