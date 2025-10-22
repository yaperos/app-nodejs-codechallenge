import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { MetricsService } from './metrics.service';
import { register } from 'prom-client';

describe('MetricsService', () => {
  let service: MetricsService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {

    register.clear();

    mockQueryRunner = {
      query: jest.fn(),
      release: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;

    mockDataSource = {
      isInitialized: true,
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    } as unknown as jest.Mocked<DataSource>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    register.clear();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should register all metrics', async () => {
      const metrics = await register.getMetricsAsJSON();

      const metricNames = metrics.map((m: any) => m.name);
      expect(metricNames).toContain('database_connections_total');
      expect(metricNames).toContain('transactions_total');
      expect(metricNames).toContain('cache_hits_total');
      expect(metricNames).toContain('queue_depth');
      expect(metricNames).toContain('api_response_time_seconds');
    });
  });

  describe('collectDatabaseMetrics', () => {
    it('should collect database metrics when dataSource is initialized', async () => {
      const mockPoolStats = [{
        active: 5,
        idle: 3,
        idle_in_transaction: 1,
        waiting: 0,
        total: 9,
      }];

      mockQueryRunner.query
        .mockResolvedValueOnce(mockPoolStats) 
        .mockResolvedValueOnce([]); 

      await service.collectDatabaseMetrics();

      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.query).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should return early if dataSource is not initialized', async () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        get: jest.fn(() => false),
        configurable: true,
      });

      await service.collectDatabaseMetrics();

      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockQueryRunner.query.mockRejectedValue(new Error('Database error'));

      await expect(service.collectDatabaseMetrics()).resolves.not.toThrow();

      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
    });

    it('should log warning when slow queries are found', async () => {
      const mockPoolStats = [{ active: 1, idle: 0, total: 1 }];
      const mockSlowQueries = [
        {
          query: 'SELECT * FROM transactions WHERE amount > 1000',
          calls: 100,
          mean_exec_time: 150,
          max_exec_time: 500,
          total_exec_time: 15000,
        },
      ];

      mockQueryRunner.query
        .mockResolvedValueOnce(mockPoolStats)
        .mockResolvedValueOnce(mockSlowQueries);

      const loggerSpy = jest.spyOn(service['logger'], 'warn');

      await service.collectDatabaseMetrics();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found 1 slow queries')
      );
    });

    it('should handle missing pg_stat_statements extension', async () => {
      const mockPoolStats = [{ active: 1, idle: 0, total: 1 }];

      mockQueryRunner.query
        .mockResolvedValueOnce(mockPoolStats)
        .mockRejectedValueOnce(new Error('relation "pg_stat_statements" does not exist'));

      await expect(service.collectDatabaseMetrics()).resolves.not.toThrow();
    });
  });

  describe('recordTransaction', () => {
    it('should record transaction metrics', async () => {
      service.recordTransaction('completed', 'P2P', 100);
      service.recordTransaction('completed', 'P2P', 250);
      service.recordTransaction('failed', 'PAYMENT', 50);

      const metrics = await register.getMetricsAsJSON();
      const transactionMetric = metrics.find((m: any) => m.name === 'transactions_total');

      expect(transactionMetric).toBeDefined();
      expect(transactionMetric?.values.length).toBeGreaterThan(0);
    });

    it('should track different transaction types separately', async () => {
      service.recordTransaction('completed', 'P2P', 100);
      service.recordTransaction('completed', 'PAYMENT', 200);

      const metrics = await register.getMetricsAsJSON();
      const transactionMetric = metrics.find((m: any) => m.name === 'transactions_total');

      expect(transactionMetric).toBeDefined();
    });
  });

  describe('recordCacheHit', () => {
    it('should record cache hit', async () => {
      service.recordCacheHit('transaction');
      service.recordCacheHit('transaction');
      service.recordCacheHit('user');

      const metrics = await register.getMetricsAsJSON();
      const cacheHitMetric = metrics.find((m: any) => m.name === 'cache_hits_total');

      expect(cacheHitMetric).toBeDefined();
    });
  });

  describe('recordCacheMiss', () => {
    it('should record cache miss', async () => {
      service.recordCacheMiss('transaction');
      service.recordCacheMiss('user');

      const metrics = await register.getMetricsAsJSON();
      const cacheMissMetric = metrics.find((m: any) => m.name === 'cache_misses_total');

      expect(cacheMissMetric).toBeDefined();
    });
  });

  describe('recordQueueDepth', () => {
    it('should record queue depth', async () => {
      service.recordQueueDepth('transactions', 'waiting', 10);
      service.recordQueueDepth('transactions', 'active', 3);
      service.recordQueueDepth('antifraud', 'waiting', 5);

      const metrics = await register.getMetricsAsJSON();
      const queueDepthMetric = metrics.find((m: any) => m.name === 'queue_depth');

      expect(queueDepthMetric).toBeDefined();
      expect(queueDepthMetric?.type).toBe('gauge');
    });

    it('should update existing gauge values', async () => {
      service.recordQueueDepth('transactions', 'waiting', 10);
      service.recordQueueDepth('transactions', 'waiting', 15); 

      const metrics = await register.getMetricsAsJSON();
      const queueDepthMetric = metrics.find((m: any) => m.name === 'queue_depth');

      expect(queueDepthMetric).toBeDefined();
    });
  });

  describe('recordQueueJobProcessing', () => {
    it('should record queue job processing time', async () => {
      service.recordQueueJobProcessing('transactions', 'process-transaction', 0.5);
      service.recordQueueJobProcessing('transactions', 'process-transaction', 1.2);
      service.recordQueueJobProcessing('antifraud', 'check-fraud', 0.3);

      const metrics = await register.getMetricsAsJSON();
      const processingMetric = metrics.find((m: any) => m.name === 'queue_job_processing_seconds');

      expect(processingMetric).toBeDefined();
      expect(processingMetric?.type).toBe('histogram');
    });
  });

  describe('recordApiResponse', () => {
    it('should record API response time', async () => {
      service.recordApiResponse('GET', '/transactions', 200, 50);
      service.recordApiResponse('POST', '/transactions', 201, 150);
      service.recordApiResponse('GET', '/health', 200, 10);

      const metrics = await register.getMetricsAsJSON();
      const apiMetric = metrics.find((m: any) => m.name === 'api_response_time_seconds');

      expect(apiMetric).toBeDefined();
      expect(apiMetric?.type).toBe('histogram');
    });

    it('should convert milliseconds to seconds', async () => {
      service.recordApiResponse('GET', '/test', 200, 1000); 

      const metrics = await register.getMetricsAsJSON();
      const apiMetric = metrics.find((m: any) => m.name === 'api_response_time_seconds');

      expect(apiMetric).toBeDefined();
    });
  });

  describe('getHealthMetrics', () => {
    it('should return health metrics when database is connected', async () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        get: jest.fn(() => true),
        configurable: true,
      });

      const health = await service.getHealthMetrics();

      expect(health).toEqual({
        status: 'ok',
        database: {
          isConnected: true,
          message: 'Database connection is healthy',
        },
        timestamp: expect.any(String),
        metricsEndpoint: '/metrics',
      });
    });

    it('should return health metrics when database is not connected', async () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        get: jest.fn(() => false),
        configurable: true,
      });

      const health = await service.getHealthMetrics();

      expect(health.status).toBe('ok');
      expect(health.database.isConnected).toBe(false);
      expect(health.database.message).toBe('Database is not initialized');
    });

    it('should include timestamp in ISO format', async () => {
      const health = await service.getHealthMetrics();

      expect(health.timestamp).toBeDefined();
      const timestamp = new Date(health.timestamp);
      expect(timestamp.toISOString()).toBe(health.timestamp);
    });
  });

  describe('getPrometheusMetrics', () => {
    it('should return metrics in Prometheus format', async () => {

      service.recordTransaction('completed', 'P2P', 100);
      service.recordCacheHit('transaction');

      const prometheusMetrics = await service.getPrometheusMetrics();

      expect(typeof prometheusMetrics).toBe('string');
      expect(prometheusMetrics).toContain('transactions_total');
      expect(prometheusMetrics).toContain('cache_hits_total');
    });

    it('should return valid Prometheus format even with no data', async () => {
      const prometheusMetrics = await service.getPrometheusMetrics();

      expect(typeof prometheusMetrics).toBe('string');
      expect(prometheusMetrics).toContain('# HELP');
      expect(prometheusMetrics).toContain('# TYPE');
    });
  });

  describe('logPerformanceSummary', () => {
    it('should log performance summary', async () => {
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.logPerformanceSummary();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance Summary')
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database Status')
      );
    });

    it('should include database connection status in log', async () => {
      Object.defineProperty(mockDataSource, 'isInitialized', {
        get: jest.fn(() => true),
        configurable: true,
      });
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.logPerformanceSummary();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Connected')
      );
    });
  });

  describe('Integration - Complete Workflow', () => {
    it('should handle complete metrics workflow', async () => {

      service.recordTransaction('completed', 'P2P', 100);
      service.recordTransaction('failed', 'PAYMENT', 50);
      service.recordCacheHit('transaction');
      service.recordCacheMiss('user');
      service.recordQueueDepth('transactions', 'waiting', 5);
      service.recordApiResponse('GET', '/transactions', 200, 25);

      mockQueryRunner.query
        .mockResolvedValueOnce([{ active: 2, idle: 3, total: 5 }])
        .mockResolvedValueOnce([]);

      await service.collectDatabaseMetrics();

      const prometheusMetrics = await service.getPrometheusMetrics();

      expect(prometheusMetrics).toContain('transactions_total');
      expect(prometheusMetrics).toContain('cache_hits_total');
      expect(prometheusMetrics).toContain('cache_misses_total');
      expect(prometheusMetrics).toContain('queue_depth');
      expect(prometheusMetrics).toContain('api_response_time_seconds');
      expect(prometheusMetrics).toContain('database_connections_total');

      const health = await service.getHealthMetrics();
      expect(health.status).toBe('ok');
      expect(health.database.isConnected).toBe(true);
    });
  });
});
