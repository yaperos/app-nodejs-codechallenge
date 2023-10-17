import { ConfigService } from "@nestjs/config";
import { Transaction } from "../../entities/transaction.entity";
import { DataSource } from "typeorm";
export const databaseProviders = [
  {
    provide: "POSTGRES_DATASOURCE",
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: "postgres",
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
        entities: [Transaction],
        synchronize: configService.get("database.sync"),
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
