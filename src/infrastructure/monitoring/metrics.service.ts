import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Gauge, Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  private readonly dbConnectionsGauge = new Gauge({
    name: 'database_connections_total',
    help: 'Total number of database connections',
    labelNames: ['state'],
  });

  private readonly dbQueryDurationHistogram = new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['operation', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  });

  private readonly transactionCounter = new Counter({
    name: 'transactions_total',
    help: 'Total number of transactions',
    labelNames: ['status', 'type'],
  });

  private readonly transactionAmountHistogram = new Histogram({
    name: 'transaction_amount',
    help: 'Transaction amount distribution',
    labelNames: ['status'],
    buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  });

  private readonly cacheHitCounter = new Counter({
    name: 'cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['key_type'],
  });

  private readonly cacheMissCounter = new Counter({
    name: 'cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['key_type'],
  });

  private readonly queueDepthGauge = new Gauge({
    name: 'queue_depth',
    help: 'Number of jobs in queue',
    labelNames: ['queue_name', 'status'],
  });

  private readonly queueProcessingTimeHistogram = new Histogram({
    name: 'queue_job_processing_seconds',
    help: 'Queue job processing time in seconds',
    labelNames: ['queue_name', 'job_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
  });

  private readonly apiResponseTimeHistogram = new Histogram({
    name: 'api_response_time_seconds',
    help: 'API response time in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  });

  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {
    this.registerMetrics();
  }

  private registerMetrics() {
    register.registerMetric(this.dbConnectionsGauge);
    register.registerMetric(this.dbQueryDurationHistogram);
    register.registerMetric(this.transactionCounter);
    register.registerMetric(this.transactionAmountHistogram);
    register.registerMetric(this.cacheHitCounter);
    register.registerMetric(this.cacheMissCounter);
    register.registerMetric(this.queueDepthGauge);
    register.registerMetric(this.queueProcessingTimeHistogram);
    register.registerMetric(this.apiResponseTimeHistogram);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async collectDatabaseMetrics() {
    try {
      if (!this.dataSource.isInitialized) {
        return;
      }

      const queryRunner = this.dataSource.createQueryRunner();

      const poolStats = await queryRunner.query(`
        SELECT
          count(*) FILTER (WHERE state = 'active') as active,
          count(*) FILTER (WHERE state = 'idle') as idle,
          count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction,
          count(*) FILTER (WHERE wait_event_type IS NOT NULL) as waiting,
          count(*) as total
        FROM pg_stat_activity
        WHERE datname = current_database()
      `);

      if (poolStats && poolStats[0]) {
        this.dbConnectionsGauge.set({ state: 'active' }, poolStats[0].active || 0);
        this.dbConnectionsGauge.set({ state: 'idle' }, poolStats[0].idle || 0);
        this.dbConnectionsGauge.set({ state: 'idle_in_transaction' }, poolStats[0].idle_in_transaction || 0);
        this.dbConnectionsGauge.set({ state: 'waiting' }, poolStats[0].waiting || 0);
        this.dbConnectionsGauge.set({ state: 'total' }, poolStats[0].total || 0);
      }

      const slowQueries = await queryRunner.query(`
        SELECT
          query,
          calls,
          mean_exec_time,
          max_exec_time,
          total_exec_time
        FROM pg_stat_statements
        WHERE mean_exec_time > 100
        ORDER BY mean_exec_time DESC
        LIMIT 10
      `).catch(() => []);

      if (slowQueries.length > 0) {
        this.logger.warn(`Found ${slowQueries.length} slow queries (>100ms)`);
      }

      await queryRunner.release();
    } catch (error) {
      this.logger.error('Error collecting database metrics', error);
    }
  }

  recordTransaction(status: string, type: string, amount: number) {
    this.transactionCounter.inc({ status, type });
    this.transactionAmountHistogram.observe({ status }, amount);
  }

  recordCacheHit(keyType: string) {
    this.cacheHitCounter.inc({ key_type: keyType });
  }

  recordCacheMiss(keyType: string) {
    this.cacheMissCounter.inc({ key_type: keyType });
  }

  recordQueueDepth(queueName: string, status: string, depth: number) {
    this.queueDepthGauge.set({ queue_name: queueName, status }, depth);
  }

  recordQueueJobProcessing(queueName: string, jobType: string, duration: number) {
    this.queueProcessingTimeHistogram.observe({ queue_name: queueName, job_type: jobType }, duration);
  }

  recordApiResponse(method: string, route: string, statusCode: number, duration: number) {
    this.apiResponseTimeHistogram.observe(
      { method, route, status_code: statusCode.toString() },
      duration / 1000,
    );
  }

  async getHealthMetrics() {
    const dbStats = this.dataSource.isInitialized ? {
      isConnected: true,
      message: 'Database connection is healthy',
    } : {
      isConnected: false,
      message: 'Database is not initialized',
    };

    return {
      status: 'ok',
      database: dbStats,
      timestamp: new Date().toISOString(),
      metricsEndpoint: '/metrics',
    };
  }

  async getPrometheusMetrics(): Promise<string> {
    return register.metrics();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async logPerformanceSummary() {
    const healthMetrics = await this.getHealthMetrics();

    this.logger.log(`Performance Summary:
      - Database Status: ${healthMetrics.database.isConnected ? 'Connected' : 'Disconnected'}
      - Timestamp: ${healthMetrics.timestamp}
      - Metrics available at: ${healthMetrics.metricsEndpoint}
    `);
  }

  private calculateCacheHitRate(): number {
    return 0;
  }
}