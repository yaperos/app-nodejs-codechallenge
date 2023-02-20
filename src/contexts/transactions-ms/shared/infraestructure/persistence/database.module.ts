import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from '../../../transaction/infraestructure/persistence/entities/transaction.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get('POSTGRES_HOST'),
                    port: +configService.get('POSTGRES_PORT'),
                    username: configService.get('POSTGRES_USER'),
                    password: configService.get('POSTGRES_PASSWORD'),
                    database: configService.get('POSTGRES_DB'),
                    entities: [Transaction],
                    synchronize: true, // For practice purposes
                    autoLoadEntities: true,
                    migrationsTableName: 'migrations',
                    migrations: [
                        'src/contexts/shared/infraestructure/persistence/migrations/*.ts',
                    ],
                    cli: {
                        migrationsDir:
                            'src/contexts/shared/infraestructure/persistence/migrations',
                    },
                };
            },
        }),
    ],
    exports: [TypeOrmModule],
})
class DatabaseModule {}

export default DatabaseModule;
