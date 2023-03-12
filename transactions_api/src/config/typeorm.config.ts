import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist";
import { Transaction } from "src/transactions/entities/Transaction.entity";
import { TransactionStatus } from "src/transactions/entities/TransactionStatus.entity";
import { TransactionType } from "src/transactions/entities/TransactionType.entity";
import { DatabaseConfig, TypeOrmConfig } from "./config";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        const db_config = this.configService.get<DatabaseConfig>("database");
        const typeorm_config = this.configService.get<TypeOrmConfig>("typeorm");

        return {
            type: "postgres",
            host: db_config.host,
            port: db_config.port,
            username: db_config.user,
            password: db_config.password,
            database: typeorm_config.database,
            entities: [Transaction, TransactionType, TransactionStatus],
            synchronize: typeorm_config.synchronize(),
        };
    }
}