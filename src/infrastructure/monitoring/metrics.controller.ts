import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Monitoring')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ status: 200, description: 'Prometheus metrics in text format' })
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', 'text/plain');
    const metrics = await this.metricsService.getPrometheusMetrics();
    res.send(metrics);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get health metrics' })
  @ApiResponse({ status: 200, description: 'Health metrics in JSON format' })
  async getHealthMetrics() {
    return this.metricsService.getHealthMetrics();
  }
}