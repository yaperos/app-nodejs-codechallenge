import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes';
import { Transaction } from './entities/transaction.entity';
import { TransactionProfile } from './profile/transaction.profile';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { CreateTransactionCommandHandler } from './operations/commands/create/create.transaction.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UpdateTransactionCommandHandler } from './operations/commands/update/update.transaction.handler';
import { GetTransactionQueryHandler } from './operations/queries/get/get.transaction.handler';
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    TypeOrmModule.forFeature([Transaction]),
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [
    TransactionController
  ],
  providers: [
    TransactionProfile, 
    TransactionService, 
    CreateTransactionCommandHandler,
    UpdateTransactionCommandHandler,
    GetTransactionQueryHandler  
  ],
})
export class AppModule {}
