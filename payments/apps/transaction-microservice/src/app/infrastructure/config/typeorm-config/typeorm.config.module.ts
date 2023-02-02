import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionStatus } from '../../entities/transaction-status.entity';
import { TransactionType } from '../../entities/transaction-type.entity';
import { InitialMigration1675076749078 } from 'apps/transaction-microservice/src/database/migrations/1675076749078-initial-migration';
import { Transaction } from '../../entities/transaction.entity';
import { EnvironmentConfigModule } from '../environment-config/environment.config.module';
import { EnvironmentConfigService } from '../environment-config/environment.config.service';

export const getTypeOrmModuleOptions = (config: EnvironmentConfigService): TypeOrmModuleOptions =>({
    type: 'postgres',
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    entities: [ Transaction, TransactionType, TransactionStatus ],
    synchronize: config.getDatabaseSync(),
    migrationsRun: true,
    migrations: [ InitialMigration1675076749078 ],
    cli: {
        migrationsDir: 'src/database/migrations',
    }
} as TypeOrmModuleOptions);


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [EnvironmentConfigModule],
            inject: [EnvironmentConfigService],
            useFactory: getTypeOrmModuleOptions
        })
    ]
})
export class TypeOrmConfigModule {}
