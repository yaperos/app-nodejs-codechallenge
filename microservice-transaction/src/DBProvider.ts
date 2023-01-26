import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource, EntityManager } from "typeorm";
import { TransactionEntity } from "./infrastructure/entities/transaction.entity";

let manager: EntityManager;
@Injectable()
export class DBProvider{
    private dataSource:DataSource | void;
    constructor(private readonly configService: ConfigService) {}
    private dbConfigPostgres (){
        return {
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            synchronize: true,
        }
    }

    async onModuleInit(){
        const config = this.dbConfigPostgres();
        const entities = [TransactionEntity];
        this.dataSource = await new DataSource({
            type: 'postgres',
            ...config,
            entities,
        }).initialize().catch((err) => {
            console.log(err);
            process.exit(1);
        });

        manager = (this.dataSource as DataSource).manager;
    }  

    static get manager(): EntityManager {
        return manager;
    }
}