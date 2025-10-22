import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { ThrottlerModule } from "@nestjs/throttler";
import { BullModule } from "@nestjs/bull";
import { TerminusModule } from "@nestjs/terminus";
import { TransactionModule } from "./infrastructure/modules/transaction.module";
import { KafkaModule } from "./infrastructure/kafka/kafka.module";
import { HealthModule } from "./infrastructure/health/health.module";
import { AntifraudModule } from "./infrastructure/modules/antifraud.module";
import { MonitoringModule } from "./infrastructure/monitoring/monitoring.module";
import { RedisConfig } from "./infrastructure/config/redis.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get("NODE_ENV") === "production";
        const enableReplicas =
          configService.get("DB_ENABLE_REPLICAS") === "true" ||
          configService.get("DB_ENABLE_REPLICAS") === true;

        const baseConfig = {
          type: "postgres" as const,
          database: configService.get("DB_DATABASE", "yape_transactions"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: configService.get("DB_SYNCHRONIZE", false),
          logging: configService.get("DB_LOGGING", false),
          maxQueryExecutionTime: 1000,
          extra: {
            max: configService.get("DB_POOL_MAX", 100),
            min: configService.get("DB_POOL_MIN", 10),
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 30000,
            statement_timeout: 30000,
            query_timeout: 30000,
            prepare: true,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          },
          cache: {
            type: "redis" as const,
            options: {
              host: configService.get("REDIS_HOST", "localhost"),
              port: configService.get("REDIS_PORT", 6379),
            },
            duration: 60000,
          },
        };

        if (enableReplicas) {
          return {
            ...baseConfig,
            replication: {
              master: {
                host: configService.get("DB_MASTER_HOST", "localhost"),
                port: configService.get("DB_MASTER_PORT", 5432),
                username: configService.get("DB_USERNAME", "yape_user"),
                password: configService.get("DB_PASSWORD", "yape_password123"),
              },
              slaves: [
                {
                  host: configService.get("DB_REPLICA1_HOST", "localhost"),
                  port: configService.get("DB_REPLICA1_PORT", 5433),
                  username: configService.get("DB_USERNAME", "yape_user"),
                  password: configService.get(
                    "DB_PASSWORD",
                    "yape_password123"
                  ),
                },
                {
                  host: configService.get("DB_REPLICA2_HOST", "localhost"),
                  port: configService.get("DB_REPLICA2_PORT", 5434),
                  username: configService.get("DB_USERNAME", "yape_user"),
                  password: configService.get(
                    "DB_PASSWORD",
                    "yape_password123"
                  ),
                },
              ].filter((slave) => slave.host),
            },
          };
        }

        return {
          ...baseConfig,
          host: configService.get("DB_HOST", "localhost"),
          port: configService.get("DB_PORT", 5432),
          username: configService.get("DB_USERNAME", "yape_user"),
          password: configService.get("DB_PASSWORD", "yape_password123"),
        };
      },
      inject: [ConfigService],
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        RedisConfig.getCacheRedisConfig(configService),
      inject: [ConfigService],
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get("RATE_LIMIT_TTL", 60) * 1000,
            limit: configService.get("RATE_LIMIT_LIMIT", 100),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        RedisConfig.getBullRedisConfig(configService),
      inject: [ConfigService],
    }),

    TerminusModule,

    TransactionModule,
    AntifraudModule,
    KafkaModule,
    HealthModule,
    MonitoringModule,
  ],
})
export class AppModule {}
