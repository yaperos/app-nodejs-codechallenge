import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrometheusMod } from './modules/prometheus.module';
import { GraphQLMod } from './modules/graphql.module';
import { ConfigMod } from './modules/config.module';
import { TransactionModule } from './modules/transaction.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { TypeOrmMod } from './modules/typeorm.module';

@Module({
  imports: [
    PrometheusMod,
    ConfigMod,
    TransactionModule,
    GraphQLMod,
    TypeOrmMod
  ],
  providers: [TypeOrmConfigService],
  controllers: [AppController],
})
export class AppModule {}
