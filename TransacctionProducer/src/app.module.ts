import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/web/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './application/services/transaction.service';
import { OrmTransactionRepository } from './domain/repositories/orm-transaction.repository';
import { Transaction } from './domain/models/entities/transaction.entity';
import { HttpModule } from '@nestjs/axios';
import { Kafka } from 'kafkajs';
import { KafkaService } from './application/services/kafka.service';


/**
 * Provides metadata that Nest makes use of
 * to organize the application structure.
 *
 * @export
 * @class AppModule
 */
@Module({
  imports: [HttpModule,AuthModule,
      //TypeOrmModule.forRoot(typeOrmConfig), 
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.server,
        port:  parseInt(process.env.port),
        username: process.env.username, 
        password: process.env.password, 
        database: process.env.database, 
        autoLoadEntities: true,
        //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        //entities: [__dirname + '/../**/*.entity.js'],
        synchronize: false,
      }),
      TypeOrmModule.forFeature([Transaction]) ],
  controllers: [AppController],
  providers: [AppService,TransactionService,OrmTransactionRepository, KafkaService],
})
export class AppModule {}
