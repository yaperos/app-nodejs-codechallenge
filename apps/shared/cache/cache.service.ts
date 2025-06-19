import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';


@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name);
    private readonly redis: Redis;
    private readonly defaultTTL: number;

    constructor(private configService: ConfigService) {
        this.redis = new Redis({
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
            password: this.configService.get('REDIS_PASSWORD'),
            enableReadyCheck: true,
            maxRetriesPerRequest: 3,
        });

        this.defaultTTL = this.configService.get('CACHE_DEFAULT_TTL', 300); // 5 minutes
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.redis.on('connect', () => {
            this.logger.log('Connected to Redis');
        });

        this.redis.on('error', (error) => {
            this.logger.error('Redis connection error:', error);
        });
    }

    /**
     * Get data from cache with fallback to database
     */
    async getOrSet<T>(
        key: string,
        fetchFunction: () => Promise<T>,
        ttl: number = this.defaultTTL,
    ): Promise<T> {
        try {
            // Try to get from cache first
            const cached = await this.get<T>(key);
            if (cached !== null) {
                this.logger.debug(`Cache HIT for key: ${key}`);
                return cached;
            }

            this.logger.debug(`Cache MISS for key: ${key}`);

            // Fetch from database
            const data = await fetchFunction();

            // Store in cache
            await this.set(key, data, ttl);

            return data;
        } catch (error) {
            this.logger.error(`Cache operation failed for key ${key}:`, error);
            // Fallback to direct database call
            return await fetchFunction();
        }
    }

    /**
     * Get data from cache
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            this.logger.error(`Failed to get cache key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set data in cache
     */
    async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
            this.logger.debug(`Cache SET for key: ${key}, TTL: ${ttl}s`);
        } catch (error) {
            this.logger.error(`Failed to set cache key ${key}:`, error);
        }
    }

    /**
     * Delete data from cache
     */
    async del(key: string): Promise<void> {
        try {
            await this.redis.del(key);
            this.logger.debug(`Cache DELETE for key: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to delete cache key ${key}:`, error);
        }
    }

    /**
     * Delete multiple keys matching pattern
     */
    async delPattern(pattern: string): Promise<void> {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                this.logger.debug(`Cache DELETE pattern: ${pattern}, deleted ${keys.length} keys`);
            }
        } catch (error) {
            this.logger.error(`Failed to delete cache pattern ${pattern}:`, error);
        }
    }

    /**
     * Check if Redis is connected
     */
    async isConnected(): Promise<boolean> {
        try {
            await this.redis.ping();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get cache statistics
     */
    async getStats(): Promise<any> {
        try {
            const info = await this.redis.info('memory');
            return {
                connected: await this.isConnected(),
                memory: info,
            };
        } catch (error) {
            this.logger.error('Failed to get cache stats:', error);
            return { connected: false, error: error.message };
        }
    }

    // Cache key generators
    static generateKey(prefix: string, id: string | number): string {
        return `${prefix}:${id}`;
    }

    static generateListKey(prefix: string): string {
        return `${prefix}:list`;
    }

    // TTL constants
    static readonly TTL = {
        CATALOG: 86400, // 24 hours for catalogs (TransactionType, TransactionStatus)
        TRANSACTION: 900, // 15 minutes for transactions
        CONFIG: 300, // 5 minutes for configurations
        SESSION: 3600, // 1 hour for sessions
    };

    // Cache key prefixes
    static readonly KEYS = {
        TRANSACTION_STATUS: 'tx_status',
        TRANSACTION_TYPE: 'tx_type',
        TRANSACTION: 'transaction',
        FRAUD_CONFIG: 'fraud_config',
        USER_SESSION: 'user_session',
    };

    async clearCatalogCache(): Promise<void> {
        try {
            await Promise.all([
                this.delPattern(`${CacheService.KEYS.TRANSACTION_STATUS}:*`),
                this.delPattern(`${CacheService.KEYS.TRANSACTION_TYPE}:*`),
            ]);
            this.logger.log('Cleared all catalog caches');
        } catch (error) {
            this.logger.error('Error clearing catalog cache:', error);
        }
    }

    async clearAllCache(): Promise<void> {
        try {
            await Promise.all([
                this.clearCatalogCache(),
                this.delPattern(`${CacheService.KEYS.FRAUD_CONFIG}:*`),
                this.delPattern(`${CacheService.KEYS.USER_SESSION}:*`),
            ]);
            this.logger.log('Cleared ALL application caches');
        } catch (error) {
            this.logger.error('Error clearing all cache:', error);
        }
    }

    /**
     * Get cache statistics with detailed information
     */
    async getDetailedStats(): Promise<any> {
        try {
            const [memoryInfo, connected, keyPatterns] = await Promise.all([
                this.redis.info('memory'),
                this.isConnected(),
                this.getCacheKeyStats()
            ]);

            return {
                connected,
                memory: this.parseMemoryInfo(memoryInfo),
                keyStats: keyPatterns,
                service: 'CacheService',
                timestamp: new Date().toISOString(),
                recommendations: this.generateHealthRecommendations(connected, memoryInfo)
            };
        } catch (error) {
            this.logger.error('Failed to get detailed cache stats:', error);
            return {
                connected: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get statistics for each cache key pattern
     */
    private async getCacheKeyStats(): Promise<any> {
        try {
            const stats: any = {};

            for (const [name, pattern] of Object.entries(CacheService.KEYS)) {
                const keys = await this.redis.keys(`${pattern}:*`);
                stats[name.toLowerCase()] = {
                    pattern: `${pattern}:*`,
                    count: keys.length,
                    sampleKeys: keys.slice(0, 3) // First 3 keys as sample
                };
            }

            return stats;
        } catch (error) {
            this.logger.error('Error getting cache key stats:', error);
            return {};
        }
    }

    /**
     * Parse Redis memory info into readable format
     */
    private parseMemoryInfo(memoryInfo: string): any {
        const parsed: any = {};

        memoryInfo.split('\n').forEach(line => {
            if (line.includes(':')) {
                const [key, value] = line.split(':');
                if (key.includes('memory') || key.includes('Memory')) {
                    parsed[key.trim()] = value.trim();
                }
            }
        });

        return parsed;
    }

    /**
     * Generate health recommendations based on cache status
     */
    private generateHealthRecommendations(connected: boolean, memoryInfo: string): string[] {
        const recommendations: string[] = [];

        if (!connected) {
            recommendations.push('🚨 Redis is not connected - check Redis server status');
            recommendations.push('🔧 Verify Redis configuration and network connectivity');
        }

        if (memoryInfo.includes('maxmemory_policy:noeviction')) {
            recommendations.push('⚠️ Redis eviction policy is set to noeviction - consider changing to allkeys-lru');
        }

        // Check for high memory usage (simplified check)
        const usedMemoryMatch = memoryInfo.match(/used_memory:(\d+)/);
        if (usedMemoryMatch) {
            const usedMemory = parseInt(usedMemoryMatch[1]);
            if (usedMemory > 1024 * 1024 * 100) { // > 100MB
                recommendations.push('💾 High memory usage detected - consider cache cleanup or TTL adjustment');
            }
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ Cache is healthy - no actions needed');
        }

        return recommendations;
    }

    /**
     * Warm up cache with essential data
     */
    async warmUpCache(): Promise<void> {
        try {
            this.logger.log('🔥 Starting cache warm-up...');

            // This method should be called with actual data loading logic
            // For now, just log the intent
            this.logger.log('Cache warm-up completed - ready for data loading');

        } catch (error) {
            this.logger.error('Error during cache warm-up:', error);
        }
    }
}
