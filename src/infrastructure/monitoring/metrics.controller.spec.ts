import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { Response } from 'express';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: jest.Mocked<MetricsService>;

  beforeEach(async () => {
    metricsService = {
      getPrometheusMetrics: jest.fn(),
      getHealthMetrics: jest.fn(),
    } as unknown as jest.Mocked<MetricsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: metricsService,
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  describe('getMetrics', () => {
    it('should return Prometheus metrics', async () => {
      const mockMetrics = '# HELP transactions_total Total number of transactions\n';
      metricsService.getPrometheusMetrics.mockResolvedValue(mockMetrics);

      const mockResponse = {
        set: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.getMetrics(mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
      expect(metricsService.getPrometheusMetrics).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalledWith(mockMetrics);
    });
  });

  describe('getHealthMetrics', () => {
    it('should return health metrics', async () => {
      const mockHealthMetrics = {
        status: 'ok',
        database: {
          isConnected: true,
          message: 'Database connection is healthy',
        },
        timestamp: new Date().toISOString(),
        metricsEndpoint: '/metrics',
      };
      metricsService.getHealthMetrics.mockResolvedValue(mockHealthMetrics);

      const result = await controller.getHealthMetrics();

      expect(metricsService.getHealthMetrics).toHaveBeenCalled();
      expect(result).toEqual(mockHealthMetrics);
    });
  });
});
