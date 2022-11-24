import { Module } from "@nestjs/common";
import { MongoModule } from "./mongo/mongo.module";
import { PostgresModule } from "./postgres/postgres.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule, MongoModule, PostgresModule],
  exports: [ConfigModule, MongoModule, PostgresModule],
})
export class DatabaseModule {
}
