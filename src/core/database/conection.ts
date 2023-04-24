import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Transactions } from 'transaction/model/entity/transactions.entity';
import { DatabaseType } from 'typeorm';

class ConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
      var type: DatabaseType;
      switch(process.env.DB_TYPE){
          case "mysql":
              type = "mysql";
          case "postgres" :
              type = "postgres";
          case "cockroachdb" :
              type = "cockroachdb";
          case "sap" :
              type = "sap";
          case "mariadb"  :
              type = "mariadb";
          case "sqlite"  :
              type = "sqlite";
          case "cordova"  :
              type = "cordova";
          case "react-native" :
              type = "react-native";
          case "nativescript" :
              type = "nativescript";
          case "sqljs" :
              type = "sqljs";
          case "oracle" :
              type = "oracle";
          case "mssql" :
              type = "mssql";
          case "mongodb" :
              type = "mongodb";
          case "aurora-mysql" :
              type = "aurora-mysql";
          case "aurora-postgres" :
              type = "aurora-postgres";
          case "expo" :
              type = "expo";
          case "better-sqlite3" :
              type = "better-sqlite3";
          case "capacitor" :
              type = "capacitor";
          case "spanner" :
              type = "spanner";
          default:
              type = 'postgres';
      }
      return {
          type: type,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [Transactions],
          synchronize: process.env.DB_SYNCHRONIZE ? true : false
      }
  }
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: ConfigService
    }),
  ],
})

export class ConnectionDb {}