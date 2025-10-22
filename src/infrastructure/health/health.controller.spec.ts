import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let dbHealthIndicator: jest.Mocked<TypeOrmHealthIndicator>;
  let memoryHealthIndicator: jest.Mocked<MemoryHealthIndicator>;
  let diskHealthIndicator: jest.Mocked<DiskHealthIndicator>;

  beforeEach(async () => {
    const mockHealthCheckResult = {
      status: 'ok',
      info: {},
      error: {},
      details: {},
    };

    healthCheckService = {
      check: jest.fn().mockImplementation(async (indicators) => {

        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthCheckResult;
      }),
    } as unknown as jest.Mocked<HealthCheckService>;

    dbHealthIndicator = {
      pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
    } as unknown as jest.Mocked<TypeOrmHealthIndicator>;

    memoryHealthIndicator = {
      checkHeap: jest.fn().mockResolvedValue({ memory_heap: { status: 'up' } }),
      checkRSS: jest.fn().mockResolvedValue({ memory_rss: { status: 'up' } }),
    } as unknown as jest.Mocked<MemoryHealthIndicator>;

    diskHealthIndicator = {
      checkStorage: jest.fn().mockResolvedValue({ storage: { status: 'up' } }),
    } as unknown as jest.Mocked<DiskHealthIndicator>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: healthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: dbHealthIndicator,
        },
        {
          provide: MemoryHealthIndicator,
          useValue: memoryHealthIndicator,
        },
        {
          provide: DiskHealthIndicator,
          useValue: diskHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('check', () => {
    it('should return health check result', async () => {
      const result = await controller.check();

      expect(healthCheckService.check).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'ok',
        info: {},
        error: {},
        details: {},
      });
    });

    it('should check database health', async () => {
      await controller.check();

      expect(healthCheckService.check).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should configure health check with 4 indicators', async () => {
      await controller.check();

      const checkFunctions = healthCheckService.check.mock.calls[0]?.[0];

      expect(checkFunctions).toHaveLength(4);
    });

    it('should call database ping check', async () => {
      await controller.check();

      expect(dbHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    });

    it('should call memory heap check with 150MB limit', async () => {
      await controller.check();

      expect(memoryHealthIndicator.checkHeap).toHaveBeenCalledWith(
        'memory_heap',
        150 * 1024 * 1024
      );
    });

    it('should call memory RSS check with 150MB limit', async () => {
      await controller.check();

      expect(memoryHealthIndicator.checkRSS).toHaveBeenCalledWith(
        'memory_rss',
        150 * 1024 * 1024
      );
    });

    it('should call disk storage check with 90% threshold', async () => {
      await controller.check();

      expect(diskHealthIndicator.checkStorage).toHaveBeenCalledWith('storage', {
        path: '/',
        thresholdPercent: 0.9,
      });
    });
  });

  describe('liveness', () => {
    it('should return liveness status', () => {
      const result = controller.liveness();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should return ISO timestamp', () => {
      const result = controller.liveness();

      const date = new Date(result.timestamp);
      expect(date.toISOString()).toBe(result.timestamp);
    });

    it('should return current timestamp', () => {
      const before = Date.now();
      const result = controller.liveness();
      const after = Date.now();

      const timestamp = new Date(result.timestamp).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('readiness', () => {
    it('should return readiness check result', async () => {
      const result = await controller.readiness();

      expect(healthCheckService.check).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'ok',
        info: {},
        error: {},
        details: {},
      });
    });

    it('should only check database for readiness', async () => {
      await controller.readiness();

      const checkFunctions = healthCheckService.check.mock.calls[0]?.[0];

      expect(checkFunctions).toHaveLength(1);
    });
  });
});
