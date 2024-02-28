import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { join } from 'path';
import { TransactionService } from '../../Application/Services/TransactionService';
import { Transaction } from '../../Domain/Entitys';
import { TransactionResolver } from './TransactionResolver';
import {
  RedisDomainService,
  ProducerKafkaDomainService,
} from 'src/Domain/Services/';
import { RedisRepository, ProducerKafkaRepository } from '../Repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        ttl: 1000 * 60,
        store: (await redisStore({
          url: configService.get<string>('REDIS_URL'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/GraphQl/schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT'),
        password: configService.get<string>('PG_PASSWORD'),
        username: configService.get<string>('PG_USERNAME'),
        database: configService.get<string>('PG_DATABASE'),
        logging: true,
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [],
  providers: [
    RedisDomainService,
    ProducerKafkaDomainService,
    {
      provide: 'RedisInterfaceRepository',
      useClass: RedisRepository,
    },
    {
      provide: 'ProducerKafkaInterfaceRepository',
      useClass: ProducerKafkaRepository,
    },
    TransactionService,
    TransactionResolver,
  ],
})
export class TransactionModule {}
