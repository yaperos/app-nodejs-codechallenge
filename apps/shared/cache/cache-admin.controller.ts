import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CacheAdminService } from '../../shared/cache/cache-admin.service';


@Controller('admin/cache')
export class CacheAdminController {
    constructor(private readonly cacheAdminService: CacheAdminService) { }

    @Get('stats')
    async getCacheStats() {
        return this.cacheAdminService.getCacheStats();
    }

    @Get('health')
    async checkHealth() {
        return this.cacheAdminService.checkCacheHealth();
    }

    @Get('dashboard')
    async getDashboard() {
        return this.cacheAdminService.getDashboardData();
    }

    @Delete('catalogs')
    async clearCatalogs() {
        return this.cacheAdminService.clearCatalogCache();
    }


    @Delete('all')
    async clearAllCache() {
        return this.cacheAdminService.clearAllCache();
    }

    @Post('maintenance')
    async performMaintenance(
        @Body() options: {
            clearCatalogs?: boolean;
            clearTransactions?: boolean;
            warmUp?: boolean;
        } = {}
    ) {
        return this.cacheAdminService.performMaintenance(options);
    }

    @Post('troubleshoot')
    async troubleshoot(
        @Body() { scope }: { scope?: 'all' | 'catalogs' | 'transactions' } = { scope: 'all' }
    ) {
        return this.cacheAdminService.troubleshootInconsistentData(scope);
    }
}
