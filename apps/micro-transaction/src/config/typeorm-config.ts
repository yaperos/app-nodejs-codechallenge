import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { TransactionType } from "../transaction/entities/transactionType";
import { Transaction } from "../transaction/entities/transaction";
import { TransactionStatus } from "../transaction/entities/transactionStatus";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    constructor(
        @Inject(ConfigService) 
        private readonly configService : ConfigService
    ){}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            entities: [Transaction, TransactionStatus, TransactionType],
            synchronize: true,
            autoLoadEntities: true
        };
    }
}