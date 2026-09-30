import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { ProxyService } from '../proxy/proxy.service';

@ApiTags('health')
@SkipThrottle()
@Controller()
export class HealthController {
    constructor(private readonly proxy: ProxyService) { }

    @Get('health')
    live(): { status: string } {
        return { status: 'ok' };
    }

    @Get('health/ready')
    async ready(): Promise<{ status: string; upstreams: Record<string, string> }> {
        const up = await this.proxy.ping();
        const upstreams = { 'transaction-service': up ? 'up' : 'down' };
        if (!up) throw new ServiceUnavailableException({ status: 'degraded', upstreams });
        return { status: 'ready', upstreams };
    }
}