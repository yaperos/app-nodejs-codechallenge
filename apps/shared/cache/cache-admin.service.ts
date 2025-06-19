import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from './cache.service';


@Injectable()
export class CacheAdminService {
    private readonly logger = new Logger(CacheAdminService.name);

    constructor(private readonly cacheService: CacheService) { }

    async getCacheStats(): Promise<any> {
        return this.cacheService.getDetailedStats();
    }

    async clearCatalogCache(): Promise<{ success: boolean; message: string; timestamp: string }> {
        try {
            await this.cacheService.clearCatalogCache();

            return {
                success: true,
                message: 'Catalog cache cleared successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.logger.error('Error clearing catalog cache:', error);
            return {
                success: false,
                message: `Error clearing catalog cache: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async clearAllCache(): Promise<{ success: boolean; message: string; timestamp: string }> {
        try {
            await this.cacheService.clearAllCache();

            return {
                success: true,
                message: 'All application cache cleared successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.logger.error('Error clearing all cache:', error);
            return {
                success: false,
                message: `Error clearing all cache: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkCacheHealth(): Promise<{
        status: 'healthy' | 'unhealthy' | 'degraded';
        connected: boolean;
        recommendations: string[];
        details: any;
    }> {
        try {
            const stats = await this.cacheService.getDetailedStats();

            let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

            if (!stats.connected) {
                status = 'unhealthy';
            } else if (stats.recommendations.some((rec: string) => rec.includes('⚠️'))) {
                status = 'degraded';
            }

            return {
                status,
                connected: stats.connected,
                recommendations: stats.recommendations,
                details: stats
            };
        } catch (error) {
            this.logger.error('Error checking cache health:', error);
            return {
                status: 'unhealthy',
                connected: false,
                recommendations: ['🚨 Error checking cache health'],
                details: { error: error.message }
            };
        }
    }

    async performMaintenance(options: {
        clearCatalogs?: boolean;
        clearTransactions?: boolean;
        warmUp?: boolean;
    } = {}): Promise<{
        success: boolean;
        operations: string[];
        timestamp: string;
    }> {
        const operations: string[] = [];

        try {
            this.logger.log('🔧 Starting cache maintenance...');

            if (options.clearCatalogs) {
                await this.cacheService.clearCatalogCache();
                operations.push('Catalog cache cleared');
            }

            if (options.warmUp) {
                await this.cacheService.warmUpCache();
                operations.push('Cache warm-up initiated');
            }

            this.logger.log('✅ Cache maintenance completed');

            return {
                success: true,
                operations,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.logger.error('Error during cache maintenance:', error);
            return {
                success: false,
                operations: [...operations, `Error: ${error.message}`],
                timestamp: new Date().toISOString()
            };
        }
    }

    async troubleshootInconsistentData(scope: 'all' | 'catalogs' | 'transactions' = 'all'): Promise<{
        success: boolean;
        actions: string[];
        recommendations: string[];
        timestamp: string;
    }> {
        const actions: string[] = [];

        try {
            this.logger.warn(`🔍 Troubleshooting inconsistent data - scope: ${scope}`);

            switch (scope) {
                case 'catalogs':
                    await this.cacheService.clearCatalogCache();
                    actions.push('Cleared catalog cache');
                    break;

                case 'all':
                    await this.cacheService.clearAllCache();
                    actions.push('Cleared all cache');
                    break;
            }

            // Check health after cleanup
            const health = await this.checkCacheHealth();

            return {
                success: true,
                actions,
                recommendations: health.recommendations,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.logger.error('Error during troubleshooting:', error);
            return {
                success: false,
                actions: [...actions, `Error: ${error.message}`],
                recommendations: ['Manual intervention may be required'],
                timestamp: new Date().toISOString()
            };
        }
    }

    async getDashboardData(): Promise<{
        health: any;
        stats: any;
        quickActions: Array<{
            name: string;
            description: string;
            endpoint: string;
            method: string;
        }>;
    }> {
        try {
            const [health, stats] = await Promise.all([
                this.checkCacheHealth(),
                this.getCacheStats()
            ]);

            const quickActions = [
                {
                    name: 'Clear Catalogs',
                    description: 'Clear TransactionType and TransactionStatus cache',
                    endpoint: '/admin/cache/catalogs',
                    method: 'DELETE'
                },
                {
                    name: 'Clear Transactions',
                    description: 'Clear all transaction cache',
                    endpoint: '/admin/cache/transactions',
                    method: 'DELETE'
                },
                {
                    name: 'Health Check',
                    description: 'Check cache health and get recommendations',
                    endpoint: '/admin/cache/health',
                    method: 'GET'
                },
                {
                    name: 'Maintenance',
                    description: 'Perform full cache maintenance',
                    endpoint: '/admin/cache/maintenance',
                    method: 'POST'
                }
            ];

            return {
                health,
                stats,
                quickActions
            };
        } catch (error) {
            this.logger.error('Error getting dashboard data:', error);
            throw error;
        }
    }
}
