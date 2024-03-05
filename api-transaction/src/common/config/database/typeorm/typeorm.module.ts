import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvironmentModule } from "../../environment";
import { TypeOrmConfigService } from "./typeorm.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class TypeOrmDatabaseModule { };