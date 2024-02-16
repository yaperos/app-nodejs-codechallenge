import { Module } from "@nestjs/common";
import CommonModule from "./common/common.module";
import { ConfigModule } from "@nestjs/config";
import JoiValidation from "./common/config/env.config";
import { dataSourceOptions } from "../../../config/database/database.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import TransactionModule from "./transaction/transaction.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CommonModule,
    TransactionModule,
  ],
})
export default class AppModule {}
