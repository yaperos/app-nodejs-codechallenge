import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ssl: false,
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'postgres',
      database: 'transaction',
      port: 5433,
      autoLoadEntities: true,
      synchronize: true,
      //migrations: [__dirname + '../migrations/*{.ts,.js}'],
      //name: 'write-connection'
    })
  ],
})
export class PostgresModule {}
