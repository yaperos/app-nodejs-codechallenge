import type { ConfigService } from '@nestjs/config';
import type Redis from 'ioredis';
import { RedisService } from './redis.service';

jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => mockRedisClient);
});

let mockRedisClient: jest.Mocked<Redis>;

describe('RedisService', () => {
    let service: RedisService;
    let mockConfigService: jest.Mocked<ConfigService>;

    beforeEach(() => {
        mockRedisClient = {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            disconnect: jest.fn(),
        } as any;

        mockConfigService = {
            get: jest.fn(),
        } as any;

        service = new RedisService(mockConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('onModuleInit', () => {
        it('should initialize Redis with URL when REDIS_URL is provided', () => {
            mockConfigService.get.mockReturnValue('redis://localhost:6379');

            service.onModuleInit();

            expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_URL');
        });

        it('should throw error when REDIS_URL is not provided', () => {
            mockConfigService.get.mockImplementation((key: string) => {
                if (key === 'REDIS_URL') return null;
                return undefined;
            });

            expect(() => service.onModuleInit()).toThrow('REDIS_URL environment variable is required');
            expect(mockConfigService.get).toHaveBeenCalledWith('REDIS_URL');
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect Redis client', () => {
            mockConfigService.get.mockReturnValue('redis://localhost:6379');
            service.onModuleInit();
            service.onModuleDestroy();

            expect(mockRedisClient.disconnect).toHaveBeenCalled();
        });
    });

    describe('get', () => {
        beforeEach(() => {
            mockConfigService.get.mockReturnValue('redis://localhost:6379');
            service.onModuleInit();
        });

        it('should get and parse JSON data from Redis', async () => {
            const data = { id: 1, name: 'test' };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(data));

            const result = await service.get('test-key');

            expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
            expect(result).toEqual(data);
        });

        it('should return null when key does not exist', async () => {
            mockRedisClient.get.mockResolvedValue(null);

            const result = await service.get('non-existent-key');

            expect(result).toBeNull();
        });

        it('should handle complex objects', async () => {
            const complexData = {
                id: 123,
                nested: {
                    value: 'test',
                    array: [1, 2, 3],
                },
            };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(complexData));

            const result = await service.get<typeof complexData>('complex-key');

            expect(result).toEqual(complexData);
        });

        it('should handle arrays', async () => {
            const arrayData = [1, 2, 3, 4, 5];
            mockRedisClient.get.mockResolvedValue(JSON.stringify(arrayData));

            const result = await service.get<number[]>('array-key');

            expect(result).toEqual(arrayData);
        });
    });

    describe('set', () => {
        beforeEach(() => {
            mockConfigService.get.mockReturnValue('redis://localhost:6379');
            service.onModuleInit();
        });

        it('should set data with default TTL', async () => {
            const data = { id: 1, name: 'test' };

            await service.set('test-key', data);

            expect(mockRedisClient.set).toHaveBeenCalledWith('test-key', JSON.stringify(data), 'EX', 600);
        });

        it('should set data with custom TTL', async () => {
            const data = { id: 1, name: 'test' };
            const ttl = 3600;

            await service.set('test-key', data, ttl);

            expect(mockRedisClient.set).toHaveBeenCalledWith('test-key', JSON.stringify(data), 'EX', 3600);
        });

        it('should serialize complex objects', async () => {
            const complexData = {
                id: 123,
                nested: {
                    value: 'test',
                    array: [1, 2, 3],
                },
            };

            await service.set('complex-key', complexData);

            expect(mockRedisClient.set).toHaveBeenCalledWith('complex-key', JSON.stringify(complexData), 'EX', 600);
        });

        it('should handle string values', async () => {
            await service.set('string-key', 'simple string');

            expect(mockRedisClient.set).toHaveBeenCalledWith('string-key', '"simple string"', 'EX', 600);
        });

        it('should handle number values', async () => {
            await service.set('number-key', 12345);

            expect(mockRedisClient.set).toHaveBeenCalledWith('number-key', '12345', 'EX', 600);
        });
    });

    describe('del', () => {
        beforeEach(() => {
            mockConfigService.get.mockReturnValue('redis://localhost:6379');
            service.onModuleInit();
        });

        it('should delete a key from Redis', async () => {
            await service.del('test-key');

            expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
        });

        it('should handle deletion of non-existent keys', async () => {
            mockRedisClient.del.mockResolvedValue(0);

            await service.del('non-existent-key');

            expect(mockRedisClient.del).toHaveBeenCalledWith('non-existent-key');
        });
    });
});
